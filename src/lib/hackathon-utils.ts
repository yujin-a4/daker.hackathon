import type { Hackathon, HackathonDetail } from '@/types';

export type PhaseType = 'SUBMISSION' | 'VOTING' | 'JUDGING' | 'RESULT' | 'PREPARATION';
export type HackathonStatus = Hackathon['status'];
export type RecruitmentStatus = 'recruiting' | 'closed';

export interface HackathonTimeline {
  startAt: Date;
  recruitingDeadline: Date;
  endAt: Date;
}

export interface HackathonStageMeta {
  label: string;
  countdownLabel: string;
  targetAt: Date;
}

function isPreStartStatus(status: Hackathon['status']) {
  return status === 'upcoming' || status === 'recruiting';
}

function buildMilestoneCountdownLabel(
  milestoneName: string,
  milestoneType?: HackathonDetail['sections']['schedule']['milestones'][number]['type']
) {
  const stageMatch = milestoneName.match(/(\d+\s*(?:단계|차))/);

  if (milestoneType === 'submission' && stageMatch) {
    return `${stageMatch[1]} 제출까지`;
  }

  if (milestoneType === 'submission' && milestoneName.includes('최종')) {
    return '최종 제출까지';
  }

  if (milestoneName === '시작') {
    return '시작까지';
  }

  if (milestoneName === '종료') {
    return '종료까지';
  }

  return `${milestoneName}까지`;
}

export function getHackathonStartAt(
  hackathon: Pick<Hackathon, 'period'>,
  detail?: HackathonDetail
): Date {
  const firstMilestoneAt = detail?.sections.schedule.milestones?.[0]?.at;
  return new Date(firstMilestoneAt ?? hackathon.period.submissionDeadlineAt);
}

export function getHackathonRecruitingDeadline(
  hackathon: Pick<Hackathon, 'period'>,
  detail?: HackathonDetail
): Date {
  const firstSubmissionMilestone = detail?.sections.schedule.milestones?.find(
    (milestone) => milestone.type === 'submission'
  );
  const fallbackDeadline =
    detail?.sections.submit.submissionItems?.[0]?.deadline ?? hackathon.period.submissionDeadlineAt;

  return new Date(firstSubmissionMilestone?.at ?? fallbackDeadline);
}

export function getHackathonEndAt(
  hackathon: Pick<Hackathon, 'period'>,
  detail?: HackathonDetail
): Date {
  const milestones = detail?.sections.schedule.milestones ?? [];
  const lastMilestoneAt = milestones.length > 0 ? milestones[milestones.length - 1].at : undefined;
  return new Date(lastMilestoneAt ?? hackathon.period.endAt);
}

export function getHackathonTimeline(
  hackathon: Pick<Hackathon, 'period'>,
  detail?: HackathonDetail
): HackathonTimeline {
  return {
    startAt: getHackathonStartAt(hackathon, detail),
    recruitingDeadline: getHackathonRecruitingDeadline(hackathon, detail),
    endAt: getHackathonEndAt(hackathon, detail),
  };
}

export function computeHackathonStatus(
  hackathon: Pick<Hackathon, 'period'>,
  detail?: HackathonDetail,
  now: Date = new Date()
): HackathonStatus {
  const timeline = getHackathonTimeline(hackathon, detail);

  if (now >= timeline.endAt) return 'ended';
  if (now < timeline.startAt) return 'upcoming';
  return 'ongoing';
}

export function computeHackathonRecruitmentStatus(
  hackathon: Pick<Hackathon, 'period' | 'status'>,
  detail?: HackathonDetail,
  now: Date = new Date()
): RecruitmentStatus {
  if (hackathon.status === 'upcoming' || hackathon.status === 'ended') return 'closed';
  return now < getHackathonRecruitingDeadline(hackathon, detail) ? 'recruiting' : 'closed';
}

export function getHackathonEndMeta(
  hackathon: Pick<Hackathon, 'period'>,
  detail?: HackathonDetail
): HackathonStageMeta {
  return {
    label: '종료',
    countdownLabel: '종료까지',
    targetAt: getHackathonEndAt(hackathon, detail),
  };
}

