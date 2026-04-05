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
  Globe,
  ExternalLink,
  Coins,
  History,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import HackathonTradingCard from '@/components/mypage/HackathonTradingCard';

import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useRankingStore } from '@/store/useRankingStore';
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
  const { rankings } = useRankingStore();

  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [showPastTeams, setShowPastTeams] = useState(false);

  if (!currentUser) {
    return (
      <div className="container mx-auto py-16 text-center">
        <EmptyState
          icon={User}
          title="로그인 정보가 없습니다"
          description="로그인 후 사용하세요. 마이페이지 정보가 필요합니다"
        />
      </div>
    );
  }

  // 내 팀 목록 조회
  const myTeams = teams.filter((t) =>
    currentUser.teamCodes.includes(t.teamCode),
  );

  // 내 팀이 참여 중인 해커톤 목록(팀의 hackathonSlug 기준) 조회
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

  // 북마크한 해커톤 조회
  const bookmarkedHackathons = hackathons.filter((h) =>
    currentUser.bookmarkedSlugs?.includes(h.slug),
  );

  // 내 제출물 조회
  const mySubmissions = submissions.filter((s) =>
    currentUser.teamCodes.includes(s.teamCode),
  );

  // 총 포인트 계산 및 합성 포인트 내역 생성
  const myRanking = rankings.find(r => r.nickname === currentUser.nickname);
  const totalPoints = myRanking?.points || 0;
  
  const syntheticHistory = [...(currentUser.pointHistory || [])];
  
  if (myRanking && myRanking.basePoints > 0) {
    syntheticHistory.push({
      id: 'base-points',
      description: '회원가입 기본 혜택',
      points: myRanking.basePoints,
      date: currentUser.joinedAt || new Date().toISOString()
    });
  }

  myTeams.forEach(team => {
    const hackathon = hackathons.find(h => h.slug === team.hackathonSlug);
    if (hackathon) {
      // 본선 진출(참여) 포인트
      syntheticHistory.push({
        id: `part-${team.teamCode}`,
        description: `'${hackathon.title}' 본선 결선 진출 (참여 수당)`,
        points: 50,
        date: team.createdAt
      });

      // 산출물 제출 (단계별 100점)
      const sub = mySubmissions.find(s => s.teamCode === team.teamCode);
      if (sub && sub.artifacts) {
        sub.artifacts.forEach((art, idx) => {
          syntheticHistory.push({
            id: `sub-${art.key || idx}-${team.teamCode}`,
            description: `'${hackathon.title}' 과제 제출 장려금`,
            points: 100,
            date: art.uploadedAt
          });
        });
      }

      // 우승 포인트
      const lb = leaderboards[hackathon.slug];
      if (lb) {
        const entry = lb.entries.find(e => e.teamName === team.name);
        if (entry && entry.rank) {
          if (entry.rank === 1) syntheticHistory.push({ id: `win-1-${team.teamCode}`, description: `'${hackathon.title}' 최종 1위 우승`, points: 500, date: lb.updatedAt });
          else if (entry.rank === 2) syntheticHistory.push({ id: `win-2-${team.teamCode}`, description: `'${hackathon.title}' 대회 준우승 (2위)`, points: 400, date: lb.updatedAt });
          else if (entry.rank === 3) syntheticHistory.push({ id: `win-3-${team.teamCode}`, description: `'${hackathon.title}' 입상 (3위)`, points: 300, date: lb.updatedAt });
        }
      }
    }
  });

  const sortedHistory = syntheticHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // D-day 계산 함수
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

  // 상태 뱃지 렌더링 함수
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            진행 중
          </Badge>
        );
      case 'recruiting':
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
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
      {/* 프로필 카드 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden">
          {/* 배너 이미지 배경 */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {/* 아바타: 배너이미지에서 유저 이름 첫글자 */}
          <div className="px-6">
            <div className="w-20 h-20 -mt-10 rounded-full bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-indigo-600">
                {currentUser.nickname.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* 프로필 정보 */}
          <CardContent className="px-6 pt-3 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{currentUser.nickname}</h1>
                  {currentUser.role && (
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border-transparent hover:bg-indigo-100">
                      {currentUser.role}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    onClick={() => setIsPointModalOpen(true)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1 text-[15px] font-black bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 border-amber-200 shadow-sm cursor-pointer hover:bg-amber-100 transition-colors"
                  >
                    <Coins className="w-5 h-5 text-amber-500" />
                    {totalPoints.toLocaleString()} P
                  </Badge>
                </div>
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

                <div className="mt-5 space-y-3">
                  {currentUser.preferredTypes && currentUser.preferredTypes.length > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-muted-foreground w-16">선호 분야</span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentUser.preferredTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs font-medium">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {currentUser.skills && currentUser.skills.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-semibold text-muted-foreground w-16 pt-1">보유 스킬</span>
                      <div className="flex flex-wrap gap-1.5 flex-1">
                        {currentUser.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/mypage/profile')}
                className="flex-shrink-0 mt-2 sm:mt-0"
              >
                <Edit3 className="w-4 h-4 mr-1.5" />
                프로필 설정
              </Button>
            </div>

            {/* 요약 통계 */}
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

      {/* 내 팀이 참여 중인 해커톤 목록 */}
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
            <CardDescription>내 팀으로 참여한 해커톤 목록</CardDescription>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 px-2">
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

      {/* 지난 해커톤(종료) 섹션 */}
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
              <CardDescription>종료된 해커톤 참여 기록</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-4 px-2 opacity-75">
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
                      variant="small"
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 내 팀 목록 (진행 중) 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-purple-500" />
              내 팀 (활동 중)
            </CardTitle>
            <CardDescription>현재 소속되어 활동 중인 팀 목록</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const activeTeams = myTeams.filter((team) => {
                const linkedHackathon = hackathons.find((h) => h.slug === team.hackathonSlug);
                return !linkedHackathon || linkedHackathon.status !== 'ended';
              });

              if (activeTeams.length === 0) {
                return (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    현재 활동 중인 팀이 없습니다.
                    <br />
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => router.push('/camp')}
                    >
                      팀 찾기
                    </Button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeTeams.map((team) => {
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
                            {team.isOpen ? '모집 중' : '모집 마감'}
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
                            <p className="text-slate-400">미연결 팀</p>
                          )}
                        </div>
                        <div className="mt-4 pt-3 border-t">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm"
                            onClick={() => router.push(`/basecamp/${team.teamCode}`)}
                          >
                            <Target className="w-4 h-4 mr-2" /> 베이스캠프 이동
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </motion.div>

      {/* 과거 팀 목록 섹션 */}
      {(() => {
        const pastTeams = myTeams.filter((team) => {
          const linkedHackathon = hackathons.find((h) => h.slug === team.hackathonSlug);
          return linkedHackathon && linkedHackathon.status === 'ended';
        });

        if (pastTeams.length === 0) return null;

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <Card>
              <div 
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                onClick={() => setShowPastTeams(!showPastTeams)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg text-slate-500">
                        <History className="w-5 h-5" />
                        과거 활동 팀 <Badge variant="secondary" className="ml-1 text-xs">{pastTeams.length}</Badge>
                      </CardTitle>
                      <CardDescription>종료된 해커톤에서 활동했던 팀 기록</CardDescription>
                    </div>
                    {showPastTeams ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </CardHeader>
              </div>
              
              {showPastTeams && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 opacity-80">
                    {pastTeams.map((team) => {
                      const linkedHackathon = hackathons.find(
                        (h) => h.slug === team.hackathonSlug,
                      );
                      return (
                        <div
                          key={team.teamCode}
                          className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">{team.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              활동 종료
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground mb-3">
                            {linkedHackathon && (
                              <p className="flex items-center gap-1 line-clamp-1">
                                <Trophy className="w-3 h-3" />
                                {linkedHackathon.title}
                              </p>
                            )}
                          </div>
                          <div className="pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full h-8 text-xs text-slate-500 hover:text-slate-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/basecamp/${team.teamCode}`);
                              }}
                            >
                              과거 베이스캠프 보기
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        );
      })()}

      {/* 포트폴리오 쇼케이스 (Project Showcase) 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5 text-yellow-500" />
              포트폴리오 쇼케이스 (Project Showcase)
            </CardTitle>
            <CardDescription>완료된 해커톤에서 만든 성과물을 공개하고 세상에 알리세요</CardDescription>
          </CardHeader>
          <CardContent>
            {mySubmissions.filter(s => s.status === 'submitted').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                아직 완성된 포트폴리오가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mySubmissions.filter(s => s.status === 'submitted').map((sub) => {
                  const hackathon = hackathons.find(
                    (h) => h.slug === sub.hackathonSlug,
                  );
                  const webLink = sub.artifacts.find(a => a.type === 'url')?.content;
                  const docLink = sub.artifacts.find(a => a.type === 'pdf' || a.type === 'text');

                  return (
                    <div
                      key={sub.id}
                      className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-md transition-all bg-white dark:bg-slate-900"
                    >
                      <div className="h-28 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 relative overflow-hidden flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                        <h4 className="text-xl font-black text-indigo-900/40 dark:text-indigo-200/20 italic tracking-wider whitespace-nowrap opacity-50 transform -rotate-6 scale-150">
                          {hackathon?.title || sub.hackathonSlug}
                        </h4>
                        <Badge className="absolute top-3 left-3 bg-white/90 text-indigo-700 hover:bg-white shadow-sm dark:bg-slate-800/90 dark:text-indigo-300">
                           {sub.teamName}
                        </Badge>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {hackathon?.title || 'Unknown Project'}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                          {sub.notes || '프로젝트 설명이 없습니다.'}
                        </p>

                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-dashed">
                          {webLink && (
                            <Button size="sm" variant="default" className="w-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm" onClick={() => window.open(webLink, '_blank')}>
                              <Globe className="w-3.5 h-3.5 mr-1.5" /> 사이트 방문
                            </Button>
                          )}
                          {docLink && (
                            <Button size="sm" variant="outline" className="w-full" onClick={() => alert('문서 다운로드 기능 예정')}>
                              <FileText className="w-3.5 h-3.5 mr-1.5" /> 문서(PDF)
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 북마크한 해커톤 섹션 */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bookmarkedHackathons.map((h) => (
                  <div
                    key={h.slug}
                    className="p-4 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/hackathons/${h.slug}`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm line-clamp-1">{h.title}</h3>
                      {getStatusBadge(h.status)}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{h.tags.join(' · ')}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 포인트 내역 모달 */}
      <Dialog open={isPointModalOpen} onOpenChange={setIsPointModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <History className="w-5 h-5 text-indigo-500" />
              포인트 내역
            </DialogTitle>
            <DialogDescription>지금까지 포인트를 획득한 내역을 확인합니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-5 mb-2 text-center border border-indigo-100 dark:border-indigo-800/30">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">현재 보유 포인트</span>
              <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2 mt-2">
                <Coins className="w-7 h-7 text-amber-500" />
                {totalPoints.toLocaleString()}
                <span className="text-xl font-bold text-slate-400">P</span>
              </p>
            </div>

            {sortedHistory.length > 0 ? (
              <div className="space-y-2">
                {sortedHistory.map((log) => (
                  <div key={log.id} className="flex justify-between items-center p-3 rounded-lg border bg-card hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{log.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(log.date)}</p>
                    </div>
                    <div className="shrink-0 ml-4 px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400 rounded-full font-bold text-sm tracking-tight border border-amber-200 dark:border-amber-500/30">
                      +{log.points.toLocaleString()} P
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                아직 포인트 내역이 없습니다.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
