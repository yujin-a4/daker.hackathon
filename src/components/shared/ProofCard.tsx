'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Award, Zap, Layout, Calendar, Clock, BarChart, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ActivityLog {
  activity: string;
  tool: string;
  time: string;
  difficulty: 'High' | 'Medium' | 'Low';
}

interface ProofCardProps {
  userActivityLog: ActivityLog;
  className?: string;
}

const ProofCard: React.FC<ProofCardProps> = ({ userActivityLog, className }) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'High': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden aspect-[1.6/1] w-full max-w-xl self-center border-none bg-card ring-1 ring-border shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all",
      className
    )}>
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.1),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/80 to-transparent z-10" />
      
      {/* Floating Sparkles/Particles effect (simulated with CSS) */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

      <div className="relative z-20 h-full flex flex-col p-8 justify-between">
        {/* Top Section: Badge & Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 border border-border backdrop-blur-md"
            >
              <Award size={16} className="text-cyan-600 dark:text-cyan-400" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-700 dark:text-cyan-300">Proof of Achievement</span>
            </motion.div>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl font-bold text-foreground tracking-tight leading-tight max-w-[80%]"
            >
              강유진 님이 AI와 함께 달린 증거: <br/>
              <span className="bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-500 bg-clip-text text-transparent italic">
                {userActivityLog.activity}
              </span> 완료!
            </motion.h2>
          </div>
          
          <div className="h-20 w-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-background border border-border shadow-lg group-hover:rotate-12 transition-transform duration-500">
             <div className="relative">
                <Layout size={40} className="text-cyan-500/30 absolute -translate-x-1 -translate-y-1" />
                <Layout size={40} className="text-foreground relative z-10" />
             </div>
          </div>
        </div>

        {/* Bottom Section: Details Grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Zap size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Main Tool</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{userActivityLog.tool}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Duration</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{userActivityLog.time}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BarChart size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Intensity</span>
              </div>
              <Badge variant="outline" className={cn("text-[10px] h-5 rounded-md px-2 border-border", getDifficultyColor(userActivityLog.difficulty))}>
                {userActivityLog.difficulty}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Signed At</span>
              </div>
              <p className="text-sm font-semibold text-foreground">2024.06.28</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                YJ
              </div>
              <span className="text-xs font-bold text-muted-foreground">Kang Yu-jin</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest border border-border rounded-lg px-3 py-1.5 hover:bg-muted font-bold">
                <Share2 size={12} />
                Export Card
              </button>
              <button className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors uppercase tracking-widest border border-cyan-500/30 rounded-lg px-3 py-1.5 bg-cyan-500/5 font-bold">
                <ExternalLink size={12} />
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side Stamp effect */}
      <div className="absolute top-1/2 -right-16 -translate-y-1/2 flex flex-col gap-2 items-center rotate-90 opacity-5 dark:opacity-10 pointer-events-none select-none">
        <span className="text-6xl font-black text-foreground whitespace-nowrap tracking-[1em]">CERTIFIED</span>
        <span className="text-6xl font-black text-foreground whitespace-nowrap tracking-[1em]">AI BUILDER</span>
      </div>
    </Card>

  );
};

export default ProofCard;
