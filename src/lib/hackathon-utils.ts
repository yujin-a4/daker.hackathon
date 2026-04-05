import type { Hackathon, HackathonDetail } from '@/types';

export type PhaseType = 'SUBMISSION' | 'VOTING' | 'JUDGING' | 'RESULT' | 'PREPARATION';
export type HackathonStatus = Hackathon['status'];

export function getHackathonRecruitingDeadline(
  hackathon: Pick<Hackathon, 'period'>,
  detail?: HackathonDetail
): Date {
  const firstSubmissionMilestone = detail?.sections.schedule.milestones?.find(
    (milestone) => milestone.type === 'submission'
  );
  const fallbackDeadline = detail?.sections.submit.submissionItems?.[0]?.deadline ?? hackathon.period.submissionDeadlineAt;

  return new Date(firstSubmissionMilestone?.at ?? fallbackDeadline);
}

export function computeHackathonStatus(
  hackathon: Pick<Hackathon, 'period'>,
  detail?: HackathonDetail,
  now: Date = new Date()
): HackathonStatus {
  const endAt = new Date(hackathon.period.endAt);
  if (now >= endAt) return 'ended';

  const recruitingDeadline = getHackathonRecruitingDeadline(hackathon, detail);
  if (now < recruitingDeadline) return 'recruiting';

  return 'ongoing';
}

export function isHackathonRecruiting(hackathon: Pick<Hackathon, 'status'>) {
  return hackathon.status === 'recruiting';
}

export function isHackathonActive(hackathon: Pick<Hackathon, 'status'>) {
  return hackathon.status !== 'ended';
}

export function getHackathonStatusLabel(status: HackathonStatus) {
  switch (status) {
    case 'recruiting':
      return '모집중';
    case 'ongoing':
      return '진행중';
    case 'ended':
      return '종료';
    default:
      return status;
  }
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
      judgingEnabled: milestone.judgingEnabled !== undefined ? milestone.judgingEnabled : type === 'JUDGING' || type === 'RESULT',
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
