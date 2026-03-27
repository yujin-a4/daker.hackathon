'use client';

import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useRankingStore } from '@/store/useRankingStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import {
  hackathons as seedHackathons,
  hackathonDetails,
  leaderboards,
  teams,
  rankings,
  submissions,
} from '@/data/seed';

// 🔥 시니어의 꿀팁: 버전을 올려서 무조건 오늘 기준으로 데이터가 엎어지게 강제!
export const SEED_VERSION = 'v4.0';

export function initializeStore() {
  const now = new Date();

  // 🚀 다이나믹 날짜 생성 로직: seed 데이터를 가져와서 오늘 기준으로 날짜를 조작해버림
  const dynamicHackathons = seedHackathons.map((h) => {
    const hCopy = { ...h };
    
    if (h.slug === 'daker-handover-2026-03') {
      // 1. 메인 해커톤 (긴급 인수인계): 무조건 D-3 마감으로 고정!
      hCopy.status = 'ongoing';
      hCopy.period = {
        ...h.period,
        // 오늘로부터 정확히 3일 뒤 마감
        submissionDeadlineAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        // 오늘로부터 10일 뒤 종료
        endAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      };
    } else if (h.slug === 'monthly-vibe-coding-2026-02') {
      // 2. 서브 해커톤: D-10 마감으로 세팅
      hCopy.status = 'ongoing';
      hCopy.period = {
        ...h.period,
        submissionDeadlineAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      };
    } else {
      // 3. 그 외 (종료된 해커톤): 10일 전 종료로 세팅
      hCopy.status = 'ended';
      hCopy.period = {
        ...h.period,
        submissionDeadlineAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    
    return hCopy;
  });

  // 조작된 dynamicHackathons를 스토어에 덮어쓰기!
  useHackathonStore.setState({ 
    hackathons: dynamicHackathons, 
    hackathonDetails, 
    leaderboards 
  });
  useTeamStore.setState({ teams });
  useSubmissionStore.setState({ submissions });
  useRankingStore.setState({ rankings });

  // 유저 정보는 우리가 useUserStore에서 "강유진" 님으로 찰떡같이 세팅해뒀으니 여기서 건드리지 않음!
  const existingUser = useUserStore.getState().currentUser;
  if (!existingUser) {
    // 혹시라도 null이면 빈 값 유지
    // useUserStore.setState({ currentUser: null }, false);
  }

  // 랭킹 포인트 계산
  useRankingStore.getState().recalculateRankings();

  localStorage.setItem('vibehack-seed-version', SEED_VERSION);
  console.log('[Initializer] 🚀 다이나믹 날짜 시드 데이터 초기화 완료 ✅');
}

export function initializeIfNeeded() {
  const storedVersion = localStorage.getItem('vibehack-seed-version');
  // 버전이 다르면 무조건 새로 엎어치기
  if (storedVersion === SEED_VERSION) {
    console.log('[Initializer] 시드 데이터 최신 — 스킵');
    return false;
  }
  initializeStore();
  return true;
}
