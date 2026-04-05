import type { Hackathon, HackathonDetail, Leaderboard, LeaderboardEntry, Submission, Team } from '@/types';
import { computeHackathonStatus, getHackathonPhase } from '@/lib/hackathon-utils';

const ARTIFACT_KEY_ALIASES: Record<string, Record<string, string>> = {
  'gen-ai-startup-challenge': {
    plan: 'idea',
    demo: 'prototype',
    deck: 'demo',
  },
  'cloud-native-modernization': {
    repo: 'code',
  },
  'daker-handover-2026-03': {
    web: 'final',
  },
};

function hashSeed(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(i);
  }
  return Math.abs(hash);
}

function clampDate(iso: string, now: Date) {
  const date = new Date(iso);
  return date.getTime() > now.getTime() ? now : date;
}

function toIso(date: Date) {
  return date.toISOString();
}

function getValidItemKeys(detail: HackathonDetail) {
  return new Set((detail.sections.submit.submissionItems || []).map((item) => item.key));
}

function normalizeArtifactKey(detail: HackathonDetail, rawKey: string | undefined, index: number) {
  const items = detail.sections.submit.submissionItems || [];
  const validKeys = getValidItemKeys(detail);

  if (rawKey && validKeys.has(rawKey)) {
    return rawKey;
  }

  if (rawKey) {
    const alias = ARTIFACT_KEY_ALIASES[detail.slug]?.[rawKey];
    if (alias && validKeys.has(alias)) {
      return alias;
    }
  }

  return items[index]?.key;
}

function getSyntheticProgressKeys(detail: HackathonDetail, teamCode: string, now: Date) {
  const items = detail.sections.submit.submissionItems || [];
  if (items.length === 0) {
    return [] as string[];
  }

  const phase = getHackathonPhase(detail, now);
  const currentIndex = items.findIndex((item) => item.key === phase.itemKey);
  const seed = hashSeed(`${detail.slug}:${teamCode}`);

  if (phase.type === 'PREPARATION') {
    return [];
  }

  if (phase.type === 'SUBMISSION') {
    const completed = currentIndex >= 0 ? items.slice(0, currentIndex).map((item) => item.key) : [];
    if (currentIndex >= 0 && seed % 100 < 65) {
      completed.push(items[currentIndex].key);
    }
    return completed;
  }

  return items.map((item) => item.key);
}

function buildSyntheticArtifact(detail: HackathonDetail, key: string, teamCode: string, now: Date, index: number) {
  const item = (detail.sections.submit.submissionItems || []).find((submissionItem) => submissionItem.key === key);
  if (!item) {
    return null;
  }

  const seed = hashSeed(`${detail.slug}:${teamCode}:${key}`);
  const deadline = item.deadline ? new Date(item.deadline) : now;
  const anchor = clampDate(deadline.toISOString(), now);
  const offsetDays = (seed % 3) + 1;
  const uploadedAt = new Date(anchor.getTime() - offsetDays * 24 * 60 * 60 * 1000);

  return {
    type: item.format.toLowerCase().includes('url') ? 'url' : 'pdf',
    key,
    content: item.format.toLowerCase().includes('url')
      ? `https://example.com/${detail.slug}/${teamCode}/${key}`
      : `${detail.slug}-${teamCode}-${key}.pdf`,
    fileName: item.format.toLowerCase().includes('url')
      ? undefined
      : `${detail.slug}-${key}.pdf`,
    uploadedAt: toIso(index === 0 ? uploadedAt : new Date(uploadedAt.getTime() + index * 60 * 60 * 1000)),
  };
}

export function normalizeSeedSubmissions(params: {
  details: Record<string, HackathonDetail>;
  hackathons: Hackathon[];
  teams: Team[];
  submissions: Submission[];
  leaderboards: Record<string, Leaderboard>;
  now: Date;
}) {
  const { details, hackathons, teams, submissions, leaderboards, now } = params;
  const teamsByCode = new Map(teams.map((team) => [team.teamCode, team]));
  const computedHackathons = new Map(
    hackathons.map((hackathon) => [
      hackathon.slug,
      {
        ...hackathon,
        status: computeHackathonStatus(hackathon, details[hackathon.slug], now),
      },
    ])
  );

  const normalized = new Map<string, Submission>();

  for (const submission of submissions) {
    const team = teamsByCode.get(submission.teamCode);
    const detail = details[submission.hackathonSlug];
    const hackathon = computedHackathons.get(submission.hackathonSlug);

    if (!team || !detail || !hackathon || team.hackathonSlug !== submission.hackathonSlug) {
      continue;
    }

    const artifacts = submission.artifacts
      .map((artifact, index) => {
        const key = normalizeArtifactKey(detail, artifact.key, index);
        if (!key) {
          return null;
        }

        const uploadedAt = artifact.uploadedAt || submission.submittedAt;
        if (!uploadedAt || new Date(uploadedAt).getTime() > now.getTime()) {
          return null;
        }

        return {
          ...artifact,
          key,
          uploadedAt,
        };
      })
      .filter((artifact): artifact is NonNullable<typeof artifact> => Boolean(artifact));

    if (artifacts.length === 0) {
      continue;
    }

    const dedupedArtifacts = Array.from(
      new Map(
        artifacts
          .sort((left, right) => new Date(left.uploadedAt).getTime() - new Date(right.uploadedAt).getTime())
          .map((artifact) => [artifact.key || `${artifact.type}:${artifact.uploadedAt}`, artifact])
      ).values()
    );

    const submittedAt = dedupedArtifacts[dedupedArtifacts.length - 1]?.uploadedAt ?? submission.submittedAt;
    normalized.set(submission.id, {
      ...submission,
      hackathonSlug: team.hackathonSlug || submission.hackathonSlug,
      teamName: team.name,
      status: 'submitted',
      artifacts: dedupedArtifacts,
      submittedAt,
    });
  }

  const submissionsByTeamCode = new Map<string, Submission>(
    Array.from(normalized.values()).map((submission) => [submission.teamCode, submission])
  );

  for (const team of teams) {
    if (!team.hackathonSlug || submissionsByTeamCode.has(team.teamCode)) {
      continue;
    }

    const detail = details[team.hackathonSlug];
    const hackathon = computedHackathons.get(team.hackathonSlug);
    if (!detail || !hackathon) {
      continue;
    }

    const leaderboardEntry = leaderboards[team.hackathonSlug]?.entries.find((entry) => entry.teamName === team.name);
    const keys = getSyntheticProgressKeys(detail, team.teamCode, now);

    if (keys.length === 0) {
      continue;
    }

    const artifacts = keys
      .map((key, index) => buildSyntheticArtifact(detail, key, team.teamCode, now, index))
      .filter((artifact): artifact is NonNullable<typeof artifact> => Boolean(artifact));

    if (artifacts.length === 0) {
      continue;
    }

    const submittedAt = leaderboardEntry?.submittedAt ?? artifacts[artifacts.length - 1].uploadedAt;
    normalized.set(`synthetic-${team.teamCode}`, {
      id: `synthetic-${team.teamCode}`,
      hackathonSlug: team.hackathonSlug,
      teamCode: team.teamCode,
      teamName: team.name,
      status: 'submitted',
      artifacts,
      notes: 'seeded runtime submission',
      submittedAt,
    });
  }

  return Array.from(normalized.values()).sort((left, right) => {
    const leftTime = left.submittedAt ? new Date(left.submittedAt).getTime() : 0;
    const rightTime = right.submittedAt ? new Date(right.submittedAt).getTime() : 0;
    return leftTime - rightTime;
  });
}

