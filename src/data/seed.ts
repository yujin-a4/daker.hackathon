import type {
  Hackathon,
  HackathonDetail,
  Leaderboard,
  Team,
  RankingUser,
  Submission,
  CurrentUser,
  UserProfile,
} from '@/types';

// ─── Hackathons ────────────────────────────────────────────
export const hackathons: Hackathon[] = [
  // ─── Ongoing (진행중) ─────────────────────────────────────────
  {
    slug: 'daker-handover-2026-03',
    title: '긴급 인수인계 해커톤: 명세서만 보고 구현하라',
    status: 'ongoing',
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
  },
  {
    slug: 'gen-ai-startup-challenge',
    title: '제1회 생성형 AI 스타트업 챌린지',
    status: 'ongoing',
    type: '서비스기획',
    tags: ['GenAI', 'Startup', 'Business'],
    thumbnailUrl: '/placeholder-images/1.jpg',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-04-05T18:00:00+09:00',
      endAt: '2026-04-15T10:00:00+09:00',
    },
    participantCount: 245,
    prizeTotal: '1,000만원',
    links: {
      detail: '/hackathons/gen-ai-startup-challenge',
      rules: 'https://example.com/rules/genai',
      faq: 'https://example.com/faq/genai',
    },
  },
  {
    slug: 'cloud-native-modernization',
    title: '2026 클라우드 네이티브 현대화 대회',
    status: 'ongoing',
    type: 'SW개발',
    tags: ['Cloud', 'Kubernetes', 'Modernization'],
    thumbnailUrl: '/placeholder-images/2.jpg',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-04-15T10:00:00+09:00',
      endAt: '2026-05-02T10:00:00+09:00',
    },
    participantCount: 189,
    prizeTotal: '500만원',
    links: {
      detail: '/hackathons/cloud-native-modernization',
      rules: 'https://example.com/rules/cloud',
      faq: 'https://example.com/faq/cloud',
    },
  },

  // ─── Upcoming (예정) ──────────────────────────────────────────
  {
    slug: 'web3-defi-innovation',
    title: 'Web 3.0 디파이(DeFi) 혁신 챌린지',
    status: 'upcoming',
    type: 'SW개발',
    tags: ['Web3', 'Blockchain', 'DeFi'],
    thumbnailUrl: '/placeholder-images/4.jpg',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-05-01T10:00:00+09:00',
      endAt: '2026-05-10T10:00:00+09:00',
    },
    participantCount: 0,
    prizeTotal: '300만원',
    links: {
      detail: '/hackathons/web3-defi-innovation',
      rules: 'https://example.com/rules/web3',
      faq: 'https://example.com/faq/web3',
    },
  },
  {
    slug: 'smart-city-digital-twin',
    title: '지속 가능한 스마트시티 디지털 트윈 공모전',
    status: 'upcoming',
    type: '데이터분석',
    tags: ['DigitalTwin', 'SmartCity', 'IoT'],
    thumbnailUrl: '/placeholder-images/5.jpg',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-05-20T10:00:00+09:00',
      endAt: '2026-05-31T10:00:00+09:00',
    },
    participantCount: 0,
    prizeTotal: '700만원',
    links: {
      detail: '/hackathons/smart-city-digital-twin',
      rules: 'https://example.com/rules/smartcity',
      faq: 'https://example.com/faq/smartcity',
    },
  },
  {
    slug: 'global-ai-healthcare-2026',
    title: '2026 글로벌 AI 헬스케어 해커톤',
    status: 'upcoming',
    type: 'AI/Data',
    tags: ['Healthcare', 'AI', 'Global'],
    thumbnailUrl: '/placeholder-images/1.jpg',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-06-30T10:00:00+09:00',
      endAt: '2026-07-15T10:00:00+09:00',
    },
    participantCount: 0,
    prizeTotal: '2,000만원',
    links: {
      detail: '/hackathons/global-ai-healthcare-2026',
      rules: 'https://example.com/rules/healthcare',
      faq: 'https://example.com/faq/healthcare',
    },
  },

  // ─── Ended (종료) ──────────────────────────────────────────────
  {
    slug: 'metaverse-creator-camp',
    title: '메타버스 크리에이터스 아카데미 캠프',
    status: 'ended',
    type: '디자인',
    tags: ['Metaverse', '3D', 'Unity'],
    thumbnailUrl: '/placeholder-images/2.jpg',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-02-10T10:00:00+09:00',
      endAt: '2026-02-15T10:00:00+09:00',
    },
    participantCount: 227,
    prizeTotal: '100만원',
    links: {
      detail: '/hackathons/metaverse-creator-camp',
      rules: 'https://example.com/rules/metaverse',
      faq: 'https://example.com/faq/metaverse',
    },
  },
  {
    slug: 'aimers-8-model-lite',
    title: 'Aimers 8기 : 모델 경량화 온라인 해커톤',
    status: 'ended',
    type: 'SW개발',
    tags: ['LLM', 'Compression', 'vLLM'],
    thumbnailUrl: '/placeholder-images/3.jpg',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-02-25T10:00:00+09:00',
      endAt: '2026-03-10T10:00:00+09:00',
    },
    participantCount: 312,
    prizeTotal: '500만원',
    links: {
      detail: '/hackathons/aimers-8-model-lite',
      rules: 'https://example.com/rules/aimers8',
      faq: 'https://example.com/faq/aimers8',
    },
  },
  {
    slug: 'monthly-vibe-coding-2026-02',
    title: '월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.02)',
    status: 'ended',
    type: '서비스기획',
    tags: ['Idea', 'GenAI', 'Workflow'],
    thumbnailUrl: '/placeholder-images/4.jpg',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-02-20T10:00:00+09:00',
      endAt: '2026-02-28T10:00:00+09:00',
    },
    participantCount: 205,
    prizeTotal: '100만원',
    links: {
      detail: '/hackathons/monthly-vibe-coding-2026-02',
      rules: 'https://example.com/rules/vibecoding',
      faq: 'https://example.com/faq/vibecoding',
    },
  },
];

