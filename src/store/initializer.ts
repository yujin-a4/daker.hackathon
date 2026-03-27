'use client';

import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserStore } from '@/store/useUserStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useRankingStore } from '@/store/useRankingStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import {
  hackathons as seedHackathons,
  hackathonDetails as seedHackathonDetails,
  leaderboards,
  teams,
  rankings,
  submissions,
} from '@/data/seed';

// 🔥 스토리지 꼬임 방지를 위해 버전을 한 번 더 올립니다!
export const SEED_VERSION = 'v5.1';

export function initializeStore() {
  const now = new Date();

  // 1. 목록 데이터 다이나믹 날짜 세팅
  const dynamicHackathons = seedHackathons.map((h) => {
    const hCopy = { ...h };
    if (h.slug === 'daker-handover-2026-03') {
      hCopy.status = 'ongoing';
      hCopy.period = {
        ...h.period,
        submissionDeadlineAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      };
    } else if (h.slug === 'monthly-vibe-coding-2026-02') {
      hCopy.status = 'ongoing';
      hCopy.period = {
        ...h.period,
        submissionDeadlineAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      };
    } else {
      hCopy.status = 'ended';
      hCopy.period = {
        ...h.period,
        submissionDeadlineAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    return hCopy;
  });

  // 2. 🔥 상세 데이터 다이나믹 동기화 (객체 형태로 안전하게 복사!)
  const dynamicHackathonDetails: Record<string, any> = {};
  
  Object.entries(seedHackathonDetails).forEach(([slug, detail]) => {
    const detailCopy = JSON.parse(JSON.stringify(detail));
    
    if (slug === 'daker-handover-2026-03') {
      detailCopy.sections.schedule.milestones = [
        { name: "접수/기획서 제출 마감", at: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "최종 솔루션 제출 마감", at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "최종 결과 발표", at: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString() }
      ];
    } else if (slug === 'monthly-vibe-coding-2026-02') {
      detailCopy.sections.schedule.milestones = [
        { name: "아이디어 제출 마감", at: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "최종 결과 발표", at: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString() }
      ];
    } else {
      detailCopy.sections.schedule.milestones = [
        { name: "대회 시작", at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "리더보드 제출 마감", at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "대회 종료", at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString() }
      ];
    }
    dynamicHackathonDetails[slug] = detailCopy;
  });

  useHackathonStore.setState({ 
    hackathons: dynamicHackathons, 
    hackathonDetails: dynamicHackathonDetails, 
    leaderboards 
  });
  useTeamStore.setState({ teams });
  useSubmissionStore.setState({ submissions });
  useRankingStore.setState({ rankings });

  const existingUser = useUserStore.getState().currentUser;
  if (!existingUser) {
    // 빈 값 처리
  }

  useRankingStore.getState().recalculateRankings();

  localStorage.setItem('vibehack-seed-version', SEED_VERSION);
  console.log('[Initializer] 🚀 시드 데이터 v5.1 초기화 완료 (상세페이지 버그 픽스)');
}

export function initializeIfNeeded() {
  const storedVersion = localStorage.getItem('vibehack-seed-version');
  if (storedVersion === SEED_VERSION) {
    return false;
  }
  initializeStore();
  return true;
}