export function getHackathonStageMeta(
  hackathon: Pick<Hackathon, 'status' | 'period'>,
  detail?: HackathonDetail,
  now: Date = new Date()
): HackathonStageMeta | null {
  const timeline = getHackathonTimeline(hackathon, detail);

  if (isPreStartStatus(hackathon.status)) {
    return {
      label: '시작',
      countdownLabel: '시작까지',
      targetAt: timeline.startAt,
    };
  }

  if (hackathon.status === 'ended') {
    return null;
  }

  if (now < timeline.recruitingDeadline) {
    return {
      label: '팀 모집 마감',
      countdownLabel: '팀 모집 마감까지',
      targetAt: timeline.recruitingDeadline,
    };
  }

  const nextMilestone = detail?.sections.schedule.milestones?.find((milestone) => new Date(milestone.at) > now);
  if (nextMilestone) {
    return {
      label: nextMilestone.name,
      countdownLabel: buildMilestoneCountdownLabel(nextMilestone.name, nextMilestone.type),
      targetAt: new Date(nextMilestone.at),
    };
  }

  return {
    label: '종료',
    countdownLabel: '종료까지',
    targetAt: timeline.endAt,
  };
}

export function isHackathonRecruiting(
  hackathon: Pick<Hackathon, 'status' | 'period'>,
  detail?: HackathonDetail | number
) {
  return computeHackathonRecruitmentStatus(
    hackathon,
    typeof detail === 'object' && detail !== null ? detail : undefined
  ) === 'recruiting';
}

export function isHackathonActive(hackathon: Pick<Hackathon, 'status'>) {
  return hackathon.status !== 'ended';
}

export function getHackathonStatusLabel(status: HackathonStatus) {
  switch (status) {
    case 'upcoming':
      return '예정';
    case 'recruiting':
    case 'ongoing':
      return '진행중';
    case 'ended':
      return '종료';
    default:
      return status;
  }
}

export function getRecruitmentStatusLabel(status: RecruitmentStatus) {
  return status === 'recruiting' ? '모집중' : '모집마감';
}

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

export function getHackathonPhase(detail: HackathonDetail, now: Date = new Date()): HackathonPhase {
  const milestones = detail.sections.schedule.milestones || [];
  const submissionItems = detail.sections.submit.submissionItems || [];

  if (milestones.length === 0) {
    return {
      type: 'PREPARATION',
      name: 'Preparation',
      endDate: null,
      milestoneIndex: -1,
      step: 0,
      votingEnabled: false,
      judgingEnabled: false,
      galleryEnabled: false,
    };
  }

  const firstMilestoneAt = new Date(milestones[0].at);
  if (now < firstMilestoneAt) {
    return {
      type: 'PREPARATION',
      name: 'Before Start',
      endDate: firstMilestoneAt,
      milestoneIndex: -1,
      step: 0,
      votingEnabled: false,
      judgingEnabled: false,
      galleryEnabled: false,
    };
  }

  for (let i = 0; i < milestones.length; i += 1) {
    const milestone = milestones[i];
    if (milestone.type !== 'submission') continue;

    const phaseStart = new Date(milestones[i - 1]?.at ?? milestones[0].at);
    const phaseEnd = new Date(milestone.at);

    if (now >= phaseStart && now < phaseEnd) {
      return {
        type: 'SUBMISSION',
        itemKey: milestone.itemKey ?? submissionItems[Math.max(0, i - 1)]?.key,
        name: milestone.name,
        endDate: phaseEnd,
        milestoneIndex: i,
        step: milestone.step ?? i,
        votingEnabled: false,
        judgingEnabled: false,
        galleryEnabled: false,
      };
    }
  }

  for (let i = 0; i < milestones.length; i += 1) {
    const milestone = milestones[i];
    if (!milestone.type || milestone.type === 'submission') continue;

    const phaseStart = new Date(milestone.at);
    const phaseEnd = milestones[i + 1] ? new Date(milestones[i + 1].at) : null;
    if (now < phaseStart || (phaseEnd && now >= phaseEnd)) continue;

    const type =
      milestone.type === 'voting'
        ? 'VOTING'
        : milestone.type === 'judging'
          ? 'JUDGING'
          : 'RESULT';

    return {
      type,
      itemKey: milestone.itemKey,
      name: milestone.name,
      endDate: phaseEnd,
      milestoneIndex: i,
      step: milestone.step ?? i,
      votingEnabled: milestone.votingEnabled !== undefined ? milestone.votingEnabled : type === 'VOTING',
      judgingEnabled:
        milestone.judgingEnabled !== undefined ? milestone.judgingEnabled : type === 'JUDGING' || type === 'RESULT',
      galleryEnabled:
        milestone.galleryEnabled !== undefined
          ? milestone.galleryEnabled
          : type === 'VOTING' || type === 'JUDGING' || type === 'RESULT',
    };
  }

  const lastMilestone = milestones[milestones.length - 1];
  if (lastMilestone.type === 'result' && now >= new Date(lastMilestone.at)) {
    return {
      type: 'RESULT',
      itemKey: lastMilestone.itemKey,
      name: lastMilestone.name,
      endDate: null,
      milestoneIndex: milestones.length - 1,
      step: lastMilestone.step ?? milestones.length,
      votingEnabled: false,
      judgingEnabled: true,
      galleryEnabled: true,
    };
  }

  return {
    type: 'PREPARATION',
    name: 'Preparation',
    endDate: null,
    milestoneIndex: -1,
    step: 0,
    votingEnabled: false,
    judgingEnabled: false,
    galleryEnabled: false,
  };
}