// ─── Hackathon Details ─────────────────────────────────────
export const hackathonDetails: HackathonDetail[] = [
  {
    slug: 'daker-handover-2026-03',
    title: '긴급 인수인계 해커톤: 명세서만 보고 구현하라',
    sections: {
      prize: { items: [{ place: '1등', amountKRW: 1000000 }] },
      overview: {
        summary: '기능 명세서만 남기고 사라진 개발자의 문서를 기반으로 바이브 코딩을 통해 웹서비스를 구현·배포하는 해커톤입니다.',
        teamPolicy: { allowSolo: true, maxTeamSize: 5 },
      },
      info: {
        notice: [
          '예시 자료 외 데이터는 제공되지 않습니다.',
          '더미 데이터/로컬 저장소(localStorage 등)를 활용해 구현하세요.',
          '배포 URL은 외부에서 접속 가능해야하며 심사 기간동안 접근 가능해야합니다.',
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
          { name: '최종 결과 발표', at: '2026-04-27T10:00:00+09:00' },
        ],
      },
      teams: { campEnabled: true, listUrl: '/camp?hackathon=daker-handover-2026-03' },
      submit: {
        allowedArtifactTypes: ['text', 'url', 'pdf'],
        submissionUrl: '/hackathons/daker-handover-2026-03#submit',
        guide: ['기획서 → 웹링크 → PDF를 단계별로 제출합니다.'],
        submissionItems: [
          { key: 'plan', title: '기획서(1차 제출)', format: 'text_or_url' },
          { key: 'web', title: '최종 웹링크 제출', format: 'url' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '/hackathons/daker-handover-2026-03#leaderboard', note: '투표 기반 점수' },
    },
  },
  {
    slug: 'gen-ai-startup-challenge',
    title: '제1회 생성형 AI 스타트업 챌린지',
    sections: {
      prize: { items: [{ place: '1등', amountKRW: 10000000 }] },
      overview: { summary: '생성형 AI를 활용한 혁신적인 비즈니스 모델을 제안하고 프로토타입을 개발합니다.', teamPolicy: { allowSolo: false, maxTeamSize: 4 } },
      info: { notice: ['법인 설립 3년 미만의 스타트업 또는 예비 창업팀만 참여 가능합니다.'], links: { rules: 'https://example.com/rules/genai', faq: 'https://example.com/faq/genai' } },
      eval: { metricName: '시장성/혁신성', description: '아이디어의 시장성과 솔루션의 완성도를 평가합니다.', scoreSource: 'vote' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '아이디어 접수', at: '2026-03-15T10:00:00+09:00' },
          { name: '서류 심사 결과 발표', at: '2026-03-28T10:00:00+09:00' },
          { name: '해커톤 본선(온라인)', at: '2026-04-05T10:00:00+09:00' },
          { name: '최종 데모데이', at: '2026-04-15T14:00:00+09:00' },
        ],
      },
      teams: { campEnabled: true, listUrl: '/camp?hackathon=gen-ai-startup-challenge' },
      submit: { allowedArtifactTypes: ['pdf', 'url'], submissionUrl: '/hackathons/gen-ai-startup-challenge#submit', guide: ['발표 자료(PDF)와 데모 영상 링크를 제출하세요.'] },
      leaderboard: { publicLeaderboardUrl: '/hackathons/gen-ai-startup-challenge#leaderboard', note: '심사위원 평가 점수' },
    },
  },
  {
    slug: 'cloud-native-modernization',
    title: '2026 클라우드 네이티브 현대화 대회',
    sections: {
      prize: { items: [{ place: '1등', amountKRW: 5000000 }] },
      overview: { summary: '레거시 시스템을 클라우드 네이티브 환경으로 전환하고 성능을 최적화하는 미션입니다.', teamPolicy: { allowSolo: true, maxTeamSize: 3 } },
      info: { notice: ['평가 환경은 AWS 상에서 진행됩니다.'], links: { rules: 'https://example.com/rules/cloud', faq: 'https://example.com/faq/cloud' } },
      eval: { metricName: '가용성/성능/비용', description: '자동화된 성능 측정 도구를 통해 실시간으로 평가됩니다.', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '대회 시작', at: '2026-03-25T10:00:00+09:00' },
          { name: '1차 평가 리더보드 오픈', at: '2026-04-01T10:00:00+09:00' },
          { name: '최종 코드 제출 마감', at: '2026-04-15T10:00:00+09:00' },
          { name: '시상식', at: '2026-05-02T16:00:00+09:00' },
        ],
      },
      teams: { campEnabled: true, listUrl: '/camp?hackathon=cloud-native-modernization' },
      submit: { allowedArtifactTypes: ['zip'], submissionUrl: '/hackathons/cloud-native-modernization#submit', guide: ['Dockerfile과 IaC 스크립트를 포함한 zip 파일을 제출하세요.'] },
      leaderboard: { publicLeaderboardUrl: '/hackathons/cloud-native-modernization#leaderboard', note: '자동 측정 점수' },
    },
  },
  {
    slug: 'web3-defi-innovation',
    title: 'Web 3.0 디파이(DeFi) 혁신 챌린지',
    sections: {
      prize: { items: [{ place: '1등', amountKRW: 3000000 }] },
      overview: { summary: '탈중앙화 금융(DeFi) 시스템의 접근성을 높이고 보안을 강화하는 새로운 프로토콜을 제안합니다.', teamPolicy: { allowSolo: true, maxTeamSize: 4 } },
      info: { notice: ['스마트 컨트랙트 오딧 결과가 포함되면 가산점이 부여됩니다.'], links: { rules: 'https://example.com/rules/web3', faq: 'https://example.com/faq/web3' } },
      eval: { metricName: '보안성/창의성', description: '코드의 안정성과 아이디어의 차별성을 중점적으로 봅니다.', scoreSource: 'vote' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '참가 신청 마감', at: '2026-04-10T10:00:00+09:00' },
          { name: '개발 기간', at: '2026-04-10T~2026-05-01T' },
          { name: '최종 제출', at: '2026-05-01T10:00:00+09:00' },
        ],
      },
      teams: { campEnabled: true, listUrl: '/camp?hackathon=web3-defi-innovation' },
      submit: { allowedArtifactTypes: ['url'], submissionUrl: '/hackathons/web3-defi-innovation#submit', guide: ['GitHub 리포지토리 주소를 제출하세요.'] },
      leaderboard: { publicLeaderboardUrl: '/hackathons/web3-defi-innovation#leaderboard', note: '진행 예정' },
    },
  },
  {
    slug: 'smart-city-digital-twin',
    title: '지속 가능한 스마트시티 디지털 트윈 공모전',
    sections: {
      prize: { items: [{ place: '대상', amountKRW: 7000000 }] },
      overview: { summary: '도시 데이터를 활용하여 에너지 효율 또는 교통 혼잡 문제를 해결하는 디지털 트윈 모델을 구축합니다.', teamPolicy: { allowSolo: true, maxTeamSize: 5 } },
      info: { notice: ['공공 데이터 포털의 데이터를 필수적으로 활용해야 합니다.'], links: { rules: 'https://example.com/rules/smartcity', faq: 'https://example.com/faq/smartcity' } },
      eval: { metricName: '분석 정확도', description: '시뮬레이션 결과의 정확도와 실질적인 문제 해결 기여도를 평가합니다.', scoreSource: 'vote' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '사전 교육', at: '2026-05-01T14:00:00+09:00' },
          { name: '데이터 분석 기간', at: '2026-05-01T~2026-05-20T' },
          { name: '결과 리포트 제출', at: '2026-05-20T10:00:00+09:00' },
        ],
      },
      teams: { campEnabled: true, listUrl: '/camp?hackathon=smart-city-digital-twin' },
      submit: { allowedArtifactTypes: ['pdf', 'zip'], submissionUrl: '/hackathons/smart-city-digital-twin#submit', guide: ['분석 리포트와 모델 소스코드를 제출하세요.'] },
      leaderboard: { publicLeaderboardUrl: '/hackathons/smart-city-digital-twin#leaderboard', note: '진행 예정' },
    },
  },
  {
    slug: 'global-ai-healthcare-2026',
    title: '2026 글로벌 AI 헬스케어 해커톤',
    sections: {
      prize: { items: [{ place: 'Top 1', amountKRW: 20000000 }] },
      overview: { summary: '전 세계 의료 접근성 불균형 문제를 해결하기 위한 AI 진단 및 케어 솔루션을 개발합니다.', teamPolicy: { allowSolo: false, maxTeamSize: 6 } },
      info: { notice: ['글로벌 대회로 모든 제출물은 영어로 작성되어야 합니다.'], links: { rules: 'https://example.com/rules/healthcare', faq: 'https://example.com/faq/healthcare' } },
      eval: { metricName: '사회적 영향력', description: '솔루션의 사회적 기여도와 확장 가능성을 중점적으로 봅니다.', scoreSource: 'vote' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '글로벌 모집 시작', at: '2026-05-15T10:00:00+09:00' },
          { name: '온라인 예선', at: '2026-06-30T10:00:00+09:00' },
          { name: '글로벌 본선(현장)', at: '2026-07-15T10:00:00+09:00' },
        ],
      },
      teams: { campEnabled: true, listUrl: '/camp?hackathon=global-ai-healthcare-2026' },
      submit: { allowedArtifactTypes: ['pdf', 'url'], submissionUrl: '/hackathons/global-ai-healthcare-2026#submit', guide: ['Solution Paper와 데모 사이트 링크를 제출하세요.'] },
      leaderboard: { publicLeaderboardUrl: '/hackathons/global-ai-healthcare-2026#leaderboard', note: '진행 예정' },
    },
  },
  {
    slug: 'metaverse-creator-camp',
    title: '메타버스 크리에이터스 아카데미 캠프',
    sections: {
      prize: { items: [{ place: '최우수', amountKRW: 1000000 }] },
      overview: { summary: '3D 모델링과 게임 엔진을 활용하여 독창적인 메타버스 공간을 창조합니다.', teamPolicy: { allowSolo: true, maxTeamSize: 3 } },
      info: { notice: ['대회는 성황리에 종료되었습니다.'], links: { rules: 'https://example.com/rules/metaverse', faq: 'https://example.com/faq/metaverse' } },
      eval: { metricName: '디자인 완성도', description: '심미적 완성도와 사용자 경험을 평가했습니다.', scoreSource: 'vote' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '캠프 시작', at: '2026-01-10T10:00:00+09:00' },
          { name: '작품 제출 마감', at: '2026-02-10T10:00:00+09:00' },
          { name: '시상 및 전시', at: '2026-02-15T14:00:00+09:00' },
        ],
      },
      teams: { campEnabled: true, listUrl: '/camp?hackathon=metaverse-creator-camp' },
      submit: { allowedArtifactTypes: ['zip'], submissionUrl: '/hackathons/metaverse-creator-camp#submit', guide: ['제출이 마감되었습니다.'] },
      leaderboard: { publicLeaderboardUrl: '/hackathons/metaverse-creator-camp#leaderboard', note: '최종 순위 발표 완료' },
    },
  },
  {
    slug: 'aimers-8-model-lite',
    title: 'Aimers 8기 : 모델 경량화 온라인 해커톤',
    sections: {
      prize: { items: [{ place: '1st', amountKRW: 3000000 }, { place: '2nd', amountKRW: 1500000 }, { place: '3rd', amountKRW: 800000 }] },
      overview: { summary: '제한된 평가 환경에서 모델의 성능과 추론 속도를 함께 최적화합니다.', teamPolicy: { allowSolo: true, maxTeamSize: 5 } },
      info: { notice: ['대회가 종료되었습니다. 수상자분들은 개별 연락을 확인해주세요.'], links: { rules: 'https://example.com/rules/aimers8', faq: 'https://example.com/faq/aimers8' } },
      eval: { metricName: 'FinalScore', description: '성능과 속도를 종합한 점수입니다.', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '리더보드 제출 마감', at: '2026-02-25T10:00:00+09:00' },
          { name: '대회 종료', at: '2026-03-10T10:00:00+09:00' },
        ],
      },
      teams: { campEnabled: true, listUrl: '/camp?hackathon=aimers-8-model-lite' },
      submit: { allowedArtifactTypes: ['zip'], submissionUrl: '/hackathons/aimers-8-model-lite#submit', guide: ['제출이 마감되었습니다.'] },
      leaderboard: { publicLeaderboardUrl: '/hackathons/aimers-8-model-lite#leaderboard', note: '최종 순위 발표 완료' },
    },
  },
  {
    slug: 'monthly-vibe-coding-2026-02',
    title: '월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.02)',
    sections: {
      prize: { items: [{ place: '아이디어상', amountKRW: 100000 }] },
      overview: { summary: '바이브 코딩 경험 개선을 위한 창의적인 아이디어를 제안합니다.', teamPolicy: { allowSolo: true, maxTeamSize: 4 } },
      info: { notice: ['참여해주신 모든 분들께 감사드립니다.'], links: { rules: 'https://example.com/rules/vibecoding', faq: 'https://example.com/faq/vibecoding' } },
      eval: { metricName: '실무 활용도', description: '실제 개발 환경에 적용 가능한지를 평가했습니다.', scoreSource: 'vote' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '아이디어 접수', at: '2026-01-25T10:00:00+09:00' },
          { name: '투표 마감', at: '2026-02-20T10:00:00+09:00' },
          { name: '결과 발표', at: '2026-02-28T10:00:00+09:00' },
        ],
      },
      teams: { campEnabled: true, listUrl: '/camp?hackathon=monthly-vibe-coding-2026-02' },
      submit: { allowedArtifactTypes: ['text'], submissionUrl: '/hackathons/monthly-vibe-coding-2026-02#submit', guide: ['제출이 마감되었습니다.'] },
      leaderboard: { publicLeaderboardUrl: '/hackathons/monthly-vibe-coding-2026-02#leaderboard', note: '투표 결과 발표 완료' },
    },
  },
];

