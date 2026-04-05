'use client';

import { useBoardStore } from '@/store/useBoardStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useRankingStore } from '@/store/useRankingStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { computeHackathonStatus } from '@/lib/hackathon-utils';
import { normalizeSeedLeaderboards, normalizeSeedSubmissions } from '@/lib/seed-runtime';
import { enrichTeamsWithContext } from '@/lib/team-context';
import {
  boards,
  currentUser as seedUser,
  hackathonDetails,
  hackathons,
  leaderboards,
  personaPool,
  submissions,
  teams,
} from '@/data/seed';

export const SEED_VERSION = 'v5.6';

function buildDetailsRecord() {
  return hackathonDetails.reduce(
    (accumulator, detail) => {
      accumulator[detail.slug] = detail;
      return accumulator;
    },
    {} as Record<string, typeof hackathonDetails[number]>
  );
}

export function initializeStore() {
  const detailsRecord = buildDetailsRecord();
  const now = new Date();
  const computedHackathons = hackathons.map((hackathon) => ({
    ...hackathon,
    status: computeHackathonStatus(hackathon, detailsRecord[hackathon.slug], now),
  }));
  const hydratedTeams = enrichTeamsWithContext(teams, computedHackathons);

  const normalizedSubmissions = normalizeSeedSubmissions({
    details: detailsRecord,
    hackathons: computedHackathons,
    teams: hydratedTeams,
    submissions,
    leaderboards,
    now,
  });
  const normalizedLeaderboards = normalizeSeedLeaderboards({
    details: detailsRecord,
    hackathons: computedHackathons,
    teams: hydratedTeams,
    submissions: normalizedSubmissions,
    leaderboards,
    now,
  });

  useHackathonStore.setState({
    hackathons: computedHackathons,
    hackathonDetails: detailsRecord,
    leaderboards: normalizedLeaderboards,
  });
  useTeamStore.setState({ teams: hydratedTeams });
  useSubmissionStore.setState({ submissions: normalizedSubmissions });
  useBoardStore.setState({ posts: boards });

  useUserStore.getState().setAllUsers([seedUser, ...personaPool] as any);

  const existingUser = useUserStore.getState().currentUser;
  if (!existingUser || existingUser.id === seedUser.id) {
    useUserStore.setState({ currentUser: seedUser });
  }

  useRankingStore.getState().recalculateRankings();

  useNotificationStore.setState({ notifications: [], sentInvitations: [] });
  useNotificationStore.getState().addNotification({
    type: 'invitation',
    fromTeamName: 'Prompt Wizards',
    hackathonTitle: '제1회 생성형 AI 스타트업 챌린지',
    teamCode: 'T-PERSONA-GEN--1',
    toUserNickname: seedUser.nickname,
  });
  useNotificationStore.getState().addNotification({
    type: 'invitation',
    fromTeamName: 'Data Driven',
    hackathonTitle: '제1회 생성형 AI 스타트업 챌린지',
    teamCode: 'T-PERSONA-GEN--5',
    toUserNickname: seedUser.nickname,
  });
  useNotificationStore.getState().addNotification({
    type: 'invitation',
    fromTeamName: 'Pixel Perfect',
    hackathonTitle: '2026 사용자 경험 리디자인 챌린지',
    teamCode: 'T-PERSONA-UX-U-1',
    toUserNickname: seedUser.nickname,
  });

  useNotificationStore.getState().addSentInvitation({
    teamCode: 'T-HANDOVER-01',
    toUserNickname: '김프론트',
  });
  useNotificationStore.getState().updateSentInvitationStatus('T-HANDOVER-01', '김프론트', 'accepted');
  useNotificationStore.getState().addSentInvitation({
    teamCode: 'T-HANDOVER-01',
    toUserNickname: '이백엔드',
  });
  useNotificationStore.getState().addSentInvitation({
    teamCode: 'T-HANDOVER-01',
    toUserNickname: '박디자인',
  });
  useNotificationStore.getState().addSentInvitation({
    teamCode: 'T-GEN-5',
    toUserNickname: '강유진',
  });
  useNotificationStore.getState().addSentInvitation({
    teamCode: 'T-CLO-3',
    toUserNickname: '강유진',
  });

  localStorage.setItem('vibehack-seed-version', SEED_VERSION);
}

export function initializeIfNeeded() {
  const storedVersion = localStorage.getItem('vibehack-seed-version');
  if (storedVersion !== SEED_VERSION) {
    initializeStore();
    return true;
  }

  const existingDetails = useHackathonStore.getState().hackathonDetails;
  const detailsRecord = Object.keys(existingDetails).length > 0 ? existingDetails : buildDetailsRecord();
  const now = new Date();
  const refreshedHackathons = useHackathonStore.getState().hackathons.map((hackathon) => ({
    ...hackathon,
    status: computeHackathonStatus(hackathon, detailsRecord[hackathon.slug], now),
  }));
  const normalizedTeams = enrichTeamsWithContext(useTeamStore.getState().teams, refreshedHackathons, {
    preserveExisting: true,
  });
  const currentSubmissions = useSubmissionStore.getState().submissions;
  const currentLeaderboards = useHackathonStore.getState().leaderboards;
  const normalizedSubmissions = normalizeSeedSubmissions({
    details: detailsRecord,
    hackathons: refreshedHackathons,
    teams: normalizedTeams,
    submissions: currentSubmissions,
    leaderboards: Object.keys(currentLeaderboards).length > 0 ? currentLeaderboards : leaderboards,
    now,
  });
  const normalizedLeaderboards = normalizeSeedLeaderboards({
    details: detailsRecord,
    hackathons: refreshedHackathons,
    teams: normalizedTeams,
    submissions: normalizedSubmissions,
    leaderboards: Object.keys(currentLeaderboards).length > 0 ? currentLeaderboards : leaderboards,
    now,
  });

  useHackathonStore.setState({
    hackathons: refreshedHackathons,
    hackathonDetails: detailsRecord,
    leaderboards: normalizedLeaderboards,
  });
  useTeamStore.setState({ teams: normalizedTeams });
  useSubmissionStore.setState({ submissions: normalizedSubmissions });
  useRankingStore.getState().recalculateRankings();
  return false;
}
