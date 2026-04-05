'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Trophy, Calendar, Users, ChevronRight } from 'lucide-react';

import type { Hackathon, Submission, Team } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getDday } from '@/lib/date';
import { useHackathonStore } from '@/store/useHackathonStore';
import {
  computeHackathonRecruitmentStatus,
  getHackathonEndMeta,
  getHackathonStageMeta,
  getRecruitmentStatusLabel,
} from '@/lib/hackathon-utils';

interface Props {
  hackathon: Hackathon;
  team?: Team;
  submission?: Submission;
  variant?: 'default' | 'small';
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'upcoming':
      return <Badge className="bg-sky-100 text-sky-700 border-none font-bold">예정</Badge>;
    case 'ongoing':
      return <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">진행중</Badge>;
    case 'ended':
      return <Badge className="bg-slate-100 text-slate-600 border-none font-bold">종료</Badge>;
    default:
      return null;
  }
};

const getSubmissionStatus = (status: string) => {
  switch (status) {
    case 'submitted':
      return { text: '제출 완료', color: 'text-emerald-300', bg: 'bg-emerald-500/20' };
    case 'draft':
      return { text: '임시 저장', color: 'text-amber-300', bg: 'bg-amber-500/20' };
    default:
      return { text: '미제출', color: 'text-slate-300', bg: 'bg-slate-500/20' };
  }
};

export default function HackathonTradingCard({ hackathon, team, submission, variant = 'default' }: Props) {
  const router = useRouter();
  const { hackathonDetails } = useHackathonStore();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(relX);
    y.set(relY);

    setGlarePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  const detail = hackathonDetails[hackathon.slug];
  const endMeta = getHackathonEndMeta(hackathon, detail);
  const stageMeta = getHackathonStageMeta(hackathon, detail);
  const recruitmentStatus = computeHackathonRecruitmentStatus(hackathon, detail);
  const countdownMeta = stageMeta ?? endMeta;
  const deadline = countdownMeta.targetAt.toISOString();
  const subStatus = getSubmissionStatus(submission?.status || 'none');

  return (
    <div className="perspective-1000">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => router.push(`/hackathons/${hackathon.slug}`)}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'relative aspect-[5/7] rounded-2xl overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10 w-full mx-auto',
          variant === 'default' ? 'max-w-[300px]' : 'max-w-[220px]'
        )}
      >
        <div className="absolute inset-0 bg-slate-900 opacity-95 transition-opacity" />

        {hackathon.thumbnailUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 saturate-50 grayscale-[20%]"
            style={{ backgroundImage: `url(${hackathon.thumbnailUrl})` }}
          />
        )}

        <div
          className={cn(
            'absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color-dodge',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: `radial-gradient(circle 200px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.4), transparent 80%)`,
            zIndex: 10,
          }}
        />

        <div
          className={cn(
            'absolute inset-0 pointer-events-none mix-blend-hard-light transition-opacity duration-500',
            isHovered ? 'opacity-40' : 'opacity-0'
          )}
          style={{
            backgroundImage:
              'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 55%, transparent 60%)',
            backgroundSize: '250% 250%',
            backgroundPosition: isHovered ? `${glarePosition.x}% ${glarePosition.y}%` : '100% 100%',
          }}
        />

        <div
          className="absolute inset-0 p-5 flex flex-col justify-between text-white drop-shadow-md z-20 pointer-events-none"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <div className="bg-black/30 backdrop-blur-md rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider w-fit border border-white/20 uppercase shadow-sm">
                {hackathon.type}
              </div>
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(hackathon.status)}
                {hackathon.status === 'ongoing' && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'border-white/20 font-bold',
                      recruitmentStatus === 'recruiting'
                        ? 'bg-white/10 text-white'
                        : 'bg-white/10 text-slate-200'
                    )}
                  >
                    {getRecruitmentStatusLabel(recruitmentStatus)}
                  </Badge>
                )}
              </div>
            </div>
            <div
              className={cn(
                'rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]',
                variant === 'default' ? 'w-11 h-11' : 'w-8 h-8'
              )}
            >
              <Trophy
                className={cn(
                  'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.25)]',
                  variant === 'default' ? 'w-5 h-5' : 'w-4 h-4'
                )}
              />
            </div>
          </div>

          <div className="flex-1 flex items-center py-4">
            <h3 className={cn('font-black leading-snug drop-shadow-lg text-white', variant === 'default' ? 'text-2xl' : 'text-lg')}>
              {hackathon.title}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-inner space-y-2">
              <div className="flex justify-between items-center opacity-95">
                <span
                  className={cn(
                    'flex items-center gap-1.5 font-medium text-slate-200 line-clamp-1',
                    variant === 'default' ? 'text-[13px]' : 'text-[11px]'
                  )}
                >
                  <Users className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="truncate max-w-[100px]">{team ? team.name : '참여 팀 없음'}</span>
                </span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-md font-bold tracking-wide border border-white/10 whitespace-nowrap shrink-0',
                    subStatus.bg,
                    subStatus.color,
                    variant === 'default' ? 'text-[11px]' : 'text-[10px]'
                  )}
                >
                  {subStatus.text}
                </span>
              </div>

              <div className="flex justify-between items-center opacity-95">
                <span className={cn('flex items-center gap-1.5 font-medium text-slate-200', variant === 'default' ? 'text-[13px]' : 'text-[11px]')}>
                  <Calendar className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  {countdownMeta.countdownLabel}
                </span>
                <span
                  className={cn(
                    'font-bold',
                    getDday(deadline).startsWith('D-') && parseInt(getDday(deadline).slice(2), 10) <= 7
                      ? 'text-white'
                      : 'text-slate-100',
                    variant === 'default' ? 'text-[13px]' : 'text-[11px]'
                  )}
                >
                  {getDday(deadline)}
                </span>
              </div>
            </div>

            {variant === 'default' && (
              <div className="flex items-center justify-center gap-1.5 text-[12px] font-bold text-white/70 group-hover:text-white transition-colors mt-2">
                상세 페이지로 이동 <ChevronRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
