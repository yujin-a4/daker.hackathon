'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Circle, Rocket, Terminal, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Stage = 'planning' | 'prompting' | 'deploying';

interface HackathonStatus {
  deadline: string;
  currentStage: Stage;
}

interface HackathonTrackerProps {
  hackathonStatus: HackathonStatus;
  className?: string;
}

const HackathonTracker: React.FC<HackathonTrackerProps> = ({ hackathonStatus, className }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(hackathonStatus.deadline) - +new Date();
      if (difference > 0) {
        return {
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [hackathonStatus.deadline]);

  const stages: { id: Stage; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'planning', label: 'Planning', icon: <Lightbulb size={20} />, description: '아이디어 구체화' },
    { id: 'prompting', label: 'Prompting', icon: <Terminal size={20} />, description: 'AI와 함께 개발' },
    { id: 'deploying', label: 'Deploying', icon: <Rocket size={20} />, description: '서비스 배포' },
  ];

  const currentStageIndex = stages.findIndex(s => s.id === hackathonStatus.currentStage);
  const progressValue = ((currentStageIndex + 1) / stages.length) * 100;

  return (
    <Card className={cn("relative overflow-hidden border bg-card/80 backdrop-blur-md p-8 shadow-2xl", className)}>
      {/* Background Decorative Element */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header with Countdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent italic tracking-tight">Real-time Progress</h3>
            <p className="text-sm text-muted-foreground">
              마감까지 <span className="font-bold text-cyan-600 dark:text-cyan-400">{timeLeft.hours}시간 {timeLeft.minutes}분</span> 남음... 지금은 <span className="text-foreground font-bold underline decoration-cyan-500 underline-offset-4">[{stages[currentStageIndex].label}]</span> 단계! Vibe 맞춰서 가보자고!
            </p>
          </div>
          
          <div className="flex h-16 w-32 items-center justify-center rounded-2xl bg-muted border border-border shadow-inner">
            <div className="text-center">
              <span className="block text-2xl font-mono font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Time Remaining</span>
            </div>
          </div>
        </div>

        {/* Timeline visualization */}
        <div className="relative pt-4 pb-8">
          <div className="flex justify-between items-center relative gap-4">
            {/* Timeline Line Background */}
            <div className="absolute top-[21px] left-0 h-[2px] w-full bg-white/10 rounded-full" />
            
            {/* Timeline Line Active Progress */}
            <motion.div 
              className="absolute top-[21px] left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progressValue-15}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {stages.map((stage, idx) => {
              const isActive = stage.id === hackathonStatus.currentStage;
              const isCompleted = idx < currentStageIndex;
              
              return (
                <div key={stage.id} className="relative z-20 flex flex-col items-center gap-4 flex-1 group">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "h-11 w-11 flex items-center justify-center rounded-full transition-all duration-500 border-2",
                      isActive ? "bg-cyan-500 border-cyan-400 text-white shadow-[0_0_20px_rgba(34,211,238,0.4)]" : 
                      isCompleted ? "bg-muted border-cyan-500/50 text-cyan-600 dark:text-cyan-500" : 
                      "bg-secondary border-border text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <CheckCircle2 size={24} /> : stage.icon}
                  </motion.div>
                  
                  <div className="text-center group-hover:-translate-y-1 transition-transform">
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-widest transition-colors block",
                      isActive ? "text-cyan-600 dark:text-cyan-400" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/50"
                    )}>
                      {stage.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 block">{stage.description}</span>
                  </div>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-glow"
                      className="absolute -top-1 h-13 w-13 rounded-full bg-cyan-400/20 blur-md"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HackathonTracker;