function buildEndedEntries(params: {
  hackathon: Hackathon;
  teams: Team[];
  submissionsByTeamCode: Map<string, Submission>;
  rawEntries: Map<string, LeaderboardEntry>;
}) {
  const { hackathon, teams, submissionsByTeamCode, rawEntries } = params;
  const entries = teams.map((team, index) => {
    const raw = rawEntries.get(team.name);
    const submission = submissionsByTeamCode.get(team.teamCode);
    const score = raw?.score ?? Math.max(45, 88 - index * 4.2);
    const votes = raw?.votes ?? Math.max(0, 180 - index * 15);

    return {
      rank: null,
      teamName: team.name,
      score,
      votes,
      submittedAt: submission?.submittedAt ?? raw?.submittedAt ?? null,
    } satisfies LeaderboardEntry;
  });

  entries.sort((left, right) => {
    if ((right.score ?? 0) !== (left.score ?? 0)) {
      return (right.score ?? 0) - (left.score ?? 0);
    }
    return (right.votes ?? 0) - (left.votes ?? 0);
  });

  let currentRank = 1;
  return entries.map((entry, index) => {
    if (index > 0 && entry.score === entries[index - 1].score) {
      return { ...entry, rank: entries[index - 1].rank };
    }
    const ranked = { ...entry, rank: currentRank };
    currentRank = index + 2;
    return ranked;
  });
}

function buildInProgressEntries(params: {
  hackathon: Hackathon;
  teams: Team[];
  submissionsByTeamCode: Map<string, Submission>;
  rawEntries: Map<string, LeaderboardEntry>;
}) {
  const { hackathon, teams, submissionsByTeamCode, rawEntries } = params;

  return teams.map((team) => {
    const raw = rawEntries.get(team.name);
    const submission = submissionsByTeamCode.get(team.teamCode);

    return {
      rank: null,
      teamName: team.name,
      score: null,
      votes: hackathon.status === 'recruiting' ? 0 : raw?.votes ?? 0,
      submittedAt: submission?.submittedAt ?? null,
    } satisfies LeaderboardEntry;
  });
}

export function normalizeSeedLeaderboards(params: {
  details: Record<string, HackathonDetail>;
  hackathons: Hackathon[];
  teams: Team[];
  submissions: Submission[];
  leaderboards: Record<string, Leaderboard>;
  now: Date;
}) {
  const { details, hackathons, teams, submissions, leaderboards, now } = params;
  const submissionsByTeamCode = new Map<string, Submission>(
    submissions.map((submission) => [submission.teamCode, submission])
  );

  return Object.fromEntries(
    hackathons.map((hackathon) => {
      const detail = details[hackathon.slug];
      const status = computeHackathonStatus(hackathon, detail, now);
      const teamsForHackathon = teams.filter((team) => team.hackathonSlug === hackathon.slug);
      const rawEntries = new Map(
        (leaderboards[hackathon.slug]?.entries || []).map((entry) => [entry.teamName, entry])
      );

      const entries = status === 'ended'
        ? buildEndedEntries({
            hackathon: { ...hackathon, status },
            teams: teamsForHackathon,
            submissionsByTeamCode,
            rawEntries,
          })
        : buildInProgressEntries({
            hackathon: { ...hackathon, status },
            teams: teamsForHackathon,
            submissionsByTeamCode,
            rawEntries,
          });

      return [
        hackathon.slug,
        {
          updatedAt: leaderboards[hackathon.slug]?.updatedAt ?? now.toISOString(),
          entries,
        } satisfies Leaderboard,
      ];
    })
  ) as Record<string, Leaderboard>;
}
