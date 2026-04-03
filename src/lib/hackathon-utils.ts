import { HackathonDetail, LeaderboardEntry } from '@/types';

export type PhaseType = 'SUBMISSION' | 'VOTING' | 'JUDGING' | 'RESULT' | 'PREPARATION';

export interface HackathonPhase {
  type: PhaseType;
  itemKey?: string;
  name: string;
  endDate: Date | null;
  milestoneIndex: number;
  step: number;
  votingEnabled: boolean;
  judgingEnabled: boolean;
  galleryEnabled: boolean;
}

/**
 * 현재 시간에 기반하여 해커톤의 활성 단계를 계산합니다.
 */
export function getHackathonPhase(detail: HackathonDetail, now: Date = new Date()): HackathonPhase {
  const milestones = detail.sections.schedule.milestones || [];

  if (milestones.length === 0) {
    return {
      type: 'PREPARATION',
      name: '준비 중',
      endDate: null,
      milestoneIndex: -1,
      step: 0,
      votingEnabled: false,
      judgingEnabled: false,
      galleryEnabled: true
    };
  }

  // 시간순으로 정렬된 마일스톤 확인
  for (let i = 0; i < milestones.length; i++) {
    const start = new Date(milestones[i].at);
    const end = milestones[i + 1] ? new Date(milestones[i + 1].at) : null;

    // 현재 시간이 이 마일스톤 범위 안에 있는가?
    if (now >= start && (!end || now < end)) {
      const m = milestones[i];
      let type: PhaseType = 'PREPARATION';

      switch (m.type) {
        case 'submission': type = 'SUBMISSION'; break;
        case 'voting': type = 'VOTING'; break;
        case 'judging': type = 'JUDGING'; break;
        case 'result': type = 'RESULT'; break;
      }

      // 🌟 핵심: 제출 기간(SUBMISSION)에는 표절 방지를 위해 갤러리 강제 차단
      const isGalleryEnabled = m.galleryEnabled !== undefined ? m.galleryEnabled : (type !== 'SUBMISSION' && type !== 'PREPARATION');

      return {
        type,
        itemKey: m.itemKey,
        name: m.name,
        endDate: end,
        milestoneIndex: i,
        step: m.step ?? 1,
        votingEnabled: m.votingEnabled !== undefined ? m.votingEnabled : type === 'VOTING',
        judgingEnabled: m.judgingEnabled !== undefined ? m.judgingEnabled : type === 'RESULT' || type === 'JUDGING',
        galleryEnabled: isGalleryEnabled
      };
    }
  }

  // 모든 마일스톤이 지났다면 결과 단계
  const lastMilestone = milestones[milestones.length - 1];
  return {
    type: 'RESULT',
    name: '최종 결과 발표',
    endDate: null,
    milestoneIndex: milestones.length - 1,
    step: lastMilestone.step ?? 3,
    votingEnabled: false,
    judgingEnabled: true,
    galleryEnabled: true
  };
}

export interface CompetitionEntry {
  teamCode: string;
  name: string;
  isSolo: boolean;
  leaderId?: string;       // 팀장 ID — allUsers로 닉네임 역추적
  memberCount?: number;   // 팀원 수
  rank: number | null;
  votes: number;
  judgeScore: number | null;
  finalScore: number | null;
  submissions: Record<string, string | null>; // { itemKey: submittedAt }
  isMyTeam: boolean;
}

/**
 * 단계별 복합 로직을 적용하여 실시간 순위를 산정합니다.
 */
export function calculateCompetitionStandings(
  phase: HackathonPhase,
  teams: any[],
  submissions: any[],
  votes: Record<string, number>,
  leaderboardEntries: any[],
  myTeamCode?: string
): CompetitionEntry[] {
  const standings = teams.map(team => {
    const teamSubmissions = submissions.filter(s => s.teamCode === team.teamCode);
    const submissionMap: Record<string, string | null> = {};

    // 각 제출 항목별 상태 매핑
    teamSubmissions.forEach(sub => {
      sub.artifacts.forEach((art: any) => {
        if (art.key) {
          submissionMap[art.key] = art.uploadedAt || sub.submittedAt || new Date().toISOString();
        }
      });
    });

    const lbEntry = leaderboardEntries.find(e => e.teamName === team.name);
    const teamVotes = (lbEntry?.votes ?? 0) + (votes[team.name] || 0);
    const judgeScore = lbEntry?.score ?? null;

    // 최종 점수 계산 (30/70 비율) - RESULT 단계에서만 적용됨
    let finalScore = null;
    if (phase.judgingEnabled && judgeScore !== null) {
      const voteScoreEquivalent = Math.min(100, (teamVotes / 200) * 100);
      finalScore = (voteScoreEquivalent * 0.3) + (judgeScore * 0.7);
    }

    return {
      teamCode: team.teamCode,
      name: team.name,
      isSolo: !!team.isSolo,
      leaderId: team.leaderId,
      memberCount: team.memberCount ?? 1,
      rank: null,
      votes: teamVotes,
      judgeScore,
      finalScore,
      submissions: submissionMap,
      isMyTeam: team.teamCode === myTeamCode
    };
  });

  // 🌟 여기서 정렬 로직을 완벽하게 수정했어! 🌟
  standings.sort((a, b) => {
    // 1. 최종 결과 단계: 최종 점수 높은 팀 우선
    if (phase.type === 'RESULT' && a.finalScore !== null && b.finalScore !== null) {
      return b.finalScore - a.finalScore;
    }

    // 2. 투표 단계: 투표 수 많은 팀 우선
    if (phase.votingEnabled) {
      if (a.votes !== b.votes) return b.votes - a.votes;
    }

    // 3. 제출 단계: 제출한 총 단계(항목) 수가 많은 팀 무조건 우선! (3단계 > 2단계 > 1단계)
    const aSubCount = Object.keys(a.submissions).length;
    const bSubCount = Object.keys(b.submissions).length;

    if (aSubCount !== bSubCount) {
      return bSubCount - aSubCount; // 내림차순 (숫자가 클수록 위로)
    }

    // 4. 제출한 단계 수가 같다면, 더 '먼저' 제출한 팀 우선 (빠른 시간 우대)
    if (aSubCount > 0 && bSubCount > 0) {
      const aLastTime = Math.max(...Object.values(a.submissions).filter(Boolean).map(d => new Date(d as string).getTime()));
      const bLastTime = Math.max(...Object.values(b.submissions).filter(Boolean).map(d => new Date(d as string).getTime()));
      if (aLastTime !== bLastTime) {
        return aLastTime - bLastTime; // 오름차순 (시간값이 작을수록 먼저 낸 것이므로 위로)
      }
    }

    // 5. 위 조건이 모두 같다면 기본 이름순
    return a.name.localeCompare(b.name);
  });

  // 순위 부여 (제출을 하나라도 했거나 투표를 1표라도 받은 팀만 랭크 부여)
  return standings.map((entry, idx) => ({
    ...entry,
    rank: (Object.keys(entry.submissions).length > 0 || entry.votes > 0) ? idx + 1 : null
  }));
}

/**
 * 단계에 맞는 리더보드 정렬 함수를 반환합니다.
 */
export function getLeaderboardSortingMode(phase: HackathonPhase) {
  switch (phase.type) {
    case 'VOTING':
      return 'votes';
    case 'JUDGING':
    case 'RESULT':
      return 'score';
    case 'SUBMISSION':
    default:
      return 'recent';
  }
}