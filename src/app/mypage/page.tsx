'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar as CalendarIcon,
  Users,
  Trophy,
  Bookmark,
  FileText,
  ChevronRight,
  Edit3,
  LogOut,
  Shield,
  Target,
} from 'lucide-react';

import HackathonTradingCard from '@/components/mypage/HackathonTradingCard';

import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import EmptyState from '@/components/shared/EmptyState';

export default function MyPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { teams } = useTeamStore();
  const { hackathons, hackathonDetails, leaderboards } = useHackathonStore();
  const { submissions } = useSubmissionStore();


  if (!currentUser) {
    return (
      <div className="container mx-auto py-16 text-center">
        <EmptyState
          icon={User}
          title="로그인 정보가 없습니다"
          description="서비스를 이용하려면 유저 정보가 필요합니다."
        />
      </div>
    );
  }

  // ── 내 팀 목록 ──
  const myTeams = teams.filter((t) =>
    currentUser.teamCodes.includes(t.teamCode),
  );

  // ── 내가 참여 중인 해커톤 (팀의 hackathonSlug 기반) ──
  const myHackathonSlugs = [
    ...new Set(
      myTeams
        .map((t) => t.hackathonSlug)
        .filter(Boolean) as string[],
    ),
  ];
  const myHackathons = hackathons.filter(
    (h) => myHackathonSlugs.includes(h.slug) && h.status !== 'ended',
  );
  const myEndedHackathons = hackathons.filter(
    (h) => myHackathonSlugs.includes(h.slug) && h.status === 'ended',
  );

  // ── 북마크한 해커톤 ──
  const bookmarkedHackathons = hackathons.filter((h) =>
    currentUser.bookmarkedSlugs?.includes(h.slug),
  );

  // ── 내 제출 현황 ──
  const mySubmissions = submissions.filter((s) =>
    currentUser.teamCodes.includes(s.teamCode),
  );

  // ── D-day 계산 ──
  const getDday = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil(
      (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return 'D-Day';
    return `D+${Math.abs(diff)}`;
  };



  // ── 상태 배지 색상 ──
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            진행중
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            예정
          </Badge>
        );
      case 'ended':
        return (
          <Badge className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            종료
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSubmissionBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <Badge className="bg-emerald-100 text-emerald-700">제출 완료</Badge>
        );
      case 'draft':
        return (
          <Badge className="bg-amber-100 text-amber-700">임시 저장</Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-500">미제출</Badge>
        );
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* ── 프로필 카드 ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden">
          {/* 그라데이션 배경 */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {/* 아바타: 그라데이션과 겹치게 배치 */}
          <div className="px-6">
            <div className="w-20 h-20 -mt-10 rounded-full bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-indigo-600">
                {currentUser.nickname.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* 프로필 정보 */}
          <CardContent className="px-6 pt-3 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{currentUser.nickname}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {currentUser.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    가입일 {formatDate(currentUser.joinedAt)}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/mypage/profile')}
                className="flex-shrink-0"
              >
                <Edit3 className="w-4 h-4 mr-1.5" />
                프로필 수정
              </Button>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30">
                <p className="text-2xl font-bold text-indigo-600">
                  {myHackathons.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">참여 해커톤</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30">
                <p className="text-2xl font-bold text-purple-600">
                  {myTeams.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">소속 팀</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                <p className="text-2xl font-bold text-emerald-600">
                  {mySubmissions.filter((s) => s.status === 'submitted').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">제출 완료</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-pink-50 dark:bg-pink-950/30">
                <p className="text-2xl font-bold text-pink-600">
                  {bookmarkedHackathons.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">북마크</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>




      {/* ── 참여 중인 해커톤 ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5 text-indigo-500" />
              참여 중인 해커톤
            </CardTitle>
            <CardDescription>내가 팀으로 참가한 해커톤 목록</CardDescription>
          </CardHeader>
          <CardContent>
            {myHackathons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                아직 참여 중인 해커톤이 없습니다.
                <br />
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => router.push('/hackathons')}
                >
                  해커톤 둘러보기
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-2">
                {myHackathons.map((h) => {
                  const submission = mySubmissions.find(
                    (s) => s.hackathonSlug === h.slug,
                  );
                  const team = myTeams.find(
                    (t) => t.hackathonSlug === h.slug,
                  );

                  return (
                    <HackathonTradingCard
                      key={h.slug}
                      hackathon={h}
                      team={team}
                      submission={submission}
                    />
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 지난 해커톤 (종료) ── */}
      {myEndedHackathons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-slate-400" />
                지난 해커톤
              </CardTitle>
              <CardDescription>종료된 해커톤 참여 이력</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-2 opacity-75">
                {myEndedHackathons.map((h) => {
                  const submission = mySubmissions.find(
                    (s) => s.hackathonSlug === h.slug,
                  );
                  const team = myTeams.find(
                    (t) => t.hackathonSlug === h.slug,
                  );

                  return (
                    <HackathonTradingCard
                      key={h.slug}
                      hackathon={h}
                      team={team}
                      submission={submission}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── 내 팀 목록 ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-purple-500" />
              내 팀
            </CardTitle>
            <CardDescription>내가 속한 팀 목록</CardDescription>
          </CardHeader>
          <CardContent>
            {myTeams.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                아직 소속된 팀이 없습니다.
                <br />
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => router.push('/camp')}
                >
                  팀 찾기
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myTeams.map((team) => {
                  const linkedHackathon = hackathons.find(
                    (h) => h.slug === team.hackathonSlug,
                  );
                  return (
                    <div
                      key={team.teamCode}
                      className="p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">{team.name}</h3>
                        <Badge variant={team.isOpen ? 'default' : 'secondary'}>
                          {team.isOpen ? '모집중' : '모집마감'}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {team.memberCount}/{team.maxTeamSize}명
                        </p>
                        {linkedHackathon && (
                          <p
                            className="flex items-center gap-1 text-indigo-600 cursor-pointer hover:underline"
                            onClick={() =>
                              router.push(
                                `/hackathons/${linkedHackathon.slug}`,
                              )
                            }
                          >
                            <Trophy className="w-3 h-3" />
                            {linkedHackathon.title}
                          </p>
                        )}
                        {!linkedHackathon && team.hackathonSlug === null && (
                          <p className="text-slate-400">자유 모집 팀</p>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm"
                          onClick={() => router.push(`/basecamp/${team.teamCode}`)}
                        >
                          <Target className="w-4 h-4 mr-2" /> 작전실 입장
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 제출 현황 ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-emerald-500" />
              제출 현황
            </CardTitle>
            <CardDescription>해커톤별 제출 상태</CardDescription>
          </CardHeader>
          <CardContent>
            {mySubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                아직 제출한 항목이 없습니다.
              </div>
            ) : (
              <div className="space-y-3">
                {mySubmissions.map((sub) => {
                  const hackathon = hackathons.find(
                    (h) => h.slug === sub.hackathonSlug,
                  );
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      onClick={() =>
                        router.push(`/hackathons/${sub.hackathonSlug}`)
                      }
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {hackathon?.title || sub.hackathonSlug}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>팀: {sub.teamName}</span>
                          <span>
                            아티팩트 {sub.artifacts.length}개
                          </span>
                          {sub.submittedAt && (
                            <span>
                              제출일 {formatDate(sub.submittedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        {getSubmissionBadge(sub.status)}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 북마크 해커톤 ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bookmark className="w-5 h-5 text-pink-500" />
              북마크
            </CardTitle>
            <CardDescription>관심 있는 해커톤</CardDescription>
          </CardHeader>
          <CardContent>
            {bookmarkedHackathons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                북마크한 해커톤이 없습니다.
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarkedHackathons.map((h) => (
                  <div
                    key={h.slug}
                    className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    onClick={() => router.push(`/hackathons/${h.slug}`)}
                  >
                    <div className="flex items-center gap-2">
                      {getStatusBadge(h.status)}
                      <h3 className="font-semibold text-sm">{h.title}</h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>


    </div>
  );
}