export interface CompetitionEntry {
  teamCode: string;
  name: string;
  isSolo: boolean;
  leaderId?: string;
  memberCount?: number;
  rank: number | null;
  votes: number;
  judgeScore: number | null;
  finalScore: number | null;
  submissions: Record<string, string | null>;
  isMyTeam: boolean;
}

export function calculateCompetitionStandings(
  phase: HackathonPhase,
  teams: any[],
  submissions: any[],
  votes: Record<string, number>,
  leaderboardEntries: any[],
  myTeamCode?: string
): CompetitionEntry[] {
  const standings = teams.map((team) => {
    const teamSubmissions = submissions.filter((submission) => submission.teamCode === team.teamCode);
    const submissionMap: Record<string, string | null> = {};

    teamSubmissions.forEach((submission) => {
      submission.artifacts.forEach((artifact: any) => {
        if (artifact.key) {
          submissionMap[artifact.key] = artifact.uploadedAt || submission.submittedAt || new Date().toISOString();
        }
      });
    });

    const leaderboardEntry = leaderboardEntries.find((entry) => entry.teamName === team.name);
    const teamVotes = (leaderboardEntry?.votes ?? 0) + (votes[team.name] || 0);
    const judgeScore = leaderboardEntry?.score ?? null;

    let finalScore = null;
    if (phase.judgingEnabled && judgeScore !== null) {
      const voteScoreEquivalent = Math.min(100, (teamVotes / 200) * 100);
      finalScore = voteScoreEquivalent * 0.3 + judgeScore * 0.7;
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
      isMyTeam: team.teamCode === myTeamCode,
    };
  });

  standings.sort((left, right) => {
    if (phase.type === 'RESULT' && left.finalScore !== null && right.finalScore !== null) {
      return right.finalScore - left.finalScore;
    }

    if (phase.votingEnabled && left.votes !== right.votes) {
      return right.votes - left.votes;
    }

    const leftSubmissionCount = Object.keys(left.submissions).length;
    const rightSubmissionCount = Object.keys(right.submissions).length;
    if (leftSubmissionCount !== rightSubmissionCount) {
      return rightSubmissionCount - leftSubmissionCount;
    }

    if (leftSubmissionCount > 0 && rightSubmissionCount > 0) {
      const leftLastSubmittedAt = Math.max(
        ...Object.values(left.submissions)
          .filter(Boolean)
          .map((value) => new Date(value as string).getTime())
      );
      const rightLastSubmittedAt = Math.max(
        ...Object.values(right.submissions)
          .filter(Boolean)
          .map((value) => new Date(value as string).getTime())
      );

      if (leftLastSubmittedAt !== rightLastSubmittedAt) {
        return leftLastSubmittedAt - rightLastSubmittedAt;
      }
    }

    return left.name.localeCompare(right.name);
  });

  return standings.map((entry, index) => ({
    ...entry,
    rank: Object.keys(entry.submissions).length > 0 || entry.votes > 0 ? index + 1 : null,
  }));
}

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