// ─── Teams ─────────────────────────────────────────────────
export const teams: Team[] = [
  {
    teamCode: 'T-ALPHA',
    hackathonSlug: 'aimers-8-model-lite',
    name: 'Team Alpha',
    isOpen: true,
    leaderId: 'user-002-model',
    memberCount: 3,
    maxTeamSize: 5,
    lookingFor: [{ position: 'ML Engineer', description: '경량화 유경험자' }],
    intro: '추론 최적화/경량화 실험을 함께 진행할 팀원을 찾습니다.',
    contact: { type: 'link', url: 'https://open.kakao.com/o/example1' },
    createdAt: '2026-02-20T11:00:00+09:00',
    progressStatus: 'developing',
    progressPercent: 65,
  },
  {
    teamCode: 'T-HANDOVER-01',
    hackathonSlug: 'daker-handover-2026-03',
    name: '404found',
    isOpen: true,
    leaderId: 'user-001-yujin', // 강유진이 리더임
    memberCount: 3,
    maxTeamSize: 5,
    lookingFor: [{ position: 'Frontend', description: '' }, { position: 'Designer', description: '' }],
    intro: '명세서 기반으로 기본 기능을 빠르게 완성하고 UX 확장을 노립니다.',
    contact: { type: 'link', url: 'https://open.kakao.com/o/example3' },
    createdAt: '2026-03-04T11:00:00+09:00',
    progressStatus: 'designing',
    progressPercent: 40,
  },
  {
    teamCode: 'T-VIBE-01',
    hackathonSlug: 'monthly-vibe-coding-2026-02',
    name: 'Vibe Enhancers',
    isOpen: false,
    leaderId: 'user-001-yujin',
    memberCount: 4,
    maxTeamSize: 4,
    lookingFor: [],
    intro: '바이브 코딩을 위한 최고의 팀이었습니다.',
    contact: { type: 'link', url: 'https://open.kakao.com/o/example99' },
    createdAt: '2026-01-20T11:00:00+09:00',
    progressStatus: 'completed',
    progressPercent: 100,
  },
  // --- daker-handover-2026-03 (20+ teams) ---
  ...Array.from({ length: 20 }).map((_, i) => ({
    teamCode: `T-HANDOVER-AUTO-${i + 2}`,
    hackathonSlug: 'daker-handover-2026-03',
    name: `Team Handover #${i + 2}`,
    isOpen: i % 5 !== 0,
    leaderId: `user-gen-${i}`,
    memberCount: (i % 3) + 1,
    maxTeamSize: 5,
    lookingFor: [
      { position: i % 2 === 0 ? 'Frontend' : 'Backend', description: '빠른 구현 선호' }
    ],
    intro: `우승을 목표로 하는 ${i + 2}번 팀입니다. 함께 가실 분!`,
    contact: { type: 'link', url: '#' },
    createdAt: new Date(2026, 2, 5 + i).toISOString(),
    progressStatus: (i % 4 === 0 ? 'planning' : i % 4 === 1 ? 'designing' : i % 4 === 2 ? 'developing' : 'completed') as 'planning' | 'designing' | 'developing' | 'completed',
    progressPercent: i % 4 === 0 ? 15 : i % 4 === 1 ? 40 : i % 4 === 2 ? 75 : 100,
  })),
  // --- gen-ai-startup-challenge (10+ teams) ---
  ...Array.from({ length: 12 }).map((_, i) => ({
    teamCode: `T-GENAI-AUTO-${i + 2}`,
    hackathonSlug: 'gen-ai-startup-challenge',
    name: `GenAI Innovators #${i + 2}`,
    isOpen: true,
    leaderId: `user-gen-ai-${i}`,
    memberCount: (i % 2) + 1,
    maxTeamSize: 4,
    lookingFor: [
      { position: i % 3 === 0 ? 'Planner' : 'Designer', description: '창의적 인재 모집' }
    ],
    intro: `새로운 AI 시대를 열어갈 ${i + 2}번 팀입니다.`,
    contact: { type: 'link', url: '#' },
    createdAt: new Date(2026, 2, 21 + i).toISOString(),
    progressStatus: (i % 2 === 0 ? 'planning' : 'developing') as 'planning' | 'designing' | 'developing' | 'completed',
    progressPercent: i % 2 === 0 ? 25 : 60,
  })),
  // --- cloud-native-modernization (5+ teams) ---
  ...Array.from({ length: 8 }).map((_, i) => ({
    teamCode: `T-CLOUD-AUTO-${i + 2}`,
    hackathonSlug: 'cloud-native-modernization',
    name: `Cloud Cloud #${i + 2}`,
    isOpen: true,
    leaderId: `user-gen-cloud-${i}`,
    memberCount: (i % 2) + 1,
    maxTeamSize: 3,
    lookingFor: [
      { position: 'Backend', description: 'K8S/Cloud 전문가' }
    ],
    intro: `도전적인 클라우드 여정에 함께할 ${i + 2}번 팀입니다.`,
    contact: { type: 'link', url: '#' },
    createdAt: new Date(2026, 2, 26 + i).toISOString(),
    progressStatus: 'completed' as 'planning' | 'designing' | 'developing' | 'completed',
    progressPercent: 100,
  })),
];

