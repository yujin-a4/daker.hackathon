import type {
  Hackathon,
  HackathonDetail,
  Leaderboard,
  Team,
  RankingUser,
  Submission,
  CurrentUser,
} from '@/types';

// ─── Hackathons ────────────────────────────────────────────
export const hackathons: Hackathon[] = [
  {
    slug: 'aimers-8-model-lite',
    title: 'Aimers 8기 : 모델 경량화 온라인 해커톤',
    status: 'ended',
    type: 'SW개발',
    tags: ['LLM', 'Compression', 'vLLM'],
    thumbnailUrl: '/placeholder-images/1.jpg', 
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-02-25T10:00:00+09:00',
      endAt: '2026-02-26T10:00:00+09:00',
    },
    participantCount: 312,
    prizeTotal: '500만원',
    links: {
      detail: '/hackathons/aimers-8-model-lite',
      rules: 'https://example.com/public/rules/aimers8',
      faq: 'https://example.com/public/faq/aimers8',
    },
  },
  {
    slug: 'monthly-vibe-coding-2026-02',
    title: '월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.02)',
    status: 'ongoing',
    type: '서비스기획',
    tags: ['Idea', 'GenAI', 'Workflow'],
    thumbnailUrl: '/placeholder-images/2.jpg',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-03-03T10:00:00+09:00',
      endAt: '2026-03-09T10:00:00+09:00',
    },
    participantCount: 205,
    prizeTotal: '100만원',
    links: {
      detail: '/hackathons/monthly-vibe-coding-2026-02',
      rules: 'https://example.com/public/rules/vibe202602',
      faq: 'https://example.com/public/faq/vibe202602',
    },
  },
  {
    slug: 'daker-handover-2026-03',
    title: '긴급 인수인계 해커톤: 명세서만 보고 구현하라',
    status: 'upcoming', 
    type: 'SW개발',
    tags: ['VibeCoding', 'Web', 'Vercel', 'Handover'],
    thumbnailUrl: '/placeholder-images/3.jpg',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-03-30T10:00:00+09:00',
      endAt: '2026-04-27T10:00:00+09:00',
    },
    participantCount: 358,
    prizeTotal: '100만원',
    links: {
      detail: '/hackathons/daker-handover-2026-03',
      rules: 'https://example.com/public/rules/daker-handover-202603',
      faq: 'https://example.com/public/faq/daker-handover-202603',
    },
  }
];

