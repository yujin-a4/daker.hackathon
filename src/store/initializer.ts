'use client';

import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useRankingStore } from '@/store/useRankingStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useBoardStore } from '@/store/useBoardStore';
import {
  hackathons,
  hackathonDetails,
  leaderboards,
  teams,
  rankings,
  submissions,
  boards,
  currentUser as seedUser,
} from '@/data/seed';

export const SEED_VERSION = 'v4.0';

export function initializeStore() {
  const detailsRecord = hackathonDetails.reduce((acc, detail) => {
    acc[detail.slug] = detail;
    return acc;
  }, {} as Record<string, typeof hackathonDetails[0]>);

  // hackathon, team, submission, ranking은 시드로 덮어쓰기
  useHackathonStore.setState({ hackathons, hackathonDetails: detailsRecord, leaderboards });
  useTeamStore.setState({ teams });
  useSubmissionStore.setState({ submissions });
  useRankingStore.setState({ rankings });
  useBoardStore.setState({ posts: boards });

  // 유저: 시드 유저(강유진)이거나 비로그인이면 시드 데이터로 강제 업데이트
  const existingUser = useUserStore.getState().currentUser;
  if (!existingUser || existingUser.id === 'user-001-yujin') {
    useUserStore.setState({ currentUser: seedUser });
  }

  // 랭킹 포인트 계산
  useRankingStore.getState().recalculateRankings();

  localStorage.setItem('vibehack-seed-version', SEED_VERSION);
  console.log('[Initializer] 시드 데이터 초기화 완료 ✅');
}

export function initializeIfNeeded() {
  const storedVersion = localStorage.getItem('vibehack-seed-version');
  if (storedVersion === SEED_VERSION) {
    console.log('[Initializer] 시드 데이터 최신 — 스킵');
    return false;
  }
  initializeStore();
  return true;
}