// ─── AI Matching User Pool ─────────────────────────────────
export const users: UserProfile[] = [
  { id: 'user-101', nickname: '김프론트', email: 'front@example.com', teamCodes: [], joinedAt: '2026-01-01T00:00:00Z', role: 'Frontend', skills: ['React', 'Next.js', 'TypeScript'], preferredTypes: ['Web'] },
  { id: 'user-102', nickname: '이백엔드', email: 'back@example.com', teamCodes: [], joinedAt: '2026-01-02T00:00:00Z', role: 'Backend', skills: ['Node.js', 'NestJS', 'PostgreSQL'], preferredTypes: ['Web', 'API'] },
  { id: 'user-103', nickname: '박디자인', email: 'design@example.com', teamCodes: [], joinedAt: '2026-01-03T00:00:00Z', role: 'Designer', skills: ['Figma', 'UI/UX', 'Prototyping'], preferredTypes: ['VibeCoding', 'Design'] },
  { id: 'user-104', nickname: '최기획', email: 'pm@example.com', teamCodes: [], joinedAt: '2026-01-04T00:00:00Z', role: 'Planner', skills: ['Business Model', 'Notion', 'Wireframing'], preferredTypes: ['Startup', 'Idea'] },
  { id: 'user-105', nickname: '정머신', email: 'ml@example.com', teamCodes: [], joinedAt: '2026-01-05T00:00:00Z', role: 'ML Engineer', skills: ['PyTorch', 'Python', 'vLLM'], preferredTypes: ['AI/Data', 'GenAI'] },
  { id: 'user-106', nickname: '오데이터', email: 'data@example.com', teamCodes: [], joinedAt: '2026-01-06T00:00:00Z', role: 'Data Scientist', skills: ['Pandas', 'SQL', 'Tableau'], preferredTypes: ['데이터분석'] },
  { id: 'user-107', nickname: '윤풀스택', email: 'full@example.com', teamCodes: [], joinedAt: '2026-01-07T00:00:00Z', role: 'Frontend', skills: ['Vue.js', 'React', 'Firebase'], preferredTypes: ['VibeCoding'] },
  { id: 'user-108', nickname: '장디바', email: 'ui@example.com', teamCodes: [], joinedAt: '2026-01-08T00:00:00Z', role: 'Designer', skills: ['Framer', 'Figma', 'CSS'], preferredTypes: ['Web'] },
  { id: 'user-109', nickname: '한사업', email: 'biz@example.com', teamCodes: [], joinedAt: '2026-01-09T00:00:00Z', role: 'Planner', skills: ['Pitching', 'Strategy'], preferredTypes: ['Startup'] },
  { id: 'user-110', nickname: '강클라', email: 'cloud@example.com', teamCodes: [], joinedAt: '2026-01-10T00:00:00Z', role: 'Backend', skills: ['AWS', 'Kubernetes', 'Go'], preferredTypes: ['Cloud'] },
];

