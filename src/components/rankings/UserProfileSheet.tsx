'use client';

import React, { useMemo } from 'react';
import {
  Trophy,
  Star,
  Users,
  Calendar,
  Zap,
  CheckCircle2,
  UserPlus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import type { Team } from '@/types';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useToast } from '@/hooks/use-toast';
import type { RankingUser } from '@/types';
import { cn } from '@/lib/utils';
import { isTeamRecruiting } from '@/lib/team-recruiting';

interface UserProfileSheetProps {
  user: RankingUser | null;
  onClose: () => void;
}

const AVATAR_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-600',
];

function getAvatarColor(nickname: string) {
  const index = nickname.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function getRankBadge(rank: number) {
  if (rank === 1) return { emoji: '🥇', label: '1위', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' };
  if (rank === 2) return { emoji: '🥈', label: '2위', className: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300' };
  if (rank === 3) return { emoji: '🥉', label: '3위', className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300' };
  if (rank <= 10) return { emoji: '⭐', label: `${rank}위`, className: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300' };
  return { emoji: '', label: `${rank}위`, className: 'bg-muted text-muted-foreground border-border' };
}

export default function UserProfileSheet({ user, onClose }: UserProfileSheetProps) {
  const { currentUser } = useUserStore();
  const { teams } = useTeamStore();
  const { hackathons } = useHackathonStore();
  const { addNotification, addSentInvitation, sentInvitations } = useNotificationStore();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(!!user);
  }, [user]);
  const { toast } = useToast();

  const [selectedTeamCode, setSelectedTeamCode] = React.useState<string>('');
  const hackathonMap = useMemo(
    () => new Map(hackathons.map((hackathon) => [hackathon.slug, hackathon])),
    [hackathons]
  );

  // 내가 리더인 모집 중 팀 목록
  const myLeadingTeams = useMemo(() => {
    if (!currentUser) return [];
    return teams.filter(
      (t) =>
        t.leaderId === currentUser.id &&
        !t.isSolo &&
        t.memberCount < t.maxTeamSize &&
        isTeamRecruiting(t, t.hackathonSlug ? hackathonMap.get(t.hackathonSlug) : null)
    );
  }, [currentUser, hackathonMap, teams]);

  // 선택된 팀에 이미 초대를 보냈는지 확인
  const alreadyInvited = useMemo(() => {
    if (!user || !selectedTeamCode) return false;
    return sentInvitations.some(
      (si) => si.teamCode === selectedTeamCode && si.toUserNickname === user.nickname
    );
  }, [sentInvitations, selectedTeamCode, user]);

  // 팀이 1개일 때 자동 선택
  React.useEffect(() => {
    if (myLeadingTeams.length === 1) {
      setSelectedTeamCode(myLeadingTeams[0].teamCode);
    } else {
      setSelectedTeamCode('');
    }
  }, [myLeadingTeams, user]);

  const isCurrentUser = currentUser?.nickname === user?.nickname;
  const canInvite = !isCurrentUser && myLeadingTeams.length > 0;

  const handleOpenChange = (o: boolean) => {
    if (!o) onClose();
  };

  const handleInvite = () => {
    if (!user || !selectedTeamCode || !currentUser) return;
    const team = teams.find((t) => t.teamCode === selectedTeamCode);
    if (!team) return;

    const hackathon = hackathons.find((h) => h.slug === team.hackathonSlug);
    if (!isTeamRecruiting(team, hackathon)) {
      toast({
        title: '모집 마감 팀은 초대할 수 없습니다.',
        description: '현재 모집 중인 팀만 글로벌 랭킹에서 초대를 보낼 수 있습니다.',
        variant: 'destructive',
      });
      return;
    }

    addNotification({
      toUserNickname: user.nickname,
      type: 'invitation',
      fromTeamName: team.name,
      hackathonTitle: hackathon?.title || '참가 해커톤',
      teamCode: selectedTeamCode,
    });

    addSentInvitation({
      teamCode: selectedTeamCode,
      toUserNickname: user.nickname,
    });

    toast({
      title: `${user.nickname}님에게 초대를 보냈습니다! 🎉`,
      description: `${team?.name} 팀 합류 제안이 전송됐습니다.`,
    });
  };

  if (!user) return null;

  const rankBadge = getRankBadge(user.rank);
  const avatarColor = getAvatarColor(user.nickname);
  const joinedAgo = user.lastActiveAt
    ? formatDistanceToNow(new Date(user.lastActiveAt), { addSuffix: true, locale: ko })
    : '알 수 없음';

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-y-auto overflow-x-hidden">
        {/* 헤더 그라데이션 배너 */}
        <div className={cn('relative h-28 bg-gradient-to-br', avatarColor)}>
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {/* 랭킹 뱃지 */}
          <div className="absolute top-4 right-4">
            <span className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold',
              rankBadge.className
            )}>
              {rankBadge.emoji} {rankBadge.label}
            </span>
          </div>
        </div>

        {/* 아바타 (헤더에 걸쳐 있음) */}
        <div className="px-6 -mt-10 pb-0">
          <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
            <AvatarFallback className={cn('text-2xl font-black text-white bg-gradient-to-br', avatarColor)}>
              {user.nickname.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <SheetHeader className="px-6 pt-2 pb-0 text-left">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl font-black text-foreground">
                {user.nickname}
                {isCurrentUser && (
                  <Badge variant="secondary" className="ml-2 text-xs align-middle">나</Badge>
                )}
              </SheetTitle>
              {user.primaryRoles && user.primaryRoles.length > 0 && (
                <p className="text-sm text-muted-foreground mt-0.5">{user.primaryRoles.join(', ')}</p>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 py-4 space-y-5">
          {(user.primaryRoles?.length || user.interestDomains?.length || user.techStacks?.length) && (
            <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
              {user.primaryRoles && user.primaryRoles.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">주 역할</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.primaryRoles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs font-medium">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {user.interestDomains && user.interestDomains.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">관심 분야</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.interestDomains.map((domain) => (
                      <Badge key={domain} variant="outline" className="text-xs font-medium">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {user.techStacks && user.techStacks.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">기술 스택</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.techStacks.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary dark:bg-primary/15"
                      >
                        <Zap className="w-3 h-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 통계 카드 3종 */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<Star className="w-4 h-4 text-amber-500" />}
              value={user.points.toLocaleString()}
              label="포인트"
              highlight
            />
            <StatCard
              icon={<Users className="w-4 h-4 text-indigo-500" />}
              value={`${user.hackathonsJoined}회`}
              label="참가"
            />
            <StatCard
              icon={<Trophy className="w-4 h-4 text-amber-500" />}
              value={user.winsCount > 0 ? `${user.winsCount}회` : '—'}
              label="우승"
            />
          </div>

          {/* 가입일 */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>MAXER 가입 {joinedAgo}</span>
          </div>

          {/* 구분선 */}
          <div className="border-t" />

          {/* 팀 초대 섹션 */}
          {canInvite ? (
            <InviteSection
              myLeadingTeams={myLeadingTeams}
              selectedTeamCode={selectedTeamCode}
              onSelectTeam={setSelectedTeamCode}
              alreadyInvited={alreadyInvited}
              onInvite={handleInvite}
              targetNickname={user.nickname}
            />
          ) : isCurrentUser ? (
            <p className="text-xs text-center text-muted-foreground py-2">내 프로필입니다.</p>
          ) : (
            <p className="text-xs text-center text-muted-foreground py-2">
              초대하려면 먼저 팀을 만들고 팀장이 되세요.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── 통계 카드 ────────────────────────────────────────────────
function StatCard({
  icon,
  value,
  label,
  highlight = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center rounded-xl p-3 border gap-1',
      highlight
        ? 'bg-primary/5 border-primary/20'
        : 'bg-muted/40 border-border/60'
    )}>
      {icon}
      <span className={cn('text-sm font-black', highlight && 'text-primary')}>{value}</span>
      <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

// ── 초대 섹션 ────────────────────────────────────────────────
function InviteSection({
  myLeadingTeams,
  selectedTeamCode,
  onSelectTeam,
  alreadyInvited,
  onInvite,
  targetNickname,
}: {
  myLeadingTeams: Team[];
  selectedTeamCode: string;
  onSelectTeam: (code: string) => void;
  alreadyInvited: boolean;
  onInvite: () => void;
  targetNickname: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">팀 초대</p>

      {myLeadingTeams.length > 1 && (
        <Select value={selectedTeamCode} onValueChange={onSelectTeam}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="초대할 팀 선택..." />
          </SelectTrigger>
          <SelectContent>
            {myLeadingTeams.map((team) => (
              <SelectItem key={team.teamCode} value={team.teamCode}>
                <span className="font-medium">{team.name}</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  ({team.memberCount}/{team.maxTeamSize}명)
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {myLeadingTeams.length === 1 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border text-sm">
          <Users className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="font-medium">{myLeadingTeams[0].name}</span>
          <span className="text-muted-foreground text-xs ml-auto">
            {myLeadingTeams[0].memberCount}/{myLeadingTeams[0].maxTeamSize}명
          </span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {alreadyInvited ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-bold"
          >
            <CheckCircle2 className="w-4 h-4" />
            초대 완료 ✓
          </motion.div>
        ) : (
          <motion.div key="invite" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Button
              className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold shadow-md shadow-indigo-200 dark:shadow-indigo-900/40"
              disabled={!selectedTeamCode}
              onClick={onInvite}
            >
              <UserPlus className="w-4 h-4" />
              {targetNickname}님에게 초대 보내기
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
