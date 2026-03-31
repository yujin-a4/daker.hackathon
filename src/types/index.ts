export interface Hackathon {
  slug: string;
  title: string;
  status: 'ongoing' | 'upcoming' | 'ended';
  type: string;
  tags: string[];
  thumbnailUrl: string;
  period: {
    timezone: string;
    submissionDeadlineAt: string;
    endAt: string;
  };
  participantCount: number;
  prizeTotal: string;
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
      scoreSource?: 'vote' | 'auto';
      limits?: { maxRuntimeSec?: number; maxSubmissionsPerDay?: number };
      scoreDisplay?: {
        label: string;
        breakdown: { key: string; label: string; weightPercent: number }[];
      };
    };
    schedule: {
      timezone: string;
      milestones: { 
        name: string; 
        at: string; 
        type?: 'submission' | 'voting' | 'judging' | 'result';
        itemKey?: string; // Links to submission.artifacts.key
        step?: number; // 1, 2, 3...
        votingEnabled?: boolean;
        judgingEnabled?: boolean;
        galleryEnabled?: boolean;
      }[];
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
      submissionItems?: { key: string; title: string; format: string; deadline?: string }[];
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
  votes?: number; // Real-time user votes during voting phase
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
  isSolo?: boolean; // 개인 참가 여부 — true이면 팀 찾기 목록에 노출 안 됨
  leaderId: string; // 팀장을 식별하는 ID
  memberCount: number;
  maxTeamSize: number;
  lookingFor: { position: string; description: string }[];
  intro: string;
  contact: { type: string; url: string };
  createdAt: string;
  progressStatus?: 'planning' | 'designing' | 'developing' | 'completed';
  progressPercent?: number;
  checklist?: string[]; // 체크된 항목들의 인덱스나 ID 저장
}

export interface RankingUser {
  id?: string;
  rank: number;
  nickname: string;
  points: number;
  basePoints: number;
  hackathonsJoined: number;
  winsCount: number;
  lastActiveAt: string;
}

export interface Submission {
  id: string;
  hackathonSlug: string;
  teamCode: string;
  teamName: string;
  status: 'draft' | 'submitted';
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

export interface PointLog {
  id: string;
  description: string;
  points: number;
  date: string;
}

export interface CurrentUser {
  id: string;
  nickname: string;
  email: string;
  teamCodes: string[];
  joinedAt: string;
  bookmarkedSlugs?: string[];
  role?: string;
  preferredTypes?: string[];
  skills?: string[];
  pointHistory?: PointLog[];
}

export interface UserProfile extends CurrentUser {}