// ─── Hackathon Details (🔥 여기서 배열이 아니라 객체로 롤백!) ───
export const hackathonDetails: Record<string, HackathonDetail> = {
  'aimers-8-model-lite': {
    slug: 'aimers-8-model-lite',
    title: 'Aimers 8기 : 모델 경량화 온라인 해커톤',
    sections: {
      overview: {
        summary: '제한된 평가 환경에서 모델의 성능과 추론 속도를 함께 최적화합니다.',
        teamPolicy: { allowSolo: true, maxTeamSize: 5 },
      },
      info: {
        notice: [
          '제출 마감 이후 추가 제출은 불가합니다.',
          '평가 환경은 고정이며, 제출물은 별도 설치 없이 실행 가능해야 합니다.',
        ],
        links: { rules: 'https://example.com/public/rules/aimers8', faq: 'https://example.com/public/faq/aimers8' },
      },
      eval: {
        metricName: 'FinalScore',
        description: '성능과 속도를 종합한 점수(세부 산식은 규정 참고).',
        scoreSource: 'auto',
        limits: { maxRuntimeSec: 1200, maxSubmissionsPerDay: 5 },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '리더보드 제출 마감', at: '2026-02-25T10:00:00+09:00' },
          { name: '대회 종료', at: '2026-02-26T10:00:00+09:00' },
        ],
      },
      prize: {
        items: [
          { place: '1st', amountKRW: 3000000 },
          { place: '2nd', amountKRW: 1500000 },
          { place: '3rd', amountKRW: 800000 },
        ],
      },
      teams: { campEnabled: true, listUrl: '/camp?hackathon=aimers-8-model-lite' },
      submit: {
        allowedArtifactTypes: ['zip'],
        submissionUrl: '/hackathons/aimers-8-model-lite#submit',
        guide: [
          '제출물은 규정에 맞는 단일 zip 파일로 업로드합니다.',
          '업로드 후 제출 버튼을 눌러야 리더보드에 반영됩니다.',
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: '/hackathons/aimers-8-model-lite#leaderboard',
        note: 'Public 리더보드는 제출 마감 시점 기준으로 고정될 수 있습니다(규정 참고).',
      },
    },
  },
  'monthly-vibe-coding-2026-02': {
    slug: 'monthly-vibe-coding-2026-02',
    title: '월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.02)',
    sections: {
      overview: { summary: '바이브 코딩 경험 개선을 위한 아이디어 제안', teamPolicy: { allowSolo: true, maxTeamSize: 4 } },
      info: { notice: [], links: {} },
      eval: { metricName: '평가', description: '아이디어 평가', scoreSource: 'vote' },
      schedule: { timezone: 'Asia/Seoul', milestones: [] },
      teams: { campEnabled: true, listUrl: '/camp?hackathon=monthly-vibe-coding-2026-02' },
      submit: { allowedArtifactTypes: ['text'], guide: [] },
      leaderboard: { note: '투표 기반' }
    }
  },
  'daker-handover-2026-03': {
    slug: 'daker-handover-2026-03',
    title: '긴급 인수인계 해커톤: 명세서만 보고 구현하라',
    sections: {
      overview: {
        summary: '기능 명세서만 남기고 사라진 개발자의 문서를 기반으로 바이브 코딩을 통해 웹서비스를 구현·배포하는 해커톤입니다.',
        teamPolicy: { allowSolo: true, maxTeamSize: 5 },
      },
      info: {
        notice: [
          '예시 자료 외 데이터는 제공되지 않습니다.',
          '더미 데이터/로컬 저장소(localStorage 등)를 활용해 구현하세요.',
          '배포 URL은 외부에서 접속 가능해야하며 심사 기간동안 접근 가능해야합니다.',
          '외부 API/외부 DB를 쓰는 경우에도 심사자가 별도 키 없이 확인 가능해야 합니다.',
        ],
        links: {
          rules: 'https://example.com/public/rules/daker-handover-202603',
          faq: 'https://example.com/public/faq/daker-handover-202603',
        },
      },
      eval: {
        metricName: 'FinalScore',
        description: '참가팀/심사위원 투표 점수를 가중치로 합산한 최종 점수',
        scoreSource: 'vote',
        scoreDisplay: {
          label: '투표 점수',
          breakdown: [
            { key: 'participant', label: '참가자', weightPercent: 30 },
            { key: 'judge', label: '심사위원', weightPercent: 70 },
          ],
        },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '접수/기획서 제출 기간', at: '2026-03-04T10:00:00+09:00' },
          { name: '접수/기획서 제출 마감', at: '2026-03-30T10:00:00+09:00' },
          { name: '최종 웹링크 제출 마감', at: '2026-04-06T10:00:00+09:00' },
          { name: '최종 솔루션 PDF 제출 마감', at: '2026-04-13T10:00:00+09:00' },
          { name: '최종 결과 발표', at: '2026-04-27T10:00:00+09:00' },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: '/camp?hackathon=daker-handover-2026-03',
      },
      submit: {
        allowedArtifactTypes: ['text', 'url', 'pdf'],
        submissionUrl: '/hackathons/daker-handover-2026-03#submit',
        guide: [
          '기획서 → 웹링크 → PDF를 단계별로 제출합니다.',
          '배포 URL은 외부에서 접속 가능해야 합니다.',
        ],
        submissionItems: [
          { key: 'plan', title: '기획서(1차 제출)', format: 'text_or_url' },
          { key: 'web', title: '최종 웹링크 제출', format: 'url' },
          { key: 'pdf', title: '최종 솔루션 PDF 제출', format: 'pdf_url' },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: '/hackathons/daker-handover-2026-03#leaderboard',
        note: '아이디어 해커톤의 점수(score)는 투표 결과를 기반으로 표시됩니다.',
      },
    },
  }
};

