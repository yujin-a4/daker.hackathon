'use client';

import React, { useState, useMemo } from 'react';
import { Mail, CheckCircle2, Sparkles, UserPlus, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/store/useUserStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import type { Team, UserProfile } from '@/types';
import { users as userPool } from '@/data/seed';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface TeamMemberManagerProps {
  team: Team;
}

export default function TeamMemberManager({ team }: TeamMemberManagerProps) {
  const { currentUser } = useUserStore();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);

  // 팀장 여부 확인
  const isLeader = currentUser?.id === team.leaderId;

  // AI 매칭 로직: team.lookingFor 와 user.role/skills 를 비교
  const recommendedUsers = useMemo(() => {
    if (!team.lookingFor || team.lookingFor.length === 0) return [];
    
    const recommendations = (userPool || []).map(user => {
      let score = 0;
      
      // 우리 팀이 찾는 포지션과 유저의 역할이 일치하는가? (부분 일치 허용)
      const roleMatch = team.lookingFor.some(
        req => {
          const targetPos = req.position.toLowerCase();
          const userRole = (user.role || '').toLowerCase();
          return userRole.includes(targetPos) || targetPos.includes(userRole);
        }
      );
      if (roleMatch) score += 50;

      // 스킬 매치 (대략적인 확인)
      if (user.skills && user.skills.length > 0) {
        // 더미 매칭: 찾는 설명에 유저 스킬 키워드가 있으면 가산점
        team.lookingFor.forEach(req => {
          user.skills!.forEach(skill => {
            if (req.description.toLowerCase().includes(skill.toLowerCase())) {
              score += 20;
            }
          });
        });
      }
      
      // 아무 조건도 없지만 일단 역할이 맞으면 추가 점수 부여 (랜덤성)
      if (score === 50) {
        score += Math.floor(Math.random() * 30) + 10; // 60~89 사이
      }

      return { user, score: Math.min(score, 99) }; // 최대 99%
    });

    // 점수가 50점 이상인 유저만 추천, 점수 내림차순 정렬
    return recommendations
      .filter(r => r.score >= 50 && !invitedUsers.includes(r.user.id))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // 최대 5명 추천
  }, [team.lookingFor, invitedUsers]);

  const handleInviteEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    if (invitedEmails.includes(email)) {
      toast({ title: '이미 초대한 이메일입니다.', variant: 'destructive' });
      return;
    }
    
    setInvitedEmails(prev => [...prev, email]);
    toast({ title: `'${email}'로 초대 메일을 발송했습니다.` });
    setEmail('');
  };

  const { addNotification, sentInvitations, addSentInvitation } = useNotificationStore();
  const { hackathons } = useHackathonStore();

  const handleInviteUser = (userId: string, nickname: string) => {
    setInvitedUsers(prev => [...prev, userId]);
    
    // 1. 수신 측 알림 추가 (시뮬레이션)
    const hackathon = hackathons.find(h => h.slug === team.hackathonSlug);
    addNotification({
      type: 'invitation',
      fromTeamName: team.name,
      hackathonTitle: hackathon?.title || '참가 해커톤',
      teamCode: team.teamCode,
    });

    // 2. 발신 측 기록 추가
    addSentInvitation({
      teamCode: team.teamCode,
      toUserNickname: nickname,
    });

    toast({ title: `${nickname}님에게 합류 제안 알림을 보냈습니다.` });
  };

  if (!isLeader) return null; // 팀장만 볼 수 있음

  const myTeamSentInvitations = sentInvitations.filter(si => si.teamCode === team.teamCode);

  return (
    <div className="p-6 space-y-8">
      <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
        <span className="p-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 flex items-center justify-center rounded-lg shrink-0">
          <Mail className="w-5 h-5" />
        </span>
        팀원 초대 및 리쿠르팅
      </h3>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 이메일 수동 초대 */}
          <div className="bg-muted/30 border rounded-xl p-5 shadow-sm">
            <h4 className="font-semibold mb-2 flex items-center gap-1.5">
              이메일로 바로 초대
            </h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              함께할 팀원의 이메일 주소를 입력해 주세요.
            </p>
            <form onSubmit={handleInviteEmail} className="flex gap-2">
              <Input 
                type="email" 
                placeholder="teammate@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background focus:ring-purple-500"
              />
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">초대 발송</Button>
            </form>

            {invitedEmails.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <h5 className="text-xs font-semibold text-muted-foreground mb-2">초대 대기중</h5>
                <ul className="space-y-2">
                  {invitedEmails.map(mail => (
                    <li key={mail} className="text-sm flex items-center justify-between bg-background border px-3 py-2 rounded-md">
                      <span>{mail}</span>
                      <Badge variant="secondary" className="text-[10px] font-normal">발송 완료</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* AI 코파운더 추천 (Vibe Match) */}
          <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/10 dark:to-indigo-950/10 border border-purple-100/50 dark:border-purple-800/20 rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles className="w-24 h-24 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2 flex items-center gap-1.5 text-purple-900 dark:text-purple-300 relative z-10">
              <Sparkles className="w-4 h-4" />
              Vibe Match: AI 팀원 추천
            </h4>
            <p className="text-sm text-purple-700/70 dark:text-purple-400/70 mb-4 relative z-10 leading-relaxed">
              우리가 찾는 포지션과 핏이 딱 맞는 유저들을 데려왔어요.
            </p>
            
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x wrapper-scroll relative z-10">
              <AnimatePresence>
                {recommendedUsers.length > 0 ? (
                  recommendedUsers.map((rec, index) => (
                    <motion.div 
                      key={rec.user.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9, width: 0, marginRight: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="shrink-0 w-[240px] bg-background border rounded-xl overflow-hidden snap-center flex flex-col hover:border-purple-300 dark:hover:border-purple-700/50 transition-colors shadow-sm"
                    >
                      <div className="p-4 flex-grow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-base truncate">{rec.user.nickname}</h5>
                            <span className="text-xs text-muted-foreground">{rec.user.role}</span>
                          </div>
                          <div className="bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
                            {rec.score}% 핏
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {rec.user.skills?.slice(0, 3).map(skill => (
                            <span key={skill} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-1.5 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleInviteUser(rec.user.id, rec.user.nickname)}
                        className="w-full rounded-none border-t text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/30 font-bold"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        초대하기
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <div className="w-full text-center py-6 text-sm text-purple-600/60 dark:text-purple-400/60 flex flex-col items-center">
                    <CheckCircle2 className="w-8 h-8 opacity-50 mb-2" />
                    <p>현재 조건에 맞는 추천 유저를 모두 초대했거나 없습니다.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 보낸 합류 제안 현황 */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              현재 진행 중인 합류 제안
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full font-medium">
                {myTeamSentInvitations.length}
              </span>
            </h4>
            <div className="text-[11px] text-muted-foreground font-medium flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> 대기중</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 수락함</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> 거절함</span>
            </div>
          </div>

          {myTeamSentInvitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {myTeamSentInvitations.map((invitation) => (
                <div key={invitation.id} className="bg-background border dark:border-slate-800 rounded-xl p-3 flex items-center justify-between group transition-all hover:border-slate-300 dark:hover:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-500 uppercase">
                      {invitation.toUserNickname.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {invitation.toUserNickname}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {new Date(invitation.sentAt).toLocaleDateString()} 발송
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {invitation.status === 'pending' && (
                      <Badge variant="outline" className="text-[10px] font-bold border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-950/30">대기중</Badge>
                    )}
                    {invitation.status === 'accepted' && (
                      <Badge variant="outline" className="text-[10px] font-bold border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30">수락함</Badge>
                    )}
                    {invitation.status === 'declined' && (
                      <Badge variant="outline" className="text-[10px] font-bold border-rose-200 text-rose-600 bg-rose-50 dark:bg-rose-950/30">거절함</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 bg-slate-100/30 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-sm font-medium">아직 보낸 합류 제안이 없습니다.</p>
              <p className="text-xs mt-1">AI 추천 유저나 이메일을 통해 팀원들을 초대해보세요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Badge 임시 추가 (lucide-react처럼 import 안 된 UI 컴포넌트 대응)
function Badge({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'secondary' | 'outline' }) {
  const baseClass = "inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "text-foreground",
  };
  return <div className={`${baseClass} ${variants[variant]} ${className}`}>{children}</div>;
}
