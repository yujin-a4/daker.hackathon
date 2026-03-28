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
import { useNotificationStore } from './useNotificationStore';

export const SEED_VERSION = 'v4.4';

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

  // 샘플 알림 주입
  const currentNotifs = useNotificationStore.getState().notifications;
  if (currentNotifs.length === 0) {
    useNotificationStore.getState().addNotification({
      type: 'invitation',
      fromTeamName: 'GenAI Innovators #5',
      hackathonTitle: '제1회 생성형 AI 스타트업 챌린지',
      teamCode: 'T-GENAI-AUTO-5',
    });
    useNotificationStore.getState().addNotification({
      type: 'invitation',
      fromTeamName: 'Cloud Cloud #3',
      hackathonTitle: '2026 클라우드 네이티브 현대화 대회',
      teamCode: 'T-CLOUD-AUTO-3',
    });
    useNotificationStore.getState().addNotification({
      type: 'invitation',
      fromTeamName: 'Web3 Builder',
      hackathonTitle: 'Web 3.0 디파이(DeFi) 혁신 챌린지',
      teamCode: 'T-WEB3-AUTO-1',
    });

    // Sample Sent Invitations (from '강유진''s team 404found)
    useNotificationStore.getState().addSentInvitation({
      teamCode: 'T-HANDOVER-01',
      toUserNickname: '김프론트',
    });
    // set it as accepted for demo
    useNotificationStore.getState().updateSentInvitationStatus('T-HANDOVER-01', '김프론트', 'accepted');

    useNotificationStore.getState().addSentInvitation({
      teamCode: 'T-HANDOVER-01',
      toUserNickname: '이백엔드',
    });

    useNotificationStore.getState().addSentInvitation({
      teamCode: 'T-HANDOVER-01',
      toUserNickname: '박디자인',
    });

    // invitations for current user from other teams (to show sync)
    useNotificationStore.getState().addSentInvitation({
      teamCode: 'T-GENAI-AUTO-5',
      toUserNickname: '강유진',
    });
    useNotificationStore.getState().addSentInvitation({
      teamCode: 'T-CLOUD-AUTO-3',
      toUserNickname: '강유진',
    });
  }

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
