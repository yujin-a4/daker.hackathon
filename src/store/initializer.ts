'use client';

import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useRankingStore } from '@/store/useRankingStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import {
  hackathons,
  hackathonDetails,
  leaderboards,
  teams,
  rankings,
  submissions,
} from '@/data/seed';

export const SEED_VERSION = 'v3.1';

export function initializeStore() {
  // hackathon, team, submission, ranking은 시드로 덮어쓰기
  useHackathonStore.setState({ hackathons, hackathonDetails, leaderboards });
  useTeamStore.setState({ teams });
  useSubmissionStore.setState({ submissions });
  useRankingStore.setState({ rankings });

  // 유저: 비로그인 상태로 시작 (함수를 건드리지 않도록 currentUser만 설정)
  const existingUser = useUserStore.getState().currentUser;
  if (!existingUser) {
    useUserStore.setState({ currentUser: null }, false);
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