// ─── Teams ─────────────────────────────────────────────────
export const teams: Team[] = [
  { teamCode: 'T-ALPHA', hackathonSlug: 'aimers-8-model-lite', name: 'Team Alpha', isOpen: true, memberCount: 3, maxTeamSize: 5, lookingFor: [{ position: 'Backend' }, { position: 'ML Engineer' }], intro: '추론 최적화/경량화 실험을 함께 진행할 팀원을 찾습니다.', contact: { type: 'link', url: 'https://open.kakao.com/o/example1' }, createdAt: '2026-02-20T11:00:00+09:00' },
  { teamCode: 'T-BETA', hackathonSlug: 'monthly-vibe-coding-2026-02', name: 'PromptRunners', isOpen: true, memberCount: 1, maxTeamSize: 4, lookingFor: [{ position: 'Frontend' }, { position: 'Designer' }], intro: '프롬프트 품질 점수화 + 개선 가이드 UX를 기획합니다.', contact: { type: 'link', url: 'https://forms.gle/example2' }, createdAt: '2026-02-18T18:30:00+09:00' },
  { teamCode: 'T-HANDOVER-01', hackathonSlug: 'daker-handover-2026-03', name: '404found', isOpen: true, memberCount: 3, maxTeamSize: 5, lookingFor: [{ position: 'Frontend' }, { position: 'Designer' }], intro: '명세서 기반으로 기본 기능을 빠르게 완성하고 UX 확장을 노립니다.', contact: { type: 'link', url: 'https://open.kakao.com/o/example3' }, createdAt: '2026-03-04T11:00:00+09:00' },
  { teamCode: 'T-HANDOVER-02', hackathonSlug: 'daker-handover-2026-03', name: 'LGTM', isOpen: false, memberCount: 5, maxTeamSize: 5, lookingFor: [], intro: '기획서-구현-문서화를 깔끔하게 맞추는 방향으로 진행합니다.', contact: { type: 'link', url: 'https://forms.gle/example4' }, createdAt: '2026-03-05T09:20:00+09:00' }
];

// ─── Leaderboards ──────────────────────────────────────────
export const leaderboards: Record<string, Leaderboard> = {
  'aimers-8-model-lite': { updatedAt: '2026-02-26T10:00:00+09:00', entries: [{ teamName: 'Team Alpha', score: 0.7421, rank: 1, submittedAt: '2026-02-24T21:05:00+09:00' }, { teamName: 'Team Gamma', score: 0.7013, rank: 2, submittedAt: '2026-02-25T09:40:00+09:00' }] },
  'daker-handover-2026-03': { updatedAt: '2026-04-17T10:00:00+09:00', entries: [{ teamName: '404found', score: 87.5, rank: 1, submittedAt: '2026-04-13T09:58:00+09:00', scoreBreakdown: { participant: 82, judge: 90 } }, { teamName: 'LGTM', score: 84.2, rank: 2, submittedAt: '2026-04-13T09:40:00+09:00', scoreBreakdown: { participant: 79, judge: 88 } }] }
};

// ─── Rankings ──────────────────────────────────────
export const rankings: RankingUser[] = [
  { rank: 1, nickname: '김다커', points: 0, basePoints: 520, hackathonsJoined: 8, winsCount: 3, lastActiveAt: '2026-03-20T10:00:00Z' },
  { rank: 2, nickname: '이모델', points: 0, basePoints: 490, hackathonsJoined: 7, winsCount: 3, lastActiveAt: '2026-03-20T08:00:00Z' },
];

// ─── Submissions ───────────────────────────────────
export const submissions: Submission[] = [];

// ─── Current User ──────────────────
export const currentUser: CurrentUser = {
  id: 'user-001-yujin',
  nickname: '강유진',
  email: 'yujin.kang@daker.ai',
  teamCodes: ['T-HANDOVER-01'],
  joinedAt: '2026-01-15T10:00:00Z',
  bookmarkedSlugs: ['daker-handover-2026-03', 'aimers-8-model-lite'],
  role: '프론트엔드 개발자',
  preferredTypes: ['VibeCoding', 'Web'],
  skills: ['React', 'Next.js', 'Tailwind CSS'],
};
