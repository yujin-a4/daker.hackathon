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

// ─── Hackathons (18 items) ──────────────────────────────────
export const hackathons: Hackathon[] = [
  // --- ONGOING (6) ---
  {
    slug: 'gen-ai-startup-challenge',
    title: '제1회 생성형 AI 스타트업 챌린지',
    status: 'ongoing',
    type: '서비스기획',
    tags: ['GenAI', 'Startup', 'Business'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-04-05T18:00:00+09:00', endAt: '2026-04-28T10:00:00+09:00' },
    participantCount: 245,
    prizeTotal: '1,000만원',
    links: { detail: '/hackathons/gen-ai-startup-challenge', rules: '#', faq: '#' },
  },
  {
    slug: 'cloud-native-modernization',
    title: '2026 클라우드 네이티브 현대화 대회',
    status: 'ongoing',
    type: 'SW개발',
    tags: ['Cloud', 'Kubernetes', 'Modernization'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-04-15T10:00:00+09:00', endAt: '2026-05-02T10:00:00+09:00' },
    participantCount: 189,
    prizeTotal: '500만원',
    links: { detail: '/hackathons/cloud-native-modernization', rules: '#', faq: '#' },
  },
  {
    slug: 'daker-handover-2026-03',
    title: '제1회 닥커 긴급 인수인계 해커톤',
    status: 'ongoing',
    type: 'SW개발',
    tags: ['VibeCoding', 'Web', 'Vercel', 'Handover'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-03-30T10:00:00+09:00', endAt: '2026-04-27T10:00:00+09:00' },
    participantCount: 41,
    prizeTotal: '100만원',
    links: { detail: '/hackathons/daker-handover-2026-03', rules: '#', faq: '#' },
  },
  {
    slug: 'ux-ui-redesign-2026',
    title: '2026 사용자 경험 리디자인 챌린지',
    status: 'ongoing',
    type: '디자인',
    tags: ['UX', 'UI', 'Figma', 'Redesign'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-04-20T18:00:00+09:00', endAt: '2026-05-05T18:00:00+09:00' },
    participantCount: 156,
    prizeTotal: '300만원',
    links: { detail: '/hackathons/ux-ui-redesign-2026', rules: '#', faq: '#' },
  },
  {
    slug: 'fintech-security-hack',
    title: '핀테크 보안 강화 해커톤',
    status: 'ongoing',
    type: 'SW개발',
    tags: ['FinTech', 'Security', 'Web3'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-04-10T10:00:00+09:00', endAt: '2026-04-30T10:00:00+09:00' },
    participantCount: 112,
    prizeTotal: '400만원',
    links: { detail: '/hackathons/fintech-security-hack', rules: '#', faq: '#' },
  },
  {
    slug: 'metabolism-healthcare-2026',
    title: '건강 수명 연장 프로젝트: 헬스케어 AI',
    status: 'ongoing',
    type: 'AI/ML',
    tags: ['Bio', 'Health', 'AI', 'ML'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-04-25T10:00:00+09:00', endAt: '2026-05-15T18:00:00+09:00' },
    participantCount: 78,
    prizeTotal: '1,000만원',
    links: { detail: '/hackathons/metabolism-healthcare-2026', rules: '#', faq: '#' },
  },

  // --- UPCOMING (4) ---
  {
    slug: 'web3-defi-innovation',
    title: 'Web 3.0 디파이(DeFi) 혁신 챌린지',
    status: 'upcoming',
    type: 'SW개발',
    tags: ['Web3', 'Blockchain', 'DeFi'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-05-01T10:00:00+09:00', endAt: '2026-05-10T10:00:00+09:00' },
    participantCount: 0,
    prizeTotal: '300만원',
    links: { detail: '/hackathons/web3-defi-innovation', rules: '#', faq: '#' },
  },
  {
    slug: 'lowcode-nocode-2026',
    title: '로우코드/노코드 생산성 해커톤',
    status: 'upcoming',
    type: '서비스기획',
    tags: ['LowCode', 'NoCode', 'Productivity'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-05-15T10:00:00+09:00', endAt: '2026-05-25T10:00:00+09:00' },
    participantCount: 0,
    prizeTotal: '200만원',
    links: { detail: '/hackathons/lowcode-nocode-2026', rules: '#', faq: '#' },
  },
  {
    slug: 'gamification-startup-2026',
    title: '게임화(Gamification) 스타트업 아이디어톤',
    status: 'upcoming',
    type: '전략기획',
    tags: ['Gaming', 'Business', 'Idea'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-06-01T10:00:00+09:00', endAt: '2026-06-10T10:00:00+09:00' },
    participantCount: 0,
    prizeTotal: '500만원',
    links: { detail: '/hackathons/gamification-startup-2026', rules: '#', faq: '#' },
  },
  {
    slug: 'green-tech-zero-waste',
    title: '2026 그린테크: 제로 웨이스트 솔루션',
    status: 'upcoming',
    type: 'SW개발',
    tags: ['GreenTech', 'ESG', 'Environment'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-06-15T18:00:00+09:00', endAt: '2026-06-30T18:00:00+09:00' },
    participantCount: 0,
    prizeTotal: '600만원',
    links: { detail: '/hackathons/green-tech-zero-waste', rules: '#', faq: '#' },
  },

  // --- ENDED (8) ---
  {
    slug: 'aimers-8-model-lite',
    title: 'LG Aimers 8기: 모델 경량화 챌린지',
    status: 'ended',
    type: 'AI/ML',
    tags: ['ML', 'Compression', 'Optimization'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-02-25T10:00:00+09:00', endAt: '2026-03-15T18:00:00+09:00' },
    participantCount: 842,
    prizeTotal: '채용 우대',
    links: { detail: '/hackathons/aimers-8-model-lite', rules: '#', faq: '#' },
  },
  {
    slug: 'public-data-2025-final',
    title: '2025 공공데이터 활용 성과 공유 대회',
    status: 'ended',
    type: '데이터분석',
    tags: ['PublicData', 'BigData', 'Analysis'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2025-12-10T10:00:00+09:00', endAt: '2025-12-28T18:00:00+09:00' },
    participantCount: 567,
    prizeTotal: '1,000만원',
    links: { detail: '/hackathons/public-data-2025-final', rules: '#', faq: '#' },
  },
  {
    slug: 'university-sw-challenge-2025',
    title: '제10회 대학연합 SW 창작 챌린지',
    status: 'ended',
    type: 'SW개발',
    tags: ['University', 'Android', 'iOS', 'Web'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2025-11-20T10:00:00+09:00', endAt: '2025-12-05T18:00:00+09:00' },
    participantCount: 1205,
    prizeTotal: '장학금 2,000만원',
    links: { detail: '/hackathons/university-sw-challenge-2025', rules: '#', faq: '#' },
  },
  {
    slug: 'metaverse-camp-2025',
    title: '2025 메타버스 서비스 기획 캠프',
    status: 'ended',
    type: '서비스기획',
    tags: ['Metaverse', 'Roblox', 'Unity'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2025-10-05T10:00:00+09:00', endAt: '2025-10-15T18:00:00+09:00' },
    participantCount: 432,
    prizeTotal: '애플 비전 프로',
    links: { detail: '/hackathons/metaverse-camp-2025', rules: '#', faq: '#' },
  },
  {
    slug: 'opensource-mentoring-2025',
    title: '오픈소스 컨트리뷰션 멘토링 챌린지',
    status: 'ended',
    type: 'SW개발',
    tags: ['OpenSource', 'GitHub', 'OSS'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2025-09-15T10:00:00+09:00', endAt: '2025-09-30T18:00:00+09:00' },
    participantCount: 312,
    prizeTotal: '멘토링 인증서',
    links: { detail: '/hackathons/opensource-mentoring-2025', rules: '#', faq: '#' },
  },
  {
    slug: 'iot-smart-home-2025',
    title: '2025 IoT 스마트홈 보안 경진대회',
    status: 'ended',
    type: 'SW개발',
    tags: ['IoT', 'HomeAutomation', 'Security'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1558002038-1055907df8a7?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2025-08-10T10:00:00+09:00', endAt: '2025-08-25T18:00:00+09:00' },
    participantCount: 156,
    prizeTotal: '샤오미 가전 풀세트',
    links: { detail: '/hackathons/iot-smart-home-2025', rules: '#', faq: '#' },
  },
  {
    slug: 'dos-operation-hack-2025',
    title: 'DOS(Daker Operation System) 고안 해커톤',
    status: 'ended',
    type: '전략기획',
    tags: ['Ops', 'Strategy', 'Daker'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165833767-0af1954a68af?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2025-07-05T10:00:00+09:00', endAt: '2025-07-20T18:00:00+09:00' },
    participantCount: 89,
    prizeTotal: '데이커 파트너십',
    links: { detail: '/hackathons/dos-operation-hack-2025', rules: '#', faq: '#' },
  },
  {
    slug: 'cyber-security-grand-2025',
    title: '2025 사이버 보안 그랜드 챌린지: 디펜스',
    status: 'ended',
    type: 'SW개발',
    tags: ['CyberSecurity', 'CTF', 'Defense'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2025-06-10T10:00:00+09:00', endAt: '2025-06-25T18:00:00+09:00' },
    participantCount: 1420,
    prizeTotal: '대한민국 보안 대상',
    links: { detail: '/hackathons/cyber-security-grand-2025', rules: '#', faq: '#' },
  },
];


export const hackathonDetails: HackathonDetail[] = [
  // --- ONGOING (6) ---
  {
    slug: 'gen-ai-startup-challenge',
    title: '제1회 생성형 AI 스타트업 챌린지',
    sections: {
      overview: { summary: 'AI 스타트업 기획', teamPolicy: { allowSolo: true, maxTeamSize: 4 } },
      info: { notice: ['창업 지원'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '혁신성', description: 'AI 비즈니스 모델', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '대회 시작', at: '2026-03-15T10:00:00+09:00', step: 0 },
          { name: '1단계: 기획안 제출', at: '2026-03-25T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'plan' },
          { name: '2단계: 데모 영상 제출', at: '2026-04-05T18:00:00+09:00', type: 'submission', step: 2, itemKey: 'demo' },
          { name: '3단계: 최종 발표 자료 제출', at: '2026-04-15T18:00:00+09:00', type: 'submission', step: 3, itemKey: 'deck' },
          { name: '최종 결과 발표', at: '2026-04-28T10:00:00+09:00', type: 'result', step: 4 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 10000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['pdf', 'url'],
        submissionUrl: '#',
        guide: ['기획안, 데모, 발표 자료를 단계별로 제출하세요.'],
        submissionItems: [
          { key: 'plan', title: '아이디어 기획서', format: 'PDF', deadline: '2026-03-25T18:00:00+09:00' },
          { key: 'demo', title: '데모 영상 링크', format: 'URL', deadline: '2026-04-05T18:00:00+09:00' },
          { key: 'deck', title: '최종 발표 자료', format: 'PDF', deadline: '2026-04-15T18:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '단계별 제출 현황 및 심사 결과' },
    },
  },
  {
    slug: 'cloud-native-modernization',
    title: '2026 클라우드 네이티브 현대화 대회',
    sections: {
      overview: { summary: '클라우드 전환', teamPolicy: { allowSolo: true, maxTeamSize: 3 } },
      info: { notice: ['AWS 활용'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '기술력', description: '인프라 현대화', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '대회 시작', at: '2026-03-25T10:00:00+09:00', step: 0 },
          { name: '1단계: 아키텍처 설계서 제출', at: '2026-04-05T10:00:00+09:00', type: 'submission', step: 1, itemKey: 'arch' },
          { name: '2단계: 구현 저장소 링크 제출', at: '2026-04-15T10:00:00+09:00', type: 'submission', step: 2, itemKey: 'repo' },
          { name: '최종 결과 발표', at: '2026-05-02T10:00:00+09:00', type: 'result', step: 3 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 5000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['pdf', 'url'],
        submissionUrl: '#',
        guide: ['설계서와 코드 저장소를 제출하세요.'],
        submissionItems: [
          { key: 'arch', title: '아키텍처 설계서', format: 'PDF', deadline: '2026-04-05T10:00:00+09:00' },
          { key: 'repo', title: 'GitHub 저장소 링크', format: 'URL', deadline: '2026-04-15T10:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '인프라 구축 현황' },
    },
  },

  {
    slug: 'daker-handover-2026-03',
    title: '제1회 데이커 긴급 인수인계 해커톤',
    sections: {
      overview: { summary: '인수인계 실습', teamPolicy: { allowSolo: true, maxTeamSize: 5 } },
      info: { notice: ['명세서 구현'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '완성도', description: 'VibeCoding 결과', scoreSource: 'vote' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '시작', at: '2026-03-04T10:00:00+09:00', step: 0 },
          { name: '1단계: 기획안 제출', at: '2026-03-28T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'plan' },
          { name: '2단계: 중간 점검', at: '2026-04-05T18:00:00+09:00', type: 'submission', step: 2, itemKey: 'mid' },
          { name: '3단계: 최종 결과물', at: '2026-04-12T18:00:00+09:00', type: 'submission', step: 3, itemKey: 'final' },
          { name: '투표 개시', at: '2026-04-12T18:00:01+09:00', type: 'voting', step: 4, votingEnabled: true, galleryEnabled: true },
          { name: '최종 결과', at: '2026-04-27T10:00:00+09:00', type: 'result', step: 5 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 1000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url', 'pdf'],
        submissionUrl: '#',
        guide: ['기획, 중간, 최종 앱 링크를 단계별로 제출하세요.'],
        submissionItems: [
          { key: 'plan', title: '기획안 (PDF/URL)', format: 'URL', deadline: '2026-03-28T18:00:00+09:00' },
          { key: 'mid', title: '중간 구현 링크', format: 'URL', deadline: '2026-04-05T18:00:00+09:00' },
          { key: 'final', title: '최종 결과 앱 링크', format: 'URL', deadline: '2026-04-12T18:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '단계별 제출 및 투표 현황' },
    },
  },
  {
    slug: 'ux-ui-redesign-2026',
    title: '2026 사용자 경험 리디자인 챌린지',
    sections: {
      overview: { summary: 'UX 개선', teamPolicy: { allowSolo: true, maxTeamSize: 3 } },
      info: { notice: ['피그마 사용'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '사용성', description: 'UX 리서치 기반', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '시작', at: '2026-04-01T10:00:00+09:00', step: 0 },
          { name: '1단계: 리서치 보고서', at: '2026-04-10T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'research' },
          { name: '2단계: 최종 피그마 디자인', at: '2026-04-20T18:00:00+09:00', type: 'submission', step: 2, itemKey: 'figma' },
          { name: '결과 발표', at: '2026-05-05T18:00:00+09:00', type: 'result', step: 3 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 3000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url', 'pdf'],
        submissionUrl: '#',
        guide: ['리서치와 디자인 결과물을 제출하세요.'],
        submissionItems: [
          { key: 'research', title: '사용자 리서치 보고서', format: 'PDF', deadline: '2026-04-10T18:00:00+09:00' },
          { key: 'figma', title: 'Figma 디자인 프로토타입', format: 'URL', deadline: '2026-04-20T18:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '디자인 진행 단계' },
    },
  },
  {
    slug: 'fintech-security-hack',
    title: '핀테크 보안 강화 해커톤',
    sections: {
      overview: { summary: '금융 보안', teamPolicy: { allowSolo: true, maxTeamSize: 4 } },
      info: { notice: ['보안 취약점'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '방어율', description: '보안 시나리오 테스트', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '시작', at: '2026-04-05T10:00:00+09:00', step: 0 },
          { name: '1단계: 취약점 분석 리포트', at: '2026-04-10T10:00:00+09:00', type: 'submission', step: 1, itemKey: 'threat' },
          { name: '2단계: 보안 패치 코드', at: '2026-04-20T10:00:00+09:00', type: 'submission', step: 2, itemKey: 'patch' },
          { name: '최종 결과 발표', at: '2026-04-30T10:00:00+09:00', type: 'result', step: 3 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 4000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['pdf', 'url'],
        submissionUrl: '#',
        guide: ['분석 보고서와 패치 소스코드를 제출하세요.'],
        submissionItems: [
          { key: 'threat', title: '취약점 분석 리포트', format: 'PDF', deadline: '2026-04-10T10:00:00+09:00' },
          { key: 'patch', title: '보안 패치 및 소스코드', format: 'URL', deadline: '2026-04-20T10:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '보안 강화 현황' },
    },
  },
  {
    slug: 'metabolism-healthcare-2026',
    title: '건강 수명 연장 프로젝트: 헬스케어 AI',
    sections: {
      overview: { summary: '바이오 헬스 AI', teamPolicy: { allowSolo: true, maxTeamSize: 4 } },
      info: { notice: ['데이터 준수'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '예측 정확도', description: 'ML 모델 성능', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '시작', at: '2026-04-10T10:00:00+09:00', step: 0 },
          { name: '1단계: 데이터 정제 및 특징 추출', at: '2026-04-25T10:00:00+09:00', type: 'submission', step: 1, itemKey: 'dataset' },
          { name: '2단계: 최종 예측 모델', at: '2026-05-10T10:00:00+09:00', type: 'submission', step: 2, itemKey: 'model' },
          { name: '최종 시상', at: '2026-05-15T18:00:00+09:00', type: 'result', step: 3 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 10000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url'],
        submissionUrl: '#',
        guide: ['데이터셋 구성과 훈련 성과를 제출하세요.'],
        submissionItems: [
          { key: 'dataset', title: '정제된 데이터셋 구성안', format: 'URL', deadline: '2026-04-25T10:00:00+09:00' },
          { key: 'model', title: '학습 모델 레포지토리', format: 'URL', deadline: '2026-05-10T10:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '예측 정확도 리더보드' },
    },
  },

  // --- UPCOMING (4) ---
  {
    slug: 'web3-defi-innovation',
    title: 'Web 3.0 디파이(DeFi) 혁신 챌린지',
    sections: {
      overview: { summary: '디파이 혁신', teamPolicy: { allowSolo: true, maxTeamSize: 5 } },
      info: { notice: ['스마트 컨트랙트'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '금융 가치', description: 'Web3 솔루션', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '시작', at: '2026-05-01T10:00:00+09:00', type: 'submission', step: 1 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 3000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: { allowedArtifactTypes: ['url'], submissionUrl: '#', guide: ['웹3 앱'] },
      leaderboard: { publicLeaderboardUrl: '#', note: '예정' },
    },
  },
  {
    slug: 'lowcode-nocode-2026',
    title: '로우코드/노코드 생산성 해커톤',
    sections: {
      overview: { summary: '생산성 향상', teamPolicy: { allowSolo: true, maxTeamSize: 3 } },
      info: { notice: ['비개발자 환영'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '업무 자동화', description: '실무 적용성', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '시작', at: '2026-05-15T10:00:00+09:00', type: 'submission', step: 1 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 2000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: { allowedArtifactTypes: ['url'], submissionUrl: '#', guide: ['솔루션 링크'] },
      leaderboard: { publicLeaderboardUrl: '#', note: '예정' },
    },
  },
  {
    slug: 'gamification-startup-2026',
    title: '게임화(Gamification) 스타트업 아이디어톤',
    sections: {
      overview: { summary: '게임화 기획', teamPolicy: { allowSolo: true, maxTeamSize: 5 } },
      info: { notice: ['신규 비즈니스'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '재미와 보상', description: '게이미피케이션 설계', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '시작', at: '2026-06-01T10:00:00+09:00', type: 'submission', step: 1 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 5000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: { allowedArtifactTypes: ['pdf'], submissionUrl: '#', guide: ['기획안'] },
      leaderboard: { publicLeaderboardUrl: '#', note: '예정' },
    },
  },
  {
    slug: 'green-tech-zero-waste',
    title: '2026 그린테크: 제로 웨이스트 솔루션',
    sections: {
      overview: { summary: '환경 보호 기술', teamPolicy: { allowSolo: true, maxTeamSize: 4 } },
      info: { notice: ['ESG 가치'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '탄소 배출 저감', description: '환경 영향력', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '시작', at: '2026-06-15T10:00:00+09:00', type: 'submission', step: 1 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 6000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: { allowedArtifactTypes: ['url'], submissionUrl: '#', guide: ['데모 링크'] },
      leaderboard: { publicLeaderboardUrl: '#', note: '예정' },
    },
  },

  // --- ENDED (8) ---
  {
    slug: 'aimers-8-model-lite',
    title: 'LG Aimers 8기: 모델 경량화 챌린지',
    sections: {
      overview: { summary: '모델 압축', teamPolicy: { allowSolo: true, maxTeamSize: 3 } },
      info: { notice: ['경쟁 우대'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '에너지 효율', description: '추론 속도', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '1단계: 베이스라인 제출', at: '2026-02-15T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'base' },
          { name: '2단계: 최종 모델 제출', at: '2026-03-01T18:00:00+09:00', type: 'submission', step: 2, itemKey: 'final' },
          { name: '최종 결과', at: '2026-03-15T18:00:00+09:00', type: 'result', step: 3 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 0 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url'],
        submissionUrl: '#',
        guide: ['모델 결과물을 제출하세요.'],
        submissionItems: [
          { key: 'base', title: '베이스라인 추론 결과', format: 'URL', deadline: '2026-02-15T18:00:00+09:00' },
          { key: 'final', title: '최종 경량화 모델', format: 'URL', deadline: '2026-03-01T18:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '공식 랭킹' },
    },
  },
  {
    slug: 'public-data-2025-final',
    title: '2025 공공데이터 활용 성과 공유 대회',
    sections: {
      overview: { summary: '데이터 분석 성과', teamPolicy: { allowSolo: true, maxTeamSize: 5 } },
      info: { notice: ['성과 홍보'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '사회적 가치', description: '데이터 활용도', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '성과 보고서 제출', at: '2025-12-15T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'report' },
          { name: '종료', at: '2025-12-28T18:00:00+09:00', type: 'result', step: 2 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 10000000 }] },
      teams: { campEnabled: false, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['pdf'],
        submissionUrl: '#',
        guide: ['성과 보고서를 제출하세요.'],
        submissionItems: [
          { key: 'report', title: '성과 분석 보고서', format: 'PDF', deadline: '2025-12-15T18:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '최종 결과' },
    },
  },
  {
    slug: 'university-sw-challenge-2025',
    title: '제10회 대학연합 SW 창작 챌린지',
    sections: {
      overview: { summary: '학생 창작물', teamPolicy: { allowSolo: true, maxTeamSize: 5 } },
      info: { notice: ['연합 활동'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '창의성', description: '새로운 시각', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '1단계: 기획서', at: '2025-11-01T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'plan' },
          { name: '2단계: 최종 작품', at: '2025-11-25T18:00:00+09:00', type: 'submission', step: 2, itemKey: 'work' },
          { name: '종료', at: '2025-12-05T18:00:00+09:00', type: 'result', step: 3 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 20000000 }] },
      teams: { campEnabled: false, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url'],
        submissionUrl: '#',
        guide: ['작품 링크를 제출하세요.'],
        submissionItems: [
          { key: 'plan', title: '창작물 기획안', format: 'PDF', deadline: '2025-11-01T18:00:00+09:00' },
          { key: 'work', title: '최종 SW 작품 링크', format: 'URL', deadline: '2025-11-25T18:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '최종 결과' },
    },
  },
  {
    slug: 'metaverse-camp-2025',
    title: '2025 메타버스 서비스 기획 캠프',
    sections: {
      overview: { summary: '메타버스 기획', teamPolicy: { allowSolo: true, maxTeamSize: 5 } },
      info: { notice: ['가상 공간'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '몰입감', description: '공간 구성력', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '캠프 과제 제출', at: '2025-10-01T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'task' },
          { name: '종료', at: '2025-10-15T18:00:00+09:00', type: 'result', step: 2 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 0 }] },
      teams: { campEnabled: false, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url'],
        submissionUrl: '#',
        guide: ['캠프 과제를 제출하세요.'],
        submissionItems: [
          { key: 'task', title: '공간 기획 및 과제', format: 'URL', deadline: '2025-10-01T18:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '최종 결과' },
    },
  },
  {
    slug: 'opensource-mentoring-2025',
    title: '오픈소스 컨트리뷰션 멘토링 챌린지',
    sections: {
      overview: { summary: '커뮤니티 기여', teamPolicy: { allowSolo: true, maxTeamSize: 1 } },
      info: { notice: ['PR/Issue'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '기여도', description: '코드 품질 및 활동', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: 'PR 링크 제출', at: '2025-09-15T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'pr' },
          { name: '종료', at: '2025-09-30T18:00:00+09:00', type: 'result', step: 2 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 0 }] },
      teams: { campEnabled: false, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url'],
        submissionUrl: '#',
        guide: ['기여한 PR 링크를 제출하세요.'],
        submissionItems: [
          { key: 'pr', title: '오픈소스 PR 링크', format: 'URL', deadline: '2025-09-15T18:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '최종 결과' },
    },
  },
  {
    slug: 'iot-smart-home-2025',
    title: '2025 IoT 스마트홈 보안 경진대회',
    sections: {
      overview: { summary: 'IoT 보안', teamPolicy: { allowSolo: true, maxTeamSize: 3 } },
      info: { notice: ['기기 테스트'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '취약점 탐지', description: '보안 안정성', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '보안 컨설팅 보고서', at: '2025-08-15T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'consulting' },
          { name: '종료', at: '2025-08-25T18:00:00+09:00', type: 'result', step: 2 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 0 }] },
      teams: { campEnabled: false, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['pdf'],
        submissionUrl: '#',
        guide: ['보안 보고서를 제출하세요.'],
        submissionItems: [
          { key: 'consulting', title: '보안 취약점 컨설팅 보고서', format: 'PDF', deadline: '2025-08-15T18:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '최종 결과' },
    },
  },
  {
    slug: 'dos-operation-hack-2025',
    title: 'DOS(Daker Operation System) 고안 해커톤',
    sections: {
      overview: { summary: '운영 체계 기획', teamPolicy: { allowSolo: true, maxTeamSize: 5 } },
      info: { notice: ['전략 수립'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '효율성', description: '조직 최적화', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '운영 기획안 제출', at: '2025-07-05T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'ops' },
          { name: '종료', at: '2025-07-20T18:00:00+09:00', type: 'result', step: 2 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 0 }] },
      teams: { campEnabled: false, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['pdf'],
        submissionUrl: '#',
        guide: ['운영 기획안을 제출하세요.'],
        submissionItems: [
          { key: 'ops', title: '운영 체계 기획안', format: 'PDF', deadline: '2025-07-05T18:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '최종 결과' },
    },
  },
  {
    slug: 'cyber-security-grand-2025',
    title: '2025 사이버 보안 그랜드 챌린지: 디펜스',
    sections: {
      overview: { summary: '국가 보안', teamPolicy: { allowSolo: true, maxTeamSize: 5 } },
      info: { notice: ['CTF 방식'], links: { rules: '#', faq: '#' } },
      eval: { metricName: '방어 성과', description: '실시간 관제', scoreSource: 'auto' },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '관제 로그 제출', at: '2025-06-15T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'logs' },
          { name: '종료', at: '2025-06-25T18:00:00+09:00', type: 'result', step: 2 },
        ],
      },
      prize: { items: [{ place: '대상', amountKRW: 0 }] },
      teams: { campEnabled: false, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url'],
        submissionUrl: '#',
        guide: ['실시간 관제 데이터를 제출하세요.'],
        submissionItems: [
          { key: 'logs', title: '네트워크 관제 실시간 로그', format: 'URL', deadline: '2025-06-15T18:00:00+09:00' },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '최종 결과' },
    },
  },
];

// --- TEAM DATA LIBRARIES ---
const teamNameLibrary = [
  'Prompt Wizards', 'Cloud Runners', 'Vibe Engineers', 'Pixel Perfect', 'Data Driven',
  'Semantic Raiders', 'Logic Gates', 'Sync Tank', 'Dev Flow', 'Insight Seekers',
  'Alpha ML', 'Beta Opt', 'Gamma Vision', 'Delta Stream', 'Epsilon Secure'
];
const introLibrary = [
  'AI 프롬프트 엔지니어링과 실시간 데이터 처리에 특화된 팀입니다. 멋진 데모를 함께 만들어요!',
  '사용자 경험을 최우선으로 생각하는 디자이너들과 기획자들이 모여 혁신적인 서비스를 구상 중입니다.',
  '클라우드 네이티브 아키텍처와 컨테이너 환경에 진심인 팀원들입니다. MSA 구축 실무 경험을 나누세요.',
  '혁신적인 핀테크 보안 솔루션을 개발 중입니다. 안전하고 편리한 사용자 경로를 함께 고민해요.',
  '메타버스 공간 기획과 몰입감 있는 사용자 경험 제공을 목표로 합니다. Unity/WebXR 개발자를 찾습니다.',
  '데이터 속에 숨겨진 가치를 찾는 데이터 사이언티스트들의 모임입니다. 시각화와 분석 모델링에 자신 있습니다.',
  '오픈소스 커뮤니티의 성장을 돕고, 기술 문서를 풍성하게 만드는 기여 활동에 전념하고 있습니다.',
  '네트워크 보안과 실시간 관제 시스템 구축에 특화된 실무형 인재들이 모인 팀입니다.',
];

// ─── Teams (Simulated for 18 hackathons) ────────────────────
export const teams: Team[] = [
  {
    teamCode: 'T-HANDOVER-01',
    hackathonSlug: 'daker-handover-2026-03',
    name: '404found',
    isOpen: true,
    isPrivate: false,
    leaderId: 'user-001-yujin',
    memberCount: 3,
    maxTeamSize: 4,
    lookingFor: [
      { position: 'Backend', description: 'Next.js API' },
      { position: 'Designer', description: 'UI 정비' },
    ],
    intro: '데이커 인수인계 해커톤의 끝을 장식할 404found 팀입니다. 우리의 바이브를 앱으로 증명합니다.',
    contact: { type: 'link', url: 'https://vibe.app' },
    createdAt: '2026-03-20T10:00:00Z',
    progressStatus: 'developing',
    progressPercent: 100,
  },
  // Ongoing Hackathons Teams
  ...['gen-ai-startup-challenge', 'cloud-native-modernization', 'daker-handover-2026-03', 'ux-ui-redesign-2026', 'fintech-security-hack', 'metabolism-healthcare-2026'].flatMap((slug, sIdx) =>
    Array.from({ length: slug === 'daker-handover-2026-03' ? 40 : 30 + sIdx * 10 }).map((_, i) => ({
      teamCode: `T-${slug.slice(0, 3).toUpperCase()}-${i + 1}`,
      hackathonSlug: slug,
      name: teamNameLibrary[(i + sIdx) % teamNameLibrary.length] + (i >= teamNameLibrary.length ? ` #${Math.floor(i / teamNameLibrary.length) + 1}` : ''),
      isOpen: i % 3 === 0,
      isPrivate: i % 5 === 0, // 5개마다 1개씩 비공개 팀으로 설정
      leaderId: `user-${slug}-${i}`,
      memberCount: (i % 3) + 2,
      maxTeamSize: 4,
      lookingFor: i % 3 === 0 ? [{ position: (i % 2 === 0 ? 'Designer' : 'Frontend'), description: (i % 2 === 0 ? 'UX/UI' : 'React/Next.js') }] : [],
      intro: introLibrary[(i + sIdx) % introLibrary.length],
      contact: { type: 'link' as const, url: '#' },
      createdAt: '2026-03-10T10:00:00Z',
      progressStatus: (i % 4 === 0 ? 'developing' : i % 4 === 1 ? 'designing' : 'planning') as any,
      progressPercent: (i % 4) * 25,
    }))
  ),
  // Ended Hackathons Teams
  ...['aimers-8-model-lite', 'public-data-2025-final', 'university-sw-challenge-2025', 'metaverse-camp-2025', 'opensource-mentoring-2025', 'iot-smart-home-2025', 'dos-operation-hack-2025', 'cyber-security-grand-2025'].flatMap((slug, sIdx) =>
    Array.from({ length: 20 }).map((_, i) => ({
      teamCode: `T-OLD-${slug.slice(0, 3).toUpperCase()}-${i + 1}`,
      hackathonSlug: slug,
      name: i === 0 ? (slug === 'aimers-8-model-lite' ? 'Alpha ML' : slug === 'public-data-2025-final' ? '공조팀' : `Best Team ${sIdx + i}`) :
        i === 1 ? (slug === 'aimers-8-model-lite' ? 'Beta Opt' : `Runner Team ${sIdx + i}`) :
          teamNameLibrary[(i + sIdx + 10) % teamNameLibrary.length] + ` (E)`,
      isOpen: false,
      isPrivate: false,
      leaderId: `user-old-${slug}-${i}`,
      memberCount: 3,
      maxTeamSize: 5,
      lookingFor: [],
      intro: '공식 대회 참가를 성공적으로 마쳤습니다.',
      contact: { type: 'link' as const, url: '#' },
      createdAt: '2025-01-01T10:00:00Z',
      progressStatus: 'completed' as const,
      progressPercent: 100,
    }))
  ),
];

// ─── Submissions (Simulated Multi-stage) ────────────────────
export const submissions: Submission[] = [
  {
    id: 'sub-handover-01',
    hackathonSlug: 'daker-handover-2026-03',
    teamCode: 'T-HANDOVER-01',
    teamName: '404found',
    status: 'submitted',
    artifacts: [{ type: 'url', key: 'web', content: 'https://vibe.app', uploadedAt: '2026-03-28T09:58:00Z' }],
    notes: '최종 구현 완료!',
    submittedAt: '2026-03-28T09:58:00Z',
  },
  // GenAI (3 stages: plan, demo, deck)
  ...Array.from({ length: 40 }).flatMap((_, i) => {
    const arts: any[] = [];
    if (i < 36) arts.push({ type: 'pdf', key: 'plan', content: 'plan.pdf', uploadedAt: '2026-03-20T10:00:00Z' });
    if (i < 16) arts.push({ type: 'url', key: 'demo', content: 'https://youtube.com/demo', uploadedAt: '2026-04-01T10:00:00Z' });
    if (i < 4) arts.push({ type: 'pdf', key: 'deck', content: 'deck.pdf', uploadedAt: '2026-04-10T10:00:00Z' });

    if (arts.length === 0) return [];
    return [{
      id: `sub-genai-${i}`,
      hackathonSlug: 'gen-ai-startup-challenge',
      teamCode: `T-GEN-${i + 1}`,
      teamName: `GENAI Team #${i + 1}`,
      status: 'submitted' as const,
      artifacts: arts,
      notes: '단계별 제출물',
      submittedAt: arts[arts.length - 1].uploadedAt,
    }];
  }),
  // Cloud (2 stages: arch, repo)
  ...Array.from({ length: 30 }).flatMap((_, i) => {
    const arts: any[] = [];
    if (i < 21) arts.push({ type: 'pdf', key: 'arch', content: 'arch.pdf', uploadedAt: '2026-03-30T10:00:00Z' });
    if (i < 9) arts.push({ type: 'url', key: 'repo', content: 'https://github.com/repo', uploadedAt: '2026-04-10T10:00:00Z' });

    if (arts.length === 0) return [];
    return [{
      id: `sub-cloud-${i}`,
      hackathonSlug: 'cloud-native-modernization',
      teamCode: `T-CLO-${i + 1}`,
      teamName: `CLOUD Team #${i + 1}`,
      status: 'submitted' as const,
      artifacts: arts,
      notes: '진행 중',
      submittedAt: arts[arts.length - 1].uploadedAt,
    }];
  }),
  // Ended Hackathons (100% submission)
  ...['aimers-8-model-lite', 'public-data-2025-final', 'university-sw-challenge-2025', 'metaverse-camp-2025', 'opensource-mentoring-2025', 'iot-smart-home-2025', 'dos-operation-hack-2025', 'cyber-security-grand-2025'].flatMap((slug) =>
    Array.from({ length: 15 }).map((_, i) => ({
      id: `sub-old-${slug}-${i}`,
      hackathonSlug: slug,
      teamCode: `T-OLD-${slug.slice(0, 3).toUpperCase()}-${i + 1}`,
      teamName: `Old Team ${i + 1}`,
      status: 'submitted' as const,
      artifacts: [
        { type: 'url', key: slug === 'aimers-8-model-lite' ? 'final' : 'report', content: 'https://result.app', uploadedAt: '2025-12-01T10:00:00Z' }
      ],
      notes: '최종 완료',
      submittedAt: '2025-12-01T10:00:00Z',
    }))
  ),
];

// ─── Leaderboards (Realistic Votes & Scores) ─────────────────
export const leaderboards: Record<string, Leaderboard> = {
  'gen-ai-startup-challenge': {
    updatedAt: new Date().toISOString(),
    entries: Array.from({ length: 40 }).map((_, i) => ({
      rank: null,
      teamName: `GENAI Team #${i + 1}`,
      score: null,
      votes: Math.floor(Math.random() * 400) + 50,
      submittedAt: i < 36 ? '2026-03-20T10:00:00Z' : null,
    })),
  },
  'cloud-native-modernization': {
    updatedAt: new Date().toISOString(),
    entries: Array.from({ length: 30 }).map((_, i) => ({
      rank: null,
      teamName: `CLOUD Team #${i + 1}`,
      score: null,
      votes: Math.floor(Math.random() * 300) + 30,
      submittedAt: i < 21 ? '2026-03-30T10:00:00Z' : null,
    })),
  },
  'daker-handover-2026-03': {
    updatedAt: new Date().toISOString(),
    entries: [
      { rank: null, teamName: '명세서 저격수', score: null, votes: 452, submittedAt: '2026-03-28T15:00:00Z' },
      { rank: null, teamName: '바이브 장인들', score: null, votes: 312, submittedAt: '2026-03-25T14:30:00Z' },
      { rank: null, teamName: '404found', score: null, votes: 298, submittedAt: '2026-03-28T09:58:00Z' },
      ...Array.from({ length: 37 }).map((_, i) => ({
        rank: null,
        teamName: `DAKER Team #${i + 1}`,
        score: null,
        votes: Math.floor(Math.random() * 200) + 10,
        submittedAt: '2026-03-28T00:00:00Z',
      }))
    ],
  },
  'aimers-8-model-lite': {
    updatedAt: '2026-03-15T18:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'Alpha ML', score: 98.5, votes: 120, submittedAt: '2026-02-24T10:00:00Z' },
      { rank: 2, teamName: 'Beta Opt', score: 92.2, votes: 85, submittedAt: '2026-02-24T11:00:00Z' },
      ...Array.from({ length: 13 }).map((_, i) => ({
        rank: i + 3,
        teamName: `Old Team ${i + 3}`,
        score: 90 - i * 2,
        votes: 50 - i,
        submittedAt: '2026-02-24T12:00:00Z',
      }))
    ],
  },
};

// ─── User Profiles (Pool for AI Matching) ──────────────────
export const users: UserProfile[] = [
  {
    id: 'user-002-frontend',
    nickname: '김프런트',
    email: 'front@daker.ai',
    teamCodes: [],
    joinedAt: '2026-02-01T10:00:00Z',
    role: 'Frontend Developer',
    skills: ['React', 'Next.js', 'TailwindCSS', 'TypeScript'],
  },
  {
    id: 'user-003-backend',
    nickname: '이백엔드',
    email: 'back@daker.ai',
    teamCodes: [],
    joinedAt: '2026-02-05T10:00:00Z',
    role: 'Backend Developer',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
  },
  {
    id: 'user-004-designer',
    nickname: '박디자인',
    email: 'design@daker.ai',
    teamCodes: [],
    joinedAt: '2026-02-10T10:00:00Z',
    role: 'UI/UX Designer',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'Interactions'],
  },
  {
    id: 'user-005-ai',
    nickname: '최지능',
    email: 'ai@daker.ai',
    teamCodes: [],
    joinedAt: '2026-02-15T10:00:00Z',
    role: 'AI/ML Engineer',
    skills: ['Python', 'PyTorch', 'LLM', 'LangChain'],
  },
  {
    id: 'user-006-cloud',
    nickname: '정인프라',
    email: 'infra@daker.ai',
    teamCodes: [],
    joinedAt: '2026-02-20T10:00:00Z',
    role: 'Cloud Engineer',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
  },
  {
    id: 'user-007-pm',
    nickname: '한기획',
    email: 'pm@daker.ai',
    teamCodes: [],
    joinedAt: '2026-02-25T10:00:00Z',
    role: 'Product Manager',
    skills: ['Agile', 'Jira', 'User Research', 'Strategy'],
  },
];

// ─── Current User ──────────────────
export const currentUser: CurrentUser = {
  id: 'user-001-yujin',
  nickname: '강유진',
  email: 'yujin.kang@daker.ai',
  teamCodes: ['T-HANDOVER-01'],
  joinedAt: '2026-01-15T10:00:00Z',
  bookmarkedSlugs: ['daker-handover-2026-03', 'gen-ai-startup-challenge'],
  role: '서비스기획자',
  preferredTypes: ['서비스기획', '데이터/AI'],
  skills: ['Figma', 'Notion', 'PRD 작성'],
  pointHistory: [{ id: 'ph-1', description: '참가 보너스', points: 100, date: '2026-01-15T10:00:00Z' }],
};

const topUsers = [
  { nickname: '김프론트', id: 'user-old-aimers-8-model-lite-0' },
  { nickname: '이백엔드', id: 'user-old-aimers-8-model-lite-1' },
  { nickname: '박디자인', id: 'user-old-public-data-2025-final-0' },
  { nickname: '최클라우드', id: 'user-cloud-native-modernization-0' },
  { nickname: '정데이터', id: 'user-gen-ai-startup-challenge-0' },
  { nickname: '강유진', id: 'user-001-yujin' },
];

export const rankings: RankingUser[] = [
  ...topUsers.map((u, i) => ({
    id: u.id,
    rank: i + 1,
    nickname: u.nickname,
    points: 0, // Will be recalculated
    basePoints: 200 - i * 20,
    hackathonsJoined: 0,
    winsCount: 0,
    lastActiveAt: new Date().toISOString()
  })),
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `user-extra-${i}`,
    rank: i + 7,
    nickname: `Contributor ${i + 1}`,
    points: 0,
    basePoints: 50,
    hackathonsJoined: 1,
    winsCount: 0,
    lastActiveAt: '2026-03-30T10:00:00Z'
  }))
];

export const boards = [
  { id: 'p1', teamCode: 'T-HANDOVER-01', authorNickname: '강유진', content: '최종 제출 완료!', topic: '공지', color: 'bg-emerald-100', createdAt: '2026-03-29T10:00:00Z', likes: 5 },
];