// ─── Leaderboards ──────────────────────────────────────────
export const leaderboards: Record<string, Leaderboard> = {
  'daker-handover-2026-03': {
    updatedAt: '2026-03-28T12:00:00+09:00',
    entries: [
      { teamName: '404found', score: 87.5, rank: 1, submittedAt: '2026-03-25T09:58:00+09:00', scoreBreakdown: { participant: 82, judge: 90 } },
      { teamName: 'LGTM', score: 84.2, rank: 2, submittedAt: '2026-03-24T09:40:00+09:00', scoreBreakdown: { participant: 79, judge: 88 } },
    ],
  },
  'aimers-8-model-lite': {
    updatedAt: '2026-03-10T10:00:00+09:00',
    entries: [
      { teamName: 'Team Alpha', score: 0.7421, rank: 1, submittedAt: '2026-02-24T21:05:00+09:00' },
      { teamName: 'Team Gamma', score: 0.7013, rank: 2, submittedAt: '2026-02-25T09:40:00+09:00' },
    ],
  },
};

// ─── Rankings (유지) ──────────────────────────────────────
export const rankings: RankingUser[] = [
  { rank: 1, nickname: '김다커', points: 0, basePoints: 1250, hackathonsJoined: 15, winsCount: 5, lastActiveAt: '2026-03-25T10:00:00Z' },
  { rank: 2, nickname: '이모델', points: 0, basePoints: 1120, hackathonsJoined: 12, winsCount: 4, lastActiveAt: '2026-03-26T08:00:00Z' },
  { rank: 3, nickname: '송딥러닝', points: 0, basePoints: 1050, hackathonsJoined: 10, winsCount: 3, lastActiveAt: '2026-03-27T09:00:00Z' },
  { rank: 4, nickname: '박클라우드', points: 0, basePoints: 980, hackathonsJoined: 8, winsCount: 2, lastActiveAt: '2026-03-24T15:00:00Z' },
  { rank: 5, nickname: '최프롬프트', points: 0, basePoints: 920, hackathonsJoined: 9, winsCount: 1, lastActiveAt: '2026-03-23T11:00:00Z' },
  { rank: 6, nickname: '정코딩', points: 0, basePoints: 880, hackathonsJoined: 7, winsCount: 2, lastActiveAt: '2026-03-22T14:30:00Z' },
  { rank: 7, nickname: '한웹삼', points: 0, basePoints: 850, hackathonsJoined: 11, winsCount: 0, lastActiveAt: '2026-03-21T09:15:00Z' },
  { rank: 8, nickname: '강벡터', points: 0, basePoints: 810, hackathonsJoined: 6, winsCount: 2, lastActiveAt: '2026-03-15T18:00:00Z' },
  { rank: 9, nickname: '윤디자인', points: 0, basePoints: 790, hackathonsJoined: 8, winsCount: 1, lastActiveAt: '2026-03-20T10:45:00Z' },
  { rank: 10, nickname: '조데브', points: 0, basePoints: 760, hackathonsJoined: 5, winsCount: 2, lastActiveAt: '2026-03-19T13:20:00Z' },
  { rank: 11, nickname: '임기획', points: 0, basePoints: 730, hackathonsJoined: 7, winsCount: 1, lastActiveAt: '2026-03-18T16:50:00Z' },
  { rank: 12, nickname: '오백엔드', points: 0, basePoints: 710, hackathonsJoined: 9, winsCount: 0, lastActiveAt: '2026-03-17T08:40:00Z' },
  { rank: 13, nickname: '서프런트', points: 0, basePoints: 680, hackathonsJoined: 6, winsCount: 1, lastActiveAt: '2026-03-16T11:10:00Z' },
  { rank: 14, nickname: '권데이터', points: 0, basePoints: 650, hackathonsJoined: 4, winsCount: 2, lastActiveAt: '2026-03-14T19:30:00Z' },
  { rank: 15, nickname: '황보듬', points: 0, basePoints: 620, hackathonsJoined: 8, winsCount: 0, lastActiveAt: '2026-03-13T10:00:00Z' },
  { rank: 16, nickname: '안쿠베', points: 0, basePoints: 600, hackathonsJoined: 5, winsCount: 1, lastActiveAt: '2026-03-12T14:20:00Z' },
  { rank: 17, nickname: '송머신', points: 0, basePoints: 580, hackathonsJoined: 7, winsCount: 0, lastActiveAt: '2026-03-11T16:45:00Z' },
  { rank: 18, nickname: '전인프라', points: 0, basePoints: 560, hackathonsJoined: 6, winsCount: 0, lastActiveAt: '2026-03-10T09:30:00Z' },
  { rank: 19, nickname: '홍애자일', points: 0, basePoints: 540, hackathonsJoined: 4, winsCount: 1, lastActiveAt: '2026-03-09T13:15:00Z' },
  { rank: 20, nickname: '배도커', points: 0, basePoints: 520, hackathonsJoined: 5, winsCount: 0, lastActiveAt: '2026-03-08T11:50:00Z' },
  { rank: 21, nickname: '유서버', points: 0, basePoints: 500, hackathonsJoined: 3, winsCount: 1, lastActiveAt: '2026-03-07T15:40:00Z' },
  { rank: 22, nickname: '남디비', points: 0, basePoints: 480, hackathonsJoined: 6, winsCount: 0, lastActiveAt: '2026-03-06T10:20:00Z' },
  { rank: 23, nickname: '신시큐어', points: 0, basePoints: 460, hackathonsJoined: 4, winsCount: 0, lastActiveAt: '2026-03-05T08:55:00Z' },
  { rank: 24, nickname: '심블록', points: 0, basePoints: 440, hackathonsJoined: 5, winsCount: 0, lastActiveAt: '2026-03-04T12:30:00Z' },
  { rank: 25, nickname: '곽체인', points: 0, basePoints: 420, hackathonsJoined: 3, winsCount: 0, lastActiveAt: '2026-03-03T16:10:00Z' },
  { rank: 26, nickname: '성AI', points: 0, basePoints: 400, hackathonsJoined: 4, winsCount: 0, lastActiveAt: '2026-03-02T09:45:00Z' },
  { rank: 27, nickname: '차GPT', points: 0, basePoints: 380, hackathonsJoined: 2, winsCount: 1, lastActiveAt: '2026-03-01T14:25:00Z' },
  { rank: 28, nickname: '주클린', points: 0, basePoints: 360, hackathonsJoined: 5, winsCount: 0, lastActiveAt: '2026-02-28T10:05:00Z' },
  { rank: 29, nickname: '민아키', points: 0, basePoints: 340, hackathonsJoined: 3, winsCount: 0, lastActiveAt: '2026-02-27T11:55:00Z' },
  { rank: 30, nickname: '우솔리', points: 0, basePoints: 320, hackathonsJoined: 4, winsCount: 0, lastActiveAt: '2026-02-26T15:30:00Z' },
  { rank: 31, nickname: '지러스', points: 0, basePoints: 300, hackathonsJoined: 2, winsCount: 0, lastActiveAt: '2026-02-25T08:45:00Z' },
  { rank: 32, nickname: '엄파이썬', points: 0, basePoints: 280, hackathonsJoined: 3, winsCount: 0, lastActiveAt: '2026-02-24T12:15:00Z' },
  { rank: 33, nickname: '변자바', points: 0, basePoints: 260, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-23T14:40:00Z' },
  { rank: 34, nickname: '탁고', points: 0, basePoints: 240, hackathonsJoined: 4, winsCount: 0, lastActiveAt: '2026-02-22T09:20:00Z' },
  { rank: 35, nickname: '노시플', points: 0, basePoints: 220, hackathonsJoined: 2, winsCount: 0, lastActiveAt: '2026-02-21T11:35:00Z' },
  { rank: 36, nickname: '마리액트', points: 0, basePoints: 200, hackathonsJoined: 3, winsCount: 0, lastActiveAt: '2026-02-20T16:05:00Z' },
  { rank: 37, nickname: '나뷰', points: 0, basePoints: 180, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-19T08:10:00Z' },
  { rank: 38, nickname: '피넥스트', points: 0, basePoints: 160, hackathonsJoined: 2, winsCount: 0, lastActiveAt: '2026-02-18T10:50:00Z' },
  { rank: 39, nickname: '라네스트', points: 0, basePoints: 140, hackathonsJoined: 3, winsCount: 0, lastActiveAt: '2026-02-17T13:25:00Z' },
  { rank: 40, nickname: '도스프링', points: 0, basePoints: 120, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-16T15:55:00Z' },
  { rank: 41, nickname: '길장고', points: 0, basePoints: 100, hackathonsJoined: 2, winsCount: 0, lastActiveAt: '2026-02-15T09:30:00Z' },
  { rank: 42, nickname: '석플러터', points: 0, basePoints: 80, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-14T11:15:00Z' },
  { rank: 43, nickname: '설코틀린', points: 0, basePoints: 60, hackathonsJoined: 3, winsCount: 0, lastActiveAt: '2026-02-13T14:45:00Z' },
  { rank: 44, nickname: '어스위프트', points: 0, basePoints: 50, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-12T16:30:00Z' },
  { rank: 45, nickname: '여스크립트', points: 0, basePoints: 40, hackathonsJoined: 2, winsCount: 0, lastActiveAt: '2026-02-11T08:50:00Z' },
  { rank: 46, nickname: '연타입', points: 0, basePoints: 30, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-10T10:20:00Z' },
  { rank: 47, nickname: '진쿼리', points: 0, basePoints: 20, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-09T13:40:00Z' },
  { rank: 48, nickname: '팽루비', points: 0, basePoints: 15, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-08T15:10:00Z' },
  { rank: 49, nickname: '추레일즈', points: 0, basePoints: 10, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-07T09:55:00Z' },
  { rank: 50, nickname: '견익스', points: 0, basePoints: 5, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-06T11:25:00Z' },
  { rank: 51, nickname: '당고', points: 0, basePoints: 3, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-05T14:35:00Z' },
  { rank: 52, nickname: '동펄', points: 0, basePoints: 2, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-04T08:15:00Z' },
  { rank: 53, nickname: '마탈', points: 0, basePoints: 1, hackathonsJoined: 1, winsCount: 0, lastActiveAt: '2026-02-03T10:45:00Z' },
];

export const submissions: Submission[] = [
  {
    id: 'sub-001',
    hackathonSlug: 'aimers-8-model-lite',
    teamCode: 'T-ALPHA',
    teamName: 'Team Alpha',
    status: 'submitted',
    artifacts: [
      { type: 'pdf', fileName: 'model-optimization-report.pdf', uploadedAt: '2026-02-24T21:05:00+09:00' },
      { type: 'url', content: 'https://github.com/daker-alpha/model-lite', uploadedAt: '2026-02-24T21:05:00+09:00' }
    ],
    notes: '모델 경량화 최종 제출물입니다.',
    submittedAt: '2026-02-24T21:05:00+09:00',
  },
  {
    id: 'sub-002',
    hackathonSlug: 'monthly-vibe-coding-2026-02',
    teamCode: 'T-VIBE-01', // Dummy team code for past event
    teamName: 'Vibe Enhancers',
    status: 'submitted',
    artifacts: [
      { type: 'text', content: '바이브 코딩 경험 개선을 위한 IDE 플러그인 제안서', uploadedAt: '2026-02-20T10:00:00+09:00' },
      { type: 'url', content: 'https://example.com/vibe-enhancers-demo', uploadedAt: '2026-02-20T10:00:00+09:00' }
    ],
    notes: '오직 기획에만 집중했습니다.',
    submittedAt: '2026-02-20T10:00:00+09:00',
  }
];

// ─── Current User ──────────────────
export const currentUser: CurrentUser = {
  id: 'user-001-yujin',
  nickname: '강유진',
  email: 'yujin.kang@daker.ai',
  teamCodes: ['T-HANDOVER-01', 'T-ALPHA', 'T-VIBE-01'],
  joinedAt: '2026-01-15T10:00:00Z',
  bookmarkedSlugs: ['daker-handover-2026-03', 'gen-ai-startup-challenge'],
  role: '프론트엔드 개발자',
  preferredTypes: ['VibeCoding', 'Web'],
  skills: ['React', 'Next.js', 'Tailwind CSS'],
};
