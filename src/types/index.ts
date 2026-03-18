export interface Hackathon {
  slug: string;
  title: string;
  status: "ongoing" | "upcoming" | "ended";
  tags: string[];
  thumbnailUrl: string;
  period: {
    timezone: string;
    submissionDeadlineAt: string; // ISO 8601
    endAt: string;
  };
  participantCount: number;
  links: {
    detail: string;
    rules: string;
    faq: string;
  };
}

export interface HackathonDetail {
  slug: string;
  title: string;
  sections: {
    overview: {
      summary: string;
      teamPolicy: { allowSolo: boolean; maxTeamSize: number };
    };
    info: {
      notice: string[];
      links: { rules: string; faq: string };
    };
    eval: {
      metricName: string;
      description: string;
      scoreSource?: "vote" | "auto";
      limits?: { maxRuntimeSec?: number; maxSubmissionsPerDay?: number };
      scoreDisplay?: {
        label: string;
        breakdown: { key: string; label: string; weightPercent: number }[];
      };
    };
    schedule: {
      timezone: string;
      milestones: { name: string; at: string }[];
    };
    prize: {
      items: { place: string; amountKRW: number }[];
    };
    teams: {
      campEnabled: boolean;
      listUrl: string;
    };
    submit: {
      allowedArtifactTypes: string[];
      submissionUrl: string;
      guide: string[];
      submissionItems?: { key: string; title: string; format: string }[];
    };
    leaderboard: {
      publicLeaderboardUrl: string;
      note: string;
    };
  };
}

export interface LeaderboardEntry {
  rank: number | null;
  teamName: string;
  score: number | null;
  submittedAt: string | null;
  scoreBreakdown?: Record<string, number>;
  artifacts?: {
    webUrl?: string;
    pdfUrl?: string;
    planTitle?: string;
  };
}

export interface Leaderboard {
  updatedAt: string;
  entries: LeaderboardEntry[];
}

export interface Team {
  teamCode: string;
  hackathonSlug: string | null;
  name: string;
  isOpen: boolean;
  memberCount: number;
  maxTeamSize: number;
  lookingFor: string[];
  intro: string;
  contact: { type: string; url: string };
  createdAt: string;
}

export interface RankingUser {
  rank: number;
  nickname: string;
  points: number;
  hackathonsJoined: number;
  winsCount: number;
}

export interface Submission {
  id: string;
  hackathonSlug: string;
  teamCode: string;
  teamName: string;
  status: "draft" | "submitted";
  artifacts: {
    type: string;
    key?: string;
    content?: string;
    fileName?: string;
    uploadedAt: string;
  }[];
  notes: string;
  submittedAt: string | null;
}

export interface CurrentUser {
  id: string;
  nickname: string;
  email: string;
  teamCodes: string[];
  joinedAt: string;
}
