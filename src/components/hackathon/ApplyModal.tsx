'use client';

import { useState } from 'react';
import { 
  Users, 
  User, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Sparkles
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ApplyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hackathonSlug: string;
  hackathonTitle: string;
  teamPolicy: {
    allowSolo: boolean;
    maxTeamSize: number;
  };
  onSwitchToTeams: () => void;
  onCreateTeam: () => void;
  onRequireAuth: () => boolean;
}

export default function ApplyModal({
  isOpen,
  onOpenChange,
  hackathonSlug,
  hackathonTitle,
  teamPolicy,
  onSwitchToTeams,
  onCreateTeam,
  onRequireAuth,
}: ApplyModalProps) {
  const { addTeam } = useTeamStore();
  const { currentUser, addTeamCode } = useUserStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinSolo = async () => {
    if (!onRequireAuth() || !currentUser) return;
    
    setIsSubmitting(true);
    try {
      // 1. 개인 팀 생성 (isSolo: true)
      const newTeam = addTeam({
        hackathonSlug,
        name: `${currentUser.nickname} (Solo)`,
        isOpen: false, // 개인 참가는 모집하지 않음
        isPrivate: true,
        isSolo: true,
        leaderId: currentUser.id,
        memberCount: 1,
        maxTeamSize: 1,
        lookingFor: [],
        intro: `${hackathonTitle}에 개인으로 참가합니다!`,
        contact: { type: 'email', url: currentUser.email },
      });

      // 2. 유저에게 팀 코드 추가
      addTeamCode(newTeam.teamCode);

      toast({
        title: "참가 신청 완료!",
        description: "개인 자격으로 참가가 확정되었습니다. 베이스캠프에서 프로젝트를 시작하세요!",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "신청 실패",
        description: "문제가 발생했습니다. 다시 시도해 주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl" />
          
          <DialogHeader className="relative z-10 space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-white/20 hover:bg-white/30 border-none text-white font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">
                Participation Guide
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight leading-tight text-white">
              {hackathonTitle}
            </DialogTitle>
            <DialogDescription className="text-indigo-100 font-medium">
              원하시는 참가 형식을 선택해 주세요.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 bg-white dark:bg-slate-950 space-y-6">
          {/* Policy Info */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <div className="mt-0.5 bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Info className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">대회 참가 정책</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                이 대회는 최대 <strong className="text-indigo-600 dark:text-indigo-400">{teamPolicy.maxTeamSize}명</strong>까지 팀을 구성할 수 있으며, 
                {teamPolicy.allowSolo ? " 개인 참가가 가능합니다." : " 반드시 팀을 꾸려야 합니다."}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {/* Solo Option */}
            <button
              onClick={handleJoinSolo}
              disabled={!teamPolicy.allowSolo || isSubmitting}
              className={cn(
                "group flex items-center p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden",
                teamPolicy.allowSolo 
                  ? "border-slate-100 hover:border-indigo-500 bg-white hover:bg-indigo-50/30 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-indigo-500 shadow-sm hover:shadow-md" 
                  : "border-slate-100 bg-slate-50 cursor-not-allowed opacity-60 dark:bg-slate-900 dark:border-slate-800"
              )}
            >
              <div className={cn(
                "p-3 rounded-xl mr-4 transition-colors",
                teamPolicy.allowSolo ? "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white" : "bg-slate-200 text-slate-400"
              )}>
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">나홀로 참가하기 (Solo)</h4>
                  {teamPolicy.allowSolo && (
                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-bold h-5">추천</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">혼자서 프로젝트를 완주하고 싶을 때 선택하세요.</p>
              </div>
              <ArrowRight className={cn("w-5 h-5 transition-all", teamPolicy.allowSolo ? "text-indigo-300 group-hover:translate-x-1 group-hover:text-indigo-500" : "text-slate-300")} />
            </button>

            {/* Team Find Option */}
            <button
              onClick={() => {
                if (!onRequireAuth()) return;
                onSwitchToTeams();
                onOpenChange(false);
              }}
              className="group flex items-center p-4 rounded-2xl border-2 border-slate-100 hover:border-amber-500 bg-white hover:bg-amber-50/30 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-amber-500 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600 mr-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">모집 중인 팀 찾기</h4>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">시너지를 낼 수 있는 멋진 팀원들을 만나보세요.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 group-hover:text-amber-500 transition-all" />
            </button>

            {/* Team Create Option */}
            <button
              onClick={() => {
                if (!onRequireAuth()) return;
                onCreateTeam();
                onOpenChange(false);
              }}
              className="group flex items-center p-4 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 mr-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">새로운 팀 만들기</h4>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">직접 아이디어를 제안하고 팀원을 모집하세요.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 uppercase font-bold tracking-widest">
            <Sparkles className="w-3 h-3" />
            Enjoy Hackathon Experience
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
