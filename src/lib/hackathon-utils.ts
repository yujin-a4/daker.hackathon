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

      return {
        type,
        itemKey: m.itemKey,
        name: m.name,
        endDate: end,
        milestoneIndex: i,
        step: m.step ?? 1,
        votingEnabled: m.votingEnabled ?? false,
        judgingEnabled: m.judgingEnabled ?? false,
        galleryEnabled: m.galleryEnabled ?? true
      };
    }
  }

  // 모든 마일스톤이 지났다면 결과 단계
  const lastMilestone = milestones[milestones.length - 1];
  if (now >= new Date(lastMilestone.at)) {
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

  // 아직 첫 마일스톤 시작 전이라면 준비 단계
  return { 
    type: 'PREPARATION', 
    name: '준비 중', 
    endDate: new Date(milestones[0].at), 
    milestoneIndex: -1,
    step: 0,
    votingEnabled: false,
    judgingEnabled: false,
    galleryEnabled: false
  };
}

export interface CompetitionEntry {
  teamCode: string;
  name: string;
  isSolo: boolean;
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
          submissionMap[art.key] = sub.submittedAt;
        }
      });
    });

    const lbEntry = leaderboardEntries.find(e => e.teamName === team.name);
    const teamVotes = (lbEntry?.votes ?? 0) + (votes[team.name] || 0);
    const judgeScore = lbEntry?.score ?? null;

    // 최종 점수 계산 (30/70) - RESULT 단계에서만 적용
    let finalScore = null;
    if (phase.judgingEnabled && judgeScore !== null) {
      // 투표 점수 정규화 (최고 득표수 기준 100점 만점으로 환산하거나 절대값 사용)
      // 여기서는 심플하게 (평점 * 0.7) + (로그화된 투표 가중치 등) -> 유저 요청대로 30/70 비율 적용
      // 실제 구현 시 투표수의 최대치를 기준으로 백분위 환산 필요
      const voteScoreEquivalent = Math.min(100, (teamVotes / 200) * 100); 
      finalScore = (voteScoreEquivalent * 0.3) + (judgeScore * 0.7);
    }

    return {
      teamCode: team.teamCode,
      name: team.name,
      isSolo: !!team.isSolo,
      rank: null,
      votes: teamVotes,
      judgeScore,
      finalScore,
      submissions: submissionMap,
      isMyTeam: team.teamCode === myTeamCode
    };
  });

  // 정렬 로직
  standings.sort((a, b) => {
    // 1. 최종 결과 단계: 최종 점수 우선
    if (phase.type === 'RESULT' && a.finalScore !== null && b.finalScore !== null) {
      return b.finalScore - a.finalScore;
    }

    // 2. 투표 단계: 투표 수 우선
    if (phase.votingEnabled) {
      if (a.votes !== b.votes) return b.votes - a.votes;
    }

    // 3. 제출 단계 또는 투표 전: 특정 아이템 제출 여부 및 시간 우선
    if (phase.itemKey) {
      const aSub = a.submissions[phase.itemKey];
      const bSub = b.submissions[phase.itemKey];
      
      if (aSub && bSub) {
        return new Date(aSub).getTime() - new Date(bSub).getTime();
      }
      if (aSub) return -1;
      if (bSub) return 1;
    }

    // 기본: 이름순
    return a.name.localeCompare(b.name);
  });

  // 순위 부여 (제출한 팀만)
  return standings.map((entry, idx) => ({
    ...entry,
    rank: (entry.submissions[Object.keys(entry.submissions)[0]] || entry.votes > 0) ? idx + 1 : null
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
