import type { Team, Hackathon } from '@/types';
import { Calendar, Users, Lock, Globe, EyeOff, Settings, AlertTriangle, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import TeamMemberManager from '../TeamMemberManager';
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
} from "@/components/ui/alert-dialog";

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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      {/* 1. 기본 팀 정보 섹션 (전원 공개) */}
      <div className="space-y-6">
        {/* About Team */}
        <div className="bg-muted/10 border border-dashed rounded-xl p-5">
           <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
             <Users className="w-3.5 h-3.5 text-primary/60" /> 팀소개
           </div>
           <p className="text-sm leading-relaxed text-foreground/80 italic font-medium">
             "{team.intro}"
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hackathon Info */}
          <div className="bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
                <span className="p-1.5 bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300 rounded-lg text-xs">🏆</span>
                참가 해커톤
              </h3>
              <p className="font-bold text-xl leading-tight tracking-tight">{hackathon.title}</p>
            </div>
            <div className="flex items-center text-[11px] text-muted-foreground mt-5 pt-4 border-t border-blue-100/50 dark:border-blue-800/50 font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              {formatDate(hackathon.period.submissionDeadlineAt)} 제출 마감
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-6">
              <span className="p-1.5 bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg text-xs">📅</span>
              진행 일정
            </h3>
            <div className="relative pt-4 pb-2 px-2">
              <div className="absolute top-[1.65rem] left-2 right-2 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[60%] rounded-full" />
              </div>
              <div className="relative flex justify-between">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-background z-10 shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-background z-10 shadow-sm" />
                <div className="w-3.5 h-3.5 rounded-full bg-muted ring-4 ring-background z-10" />
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <span>접수</span>
                <span className="text-blue-600">제출</span>
                <span>결과</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 필요 역할 및 인원 (전원 공개) */}
      <section className="space-y-4">
        <h3 className="font-bold text-base flex items-center gap-2">
          <span className="p-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 flex items-center justify-center rounded-lg shadow-sm">
            👥
          </span>
          팀 빌딩 현황
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.lookingFor?.map((role, idx) => (
            <div key={idx} className="group border p-5 rounded-2xl bg-card flex flex-col items-center text-center gap-3 hover:border-primary/30 hover:bg-muted/30 transition-all duration-300 shadow-sm">
               <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                 <Users className="w-6 h-6 text-muted-foreground" />
               </div>
               <span className="font-bold text-sm block">{role.position}</span>
               {role.description && <span className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{role.description}</span>}
            </div>
          ))}
          {(!team.lookingFor || team.lookingFor.length === 0) && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 border-dashed border-2 rounded-2xl">
              <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="font-medium text-sm">별도 모집 중인 역할이 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. 팀 관리 센터 (팀장 전용) */}
      {isLeader && (
        <section className="pt-10 border-t-2 border-dashed border-primary/20 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="font-black text-2xl flex items-center gap-3 text-foreground tracking-tighter">
                <Settings className="w-7 h-7 text-primary animate-spin-slow" />
                팀 관리 센터
              </h3>
              <p className="text-sm text-muted-foreground mt-1 font-medium">팀장님 전용 대시보드입니다. 팀의 성장과 운영을 관리하세요.</p>
            </div>
            <Badge variant="secondary" className="w-fit h-7 bg-primary/10 text-primary border-primary/20 px-3 font-bold">
              ADMIN MODE
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 모집 상태 및 설정 카드 */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    <Globe className="w-4 h-4" /> 리쿠르팅 상태 변경
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    <Button 
                      variant={team.isOpen && !team.isPrivate ? 'default' : 'outline'} 
                      size="sm" 
                      className={cn("justify-start h-11 text-xs font-bold px-4 rounded-xl transition-all", team.isOpen && !team.isPrivate && "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20")}
                      onClick={() => updateTeam(team.teamCode, { isOpen: true, isPrivate: false })}
                    >
                      <Globe className="w-4 h-4 mr-3" /> 공개 모집 시작하기
                    </Button>
                    <Button 
                      variant={team.isOpen && team.isPrivate ? 'default' : 'outline'} 
                      size="sm" 
                      className={cn("justify-start h-11 text-xs font-bold px-4 rounded-xl transition-all", team.isOpen && team.isPrivate && "bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-500/20")}
                      onClick={() => updateTeam(team.teamCode, { isOpen: true, isPrivate: true })}
                    >
                      <Lock className="w-4 h-4 mr-3" /> 초대 전용으로 전환
                    </Button>
                    <Button 
                      variant={!team.isOpen ? 'default' : 'outline'} 
                      size="sm" 
                      className={cn("justify-start h-11 text-xs font-bold px-4 rounded-xl transition-all")}
                      onClick={() => updateTeam(team.teamCode, { isOpen: false })}
                    >
                      <EyeOff className="w-4 h-4 mr-3" /> 모집 완료 및 마감
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-[11px] font-black text-rose-500 uppercase tracking-widest mb-4">
                    <AlertTriangle className="w-4 h-4" /> Danger Zone
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start h-11 text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 px-4 border-rose-200 rounded-xl">
                        <Trash2 className="w-4 h-4 mr-3" /> 이 팀 영구 삭제하기
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">정말 팀을 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base leading-relaxed">
                          삭제 시 팀 정보, 채팅 기록, 해커톤 진행 상황이 **영구적으로 소멸**됩니다. 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="rounded-xl font-bold">취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTeam} className="bg-rose-600 hover:bg-rose-700 rounded-xl font-bold">
                          확인, 삭제합니다
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>

            {/* 팀원 초대 및 관리 섹션 */}
            <div className="lg:col-span-8">
              <div className="bg-background rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full">
                <TeamMemberManager team={team} />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
