'use client';

import type { Team, Hackathon } from '@/types';
import { Calendar, Users, Lock, Globe, EyeOff, Settings, AlertTriangle, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { getTeamAvailabilitySummary, getTeamProjectStatusDetail } from '@/lib/team-context';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import TeamMemberManager from '../TeamMemberManager';
import TeamCompositionSection from '../TeamCompositionSection';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function BasecampInfoTab({
  team,
  hackathon,
}: {
  team: Team;
  hackathon: Hackathon;
}) {
  const router = useRouter();
  const { currentUser, removeTeamCode } = useUserStore();
  const { updateTeam, deleteTeam } = useTeamStore();
  const isLeader = currentUser?.id === team.leaderId;

  const handleDeleteTeam = () => {
    deleteTeam(team.teamCode);
    removeTeamCode(team.teamCode);
    router.push('/');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-12 pb-10 duration-500">
      <div className="space-y-6">
        <div className="rounded-xl border border-dashed bg-muted/10 p-5">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary/60" /> 팀 소개
          </div>
          <p className="text-sm font-medium italic leading-relaxed text-foreground/80">"{team.intro}"</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">작업 가능 시간</div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
              {getTeamAvailabilitySummary(team)}
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">상세 진행 상태 / 비전</div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
              {getTeamProjectStatusDetail(team)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-blue-50/30 p-6 shadow-sm dark:border-blue-900/30 dark:bg-blue-900/10">
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
                <span className="rounded-lg bg-blue-100 p-1.5 text-xs text-blue-700 dark:bg-blue-800 dark:text-blue-300">해커톤</span>
                참가 대회
              </h3>
              <p className="text-xl font-bold leading-tight tracking-tight">{hackathon.title}</p>
            </div>
            <div className="mt-5 flex items-center border-t border-blue-100/50 pt-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:border-blue-800/50">
              <Calendar className="mr-2 h-4 w-4 text-blue-500" />
              {formatDate(hackathon.period.submissionDeadlineAt)} 제출 마감
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/20">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold">
              <span className="rounded-lg bg-slate-200 p-1.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">타임라인</span>
              진행 일정
            </h3>
            <div className="relative px-2 pb-2 pt-4">
              <div className="absolute left-2 right-2 top-[1.65rem] h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[60%] rounded-full bg-blue-500" />
              </div>
              <div className="relative flex justify-between">
                <div className="z-10 h-3.5 w-3.5 rounded-full bg-blue-600 ring-4 ring-background shadow-sm" />
                <div className="z-10 h-3.5 w-3.5 rounded-full bg-blue-600 ring-4 ring-background shadow-sm" />
                <div className="z-10 h-3.5 w-3.5 rounded-full bg-muted ring-4 ring-background" />
              </div>
              <div className="mt-4 flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>접수</span>
                <span className="text-blue-600">제출</span>
                <span>결과</span>
              </div>
            </div>
          </div>
        </div>

        <TeamCompositionSection team={team} />
      </div>

      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-base font-bold">
          <span className="flex items-center justify-center rounded-lg bg-indigo-100 p-1.5 text-indigo-700 shadow-sm dark:bg-indigo-900/30 dark:text-indigo-300">
            모집
          </span>
          팀 빌딩 현황
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.lookingFor?.map((role, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-muted/30"
            >
              <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-secondary transition-transform group-hover:scale-110">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="block text-sm font-bold">{role.position}</span>
              {role.description && <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{role.description}</span>}
            </div>
          ))}
          {(!team.lookingFor || team.lookingFor.length === 0) && (
            <div className="col-span-full rounded-2xl border-2 border-dashed bg-muted/20 py-12 text-center text-muted-foreground">
              <Users className="mx-auto mb-3 h-8 w-8 opacity-20" />
              <p className="text-sm font-medium">별도 모집 중인 역할이 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {isLeader && (
        <section className="space-y-8 border-t-2 border-dashed border-primary/20 pt-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-black tracking-tighter text-foreground">
                <Settings className="h-7 w-7 text-primary animate-spin-slow" />
                팀 관리 센터
              </h3>
              <p className="mt-1 text-sm font-medium text-muted-foreground">리더 전용 대시보드입니다. 팀의 공개 상태와 팀원을 관리합니다.</p>
            </div>
            <Badge variant="secondary" className="h-7 w-fit border-primary/20 bg-primary/10 px-3 font-bold text-primary">
              ADMIN MODE
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-4">
              <div className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
                    <Globe className="h-4 w-4" /> 모집 상태 변경
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    <Button
                      variant={team.isOpen && !team.isPrivate ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        'h-11 justify-start rounded-xl px-4 text-xs font-bold transition-all',
                        team.isOpen && !team.isPrivate && 'bg-emerald-600 shadow-lg shadow-emerald-500/20 hover:bg-emerald-700'
                      )}
                      onClick={() => updateTeam(team.teamCode, { isOpen: true, isPrivate: false })}
                    >
                      <Globe className="mr-3 h-4 w-4" /> 공개 모집 시작하기
                    </Button>
                    <Button
                      variant={team.isOpen && team.isPrivate ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        'h-11 justify-start rounded-xl px-4 text-xs font-bold transition-all',
                        team.isOpen && team.isPrivate && 'bg-amber-600 shadow-lg shadow-amber-500/20 hover:bg-amber-700'
                      )}
                      onClick={() => updateTeam(team.teamCode, { isOpen: true, isPrivate: true })}
                    >
                      <Lock className="mr-3 h-4 w-4" /> 초대 전용으로 전환
                    </Button>
                    <Button
                      variant={!team.isOpen ? 'default' : 'outline'}
                      size="sm"
                      className="h-11 justify-start rounded-xl px-4 text-xs font-bold transition-all"
                      onClick={() => updateTeam(team.teamCode, { isOpen: false })}
                    >
                      <EyeOff className="mr-3 h-4 w-4" /> 모집 완료 및 마감
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                  <div className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-rose-500">
                    <AlertTriangle className="h-4 w-4" /> Danger Zone
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-11 w-full justify-start rounded-xl border-rose-200 px-4 text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="mr-3 h-4 w-4" /> 이 팀 영구 삭제하기
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">정말 팀을 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base leading-relaxed">
                          팀 정보, 채팅 기록, 진행 현황이 모두 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="rounded-xl font-bold">취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTeam} className="rounded-xl bg-rose-600 font-bold hover:bg-rose-700">
                          확인, 삭제합니다
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-background shadow-sm dark:border-slate-800">
                <TeamMemberManager team={team} />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
