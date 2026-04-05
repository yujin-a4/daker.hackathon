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
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-04-28T23:59:59+09:00', endAt: '2026-05-05T15:00:00+09:00' },
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
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-03-01T23:59:59+09:00', endAt: '2026-04-01T10:00:00+09:00' },
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
    period: { timezone: 'Asia/Seoul', submissionDeadlineAt: '2026-04-01T18:00:00+09:00', endAt: '2026-04-15T10:00:00+09:00' },
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
    status: 'recruiting',
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
    status: 'recruiting',
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
    status: 'recruiting',
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
    status: 'recruiting',
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
  // 🌟 (1) 현재 날짜(2026-04-03) 기준, "제출 중(Submission)"인 대회
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
          { name: '1단계: 아이디어 기획서', at: '2026-03-30T23:59:59+09:00', type: 'submission', step: 1, itemKey: 'idea', galleryEnabled: false },
          { name: '2단계: UI/UX 프로토타입', at: '2026-04-15T23:59:59+09:00', type: 'submission', step: 2, itemKey: 'prototype', galleryEnabled: false },
          { name: '3단계: 최종 시연 영상', at: '2026-04-28T23:59:59+09:00', type: 'submission', step: 3, itemKey: 'demo', galleryEnabled: false },
          { name: '대국민 투표 개시', at: '2026-04-29T00:00:00+09:00', type: 'voting', step: 4, votingEnabled: true, galleryEnabled: true },
          { name: '최종 심사 및 결과', at: '2026-05-05T15:00:00+09:00', type: 'result', step: 5 },
        ],
      },
      prize: { items: [{ place: '1등', amountKRW: 5000000 }, { place: '2등', amountKRW: 3000000 }, { place: '3등', amountKRW: 2000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['pdf', 'url'],
        submissionUrl: '#',
        guide: ['기획안, 프로토타입, 시연 영상을 단계별로 제출하세요.'],
        submissionItems: [
          { key: 'idea', title: '아이디어 기획서 (PDF)', format: 'PDF', deadline: '2026-03-30T23:59:59+09:00' },
          { key: 'prototype', title: 'Figma 등 프로토타입 링크', format: 'URL', deadline: '2026-04-15T23:59:59+09:00' },
          { key: 'demo', title: '최종 시연 영상 (YouTube)', format: 'URL', deadline: '2026-04-28T23:59:59+09:00', isGalleryTarget: true },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '마감일까지 갤러리는 블라인드 처리됩니다.' },
    },
  },

  // 🌟 (2) 현재 날짜(2026-04-03) 기준, "결과 발표(Result)"가 완료된 대회
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
          { name: '대회 시작', at: '2026-02-01T10:00:00+09:00', step: 0 },
          { name: '1차: 아키텍처 설계', at: '2026-02-15T23:59:59+09:00', type: 'submission', step: 1, itemKey: 'arch', galleryEnabled: false },
          { name: '2차: 최종 코드 제출', at: '2026-03-01T23:59:59+09:00', type: 'submission', step: 2, itemKey: 'code', galleryEnabled: false },
          { name: '코드 리뷰 및 투표', at: '2026-03-02T00:00:00+09:00', type: 'voting', step: 3, votingEnabled: true, galleryEnabled: true },
          { name: '최종 심사 결과', at: '2026-04-01T10:00:00+09:00', type: 'result', step: 4 },
        ],
      },
      prize: { items: [{ place: '1등', amountKRW: 2500000 }, { place: '2등', amountKRW: 1500000 }, { place: '3등', amountKRW: 1000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['pdf', 'url'],
        submissionUrl: '#',
        guide: ['설계서와 코드 저장소를 제출하세요.'],
        submissionItems: [
          { key: 'arch', title: '아키텍처 설계서', format: 'PDF', deadline: '2026-02-15T23:59:59+09:00' },
          { key: 'code', title: 'GitHub 저장소 링크', format: 'URL', deadline: '2026-03-01T23:59:59+09:00', isGalleryTarget: true },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '최종 심사가 완료된 대회입니다.' },
    },
  },

  // 🌟 (3) 현재 날짜(2026-04-03) 기준, "투표 중(Voting)"인 대회 (닥커 팀)
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
          { name: '대회 시작', at: '2026-03-01T10:00:00+09:00', step: 0 },
          { name: '1단계: 문제 정의서', at: '2026-03-10T18:00:00+09:00', type: 'submission', step: 1, itemKey: 'problem', galleryEnabled: false },
          { name: '2단계: 해결 방안 초안', at: '2026-03-20T18:00:00+09:00', type: 'submission', step: 2, itemKey: 'solution', galleryEnabled: false },
          { name: '3단계: 최종 결과물', at: '2026-04-01T18:00:00+09:00', type: 'submission', step: 3, itemKey: 'final', galleryEnabled: false },
          { name: '사내 투표 진행', at: '2026-04-01T18:00:01+09:00', type: 'voting', step: 4, votingEnabled: true, galleryEnabled: true },
          { name: '최종 결과 발표', at: '2026-04-15T10:00:00+09:00', type: 'result', step: 5 },
        ],
      },
      prize: { items: [{ place: '1등', amountKRW: 500000 }, { place: '2등', amountKRW: 300000 }, { place: '3등', amountKRW: 200000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url', 'pdf'],
        submissionUrl: '#',
        guide: ['문제 정의, 해결 방안, 최종 결과물을 단계별로 제출하세요.'],
        submissionItems: [
          { key: 'problem', title: '문제 정의서 (PDF)', format: 'PDF', deadline: '2026-03-10T18:00:00+09:00' },
          { key: 'solution', title: '해결 방안 초안 링크', format: 'URL', deadline: '2026-03-20T18:00:00+09:00' },
          { key: 'final', title: '최종 결과물 (Notion 등)', format: 'URL', deadline: '2026-04-01T18:00:00+09:00', isGalleryTarget: true },
        ],
      },
      leaderboard: { publicLeaderboardUrl: '#', note: '현재 투표 기간입니다! 다른 팀에게 투표해보세요.' },
    },
  },

  // ▼ 이 아래는 기존 데이터 100% 동일하게 유지 ▼
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
      prize: { items: [{ place: '1등', amountKRW: 1500000 }, { place: '2등', amountKRW: 900000 }, { place: '3등', amountKRW: 600000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url', 'pdf'],
        submissionUrl: '#',
        guide: ['리서치와 디자인 결과물을 제출하세요.'],
        submissionItems: [
          { key: 'research', title: '사용자 리서치 보고서', format: 'PDF', deadline: '2026-04-10T18:00:00+09:00' },
          { key: 'figma', title: 'Figma 디자인 프로토타입', format: 'URL', deadline: '2026-04-20T18:00:00+09:00', isGalleryTarget: true },
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
      prize: { items: [{ place: '1등', amountKRW: 2000000 }, { place: '2등', amountKRW: 1200000 }, { place: '3등', amountKRW: 800000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['pdf', 'url'],
        submissionUrl: '#',
        guide: ['분석 보고서와 패치 소스코드를 제출하세요.'],
        submissionItems: [
          { key: 'threat', title: '취약점 분석 리포트', format: 'PDF', deadline: '2026-04-10T10:00:00+09:00' },
          { key: 'patch', title: '보안 패치 및 소스코드', format: 'URL', deadline: '2026-04-20T10:00:00+09:00', isGalleryTarget: true },
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
      prize: { items: [{ place: '1등', amountKRW: 5000000 }, { place: '2등', amountKRW: 3000000 }, { place: '3등', amountKRW: 2000000 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url'],
        submissionUrl: '#',
        guide: ['데이터셋 구성과 훈련 성과를 제출하세요.'],
        submissionItems: [
          { key: 'dataset', title: '정제된 데이터셋 구성안', format: 'URL', deadline: '2026-04-25T10:00:00+09:00' },
          { key: 'model', title: '학습 모델 레포지토리', format: 'URL', deadline: '2026-05-10T10:00:00+09:00', isGalleryTarget: true },
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
      prize: { items: [{ place: '1등', amountKRW: 1500000 }, { place: '2등', amountKRW: 900000 }, { place: '3등', amountKRW: 600000 }] },
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
      prize: { items: [{ place: '1등', amountKRW: 1000000 }, { place: '2등', amountKRW: 600000 }, { place: '3등', amountKRW: 400000 }] },
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
      prize: { items: [{ place: '1등', amountKRW: 2500000 }, { place: '2등', amountKRW: 1500000 }, { place: '3등', amountKRW: 1000000 }] },
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
      prize: { items: [{ place: '1등', amountKRW: 3000000 }, { place: '2등', amountKRW: 1800000 }, { place: '3등', amountKRW: 1200000 }] },
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
      prize: { items: [{ place: '1등', amountKRW: 0 }, { place: '2등', amountKRW: 0 }, { place: '3등', amountKRW: 0 }] },
      teams: { campEnabled: true, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url'],
        submissionUrl: '#',
        guide: ['모델 결과물을 제출하세요.'],
        submissionItems: [
          { key: 'base', title: '베이스라인 추론 결과', format: 'URL', deadline: '2026-02-15T18:00:00+09:00' },
          { key: 'final', title: '최종 경량화 모델', format: 'URL', deadline: '2026-03-01T18:00:00+09:00', isGalleryTarget: true },
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
      prize: { items: [{ place: '1등', amountKRW: 5000000 }, { place: '2등', amountKRW: 3000000 }, { place: '3등', amountKRW: 2000000 }] },
      teams: { campEnabled: false, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['pdf'],
        submissionUrl: '#',
        guide: ['성과 보고서를 제출하세요.'],
        submissionItems: [
          { key: 'report', title: '성과 분석 보고서', format: 'PDF', deadline: '2025-12-15T18:00:00+09:00', isGalleryTarget: true },
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
      prize: { items: [{ place: '1등', amountKRW: 10000000 }, { place: '2등', amountKRW: 6000000 }, { place: '3등', amountKRW: 4000000 }] },
      teams: { campEnabled: false, listUrl: '#' },
      submit: {
        allowedArtifactTypes: ['url'],
        submissionUrl: '#',
        guide: ['작품 링크를 제출하세요.'],
        submissionItems: [
          { key: 'plan', title: '창작물 기획안', format: 'PDF', deadline: '2025-11-01T18:00:00+09:00' },
          { key: 'work', title: '최종 SW 작품 링크', format: 'URL', deadline: '2025-11-25T18:00:00+09:00', isGalleryTarget: true },
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
      prize: { items: [{ place: '1등', amountKRW: 0 }, { place: '2등', amountKRW: 0 }, { place: '3등', amountKRW: 0 }] },
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
      prize: { items: [{ place: '1등', amountKRW: 0 }, { place: '2등', amountKRW: 0 }, { place: '3등', amountKRW: 0 }] },
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
      prize: { items: [{ place: '1등', amountKRW: 0 }, { place: '2등', amountKRW: 0 }, { place: '3등', amountKRW: 0 }] },
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
      prize: { items: [{ place: '1등', amountKRW: 0 }, { place: '2등', amountKRW: 0 }, { place: '3등', amountKRW: 0 }] },
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
      prize: { items: [{ place: '1등', amountKRW: 0 }, { place: '2등', amountKRW: 0 }, { place: '3등', amountKRW: 0 }] },
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
  'Alpha ML', 'Beta Opt', 'Gamma Vision', 'Delta Stream', 'Epsilon Secure',
  'Byte Brigade', 'Neural Nomads', 'Stack Overflow', 'Zero Latency', 'Open Canvas',
  'Cipher Squad', 'Deploy Fast', 'Quantum Leap', 'Dark Pattern', 'Refactor Kings',
  'Loop Masters', 'Signal Noise', 'Type Safe', 'Rust Belt', 'Null Pointer',
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

// ─── 통합 페르소나 풀 (30명) — 팀 leaderId의 단일 진실 공급원 ─────────
// 이 배열이 글로벌 랭킹 및 팀 데이터의 유일한 유저 소스입니다.
export const personaPool: UserProfile[] = [
  { id: 'p-001', nickname: '김민준', email: 'minjun@daker.ai', teamCodes: [], joinedAt: '2025-06-01T00:00:00Z', role: 'Frontend Developer', skills: ['React', 'TypeScript'] },
  { id: 'p-002', nickname: '이서연', email: 'seoyeon@daker.ai', teamCodes: [], joinedAt: '2025-06-15T00:00:00Z', role: 'AI/ML Engineer', skills: ['Python', 'PyTorch'] },
  { id: 'p-003', nickname: '박지훈', email: 'jihoon@daker.ai', teamCodes: [], joinedAt: '2025-07-01T00:00:00Z', role: 'Backend Developer', skills: ['Go', 'PostgreSQL'] },
  { id: 'p-004', nickname: '최수아', email: 'sua@daker.ai', teamCodes: [], joinedAt: '2025-07-10T00:00:00Z', role: 'UX Designer', skills: ['Figma', 'Prototyping'] },
  { id: 'p-005', nickname: '정현우', email: 'hyunwoo@daker.ai', teamCodes: [], joinedAt: '2025-07-20T00:00:00Z', role: 'Cloud Engineer', skills: ['AWS', 'Kubernetes'] },
  { id: 'p-006', nickname: '강다은', email: 'daeun@daker.ai', teamCodes: [], joinedAt: '2025-08-01T00:00:00Z', role: 'Data Scientist', skills: ['Python', 'Tableau'] },
  { id: 'p-007', nickname: '윤준혁', email: 'junhyeok@daker.ai', teamCodes: [], joinedAt: '2025-08-15T00:00:00Z', role: 'Security Engineer', skills: ['Penetration Testing', 'CTF'] },
  { id: 'p-008', nickname: '임채원', email: 'chaewon@daker.ai', teamCodes: [], joinedAt: '2025-08-20T00:00:00Z', role: 'PM', skills: ['Agile', 'User Research'] },
  { id: 'p-009', nickname: '한소희', email: 'sohee@daker.ai', teamCodes: [], joinedAt: '2025-09-01T00:00:00Z', role: 'Fullstack Developer', skills: ['Next.js', 'Node.js'] },
  { id: 'p-010', nickname: '오효진', email: 'hyojin@daker.ai', teamCodes: [], joinedAt: '2025-09-10T00:00:00Z', role: 'Mobile Developer', skills: ['React Native', 'Swift'] },
  { id: 'p-011', nickname: '서태양', email: 'taeyang@daker.ai', teamCodes: [], joinedAt: '2025-09-20T00:00:00Z', role: 'DevOps Engineer', skills: ['Docker', 'CI/CD'] },
  { id: 'p-012', nickname: '남지은', email: 'jieun@daker.ai', teamCodes: [], joinedAt: '2025-10-01T00:00:00Z', role: 'AI Researcher', skills: ['LLM', 'LangChain'] },
  { id: 'p-013', nickname: '황준서', email: 'junseo@daker.ai', teamCodes: [], joinedAt: '2025-10-10T00:00:00Z', role: 'Blockchain Dev', skills: ['Solidity', 'Web3.js'] },
  { id: 'p-014', nickname: '변하은', email: 'haeun@daker.ai', teamCodes: [], joinedAt: '2025-10-20T00:00:00Z', role: 'Data Engineer', skills: ['Spark', 'Kafka'] },
  { id: 'p-015', nickname: '문성민', email: 'sungmin@daker.ai', teamCodes: [], joinedAt: '2025-11-01T00:00:00Z', role: 'Embedded Dev', skills: ['C++', 'IoT'] },
  { id: 'p-016', nickname: '유나연', email: 'nayeon@daker.ai', teamCodes: [], joinedAt: '2025-11-10T00:00:00Z', role: 'Game Developer', skills: ['Unity', 'C#'] },
  { id: 'p-017', nickname: '조건우', email: 'gunwoo@daker.ai', teamCodes: [], joinedAt: '2025-11-20T00:00:00Z', role: 'SRE', skills: ['Prometheus', 'Grafana'] },
  { id: 'p-018', nickname: '신예린', email: 'yerin@daker.ai', teamCodes: [], joinedAt: '2025-12-01T00:00:00Z', role: 'QA Engineer', skills: ['Selenium', 'Jest'] },
  { id: 'p-019', nickname: '권태민', email: 'taemin@daker.ai', teamCodes: [], joinedAt: '2025-12-10T00:00:00Z', role: 'Startup Founder', skills: ['Pitching', 'BizDev'] },
  { id: 'p-020', nickname: '류하린', email: 'harin@daker.ai', teamCodes: [], joinedAt: '2025-12-20T00:00:00Z', role: 'Growth Hacker', skills: ['SEO', 'Analytics'] },
  { id: 'p-021', nickname: '노재원', email: 'jaewon@daker.ai', teamCodes: [], joinedAt: '2026-01-01T00:00:00Z', role: 'ML Ops', skills: ['MLflow', 'Kubeflow'] },
  { id: 'p-022', nickname: '장수현', email: 'suhyeon@daker.ai', teamCodes: [], joinedAt: '2026-01-10T00:00:00Z', role: 'Graphic Designer', skills: ['Illustrator', 'Blender'] },
  { id: 'p-023', nickname: '배민재', email: 'minjae@daker.ai', teamCodes: [], joinedAt: '2026-01-20T00:00:00Z', role: 'AR/VR Developer', skills: ['ARKit', 'WebXR'] },
  { id: 'p-024', nickname: '석지원', email: 'jiwon@daker.ai', teamCodes: [], joinedAt: '2026-02-01T00:00:00Z', role: 'FinTech Dev', skills: ['Stripe API', 'Blockchain'] },
  { id: 'p-025', nickname: '진예나', email: 'yena@daker.ai', teamCodes: [], joinedAt: '2026-02-10T00:00:00Z', role: 'Healthcare IT', skills: ['HL7', 'FHIR'] },
  { id: 'p-026', nickname: '공민수', email: 'minsu@daker.ai', teamCodes: [], joinedAt: '2026-02-20T00:00:00Z', role: 'Open Source Contrib', skills: ['Git', 'Linux'] },
  { id: 'p-027', nickname: '홍유라', email: 'yura@daker.ai', teamCodes: [], joinedAt: '2026-03-01T00:00:00Z', role: 'Content Creator', skills: ['Video Editing', 'Copywriting'] },
  { id: 'p-028', nickname: '백강현', email: 'ganghyeon@daker.ai', teamCodes: [], joinedAt: '2026-03-10T00:00:00Z', role: 'Network Engineer', skills: ['TCP/IP', 'Firewall'] },
  { id: 'p-029', nickname: '천민호', email: 'minho@daker.ai', teamCodes: [], joinedAt: '2026-03-15T00:00:00Z', role: 'Systems Engineer', skills: ['Rust', 'Assembly'] },
  { id: 'p-030', nickname: '편유나', email: 'yuna@daker.ai', teamCodes: [], joinedAt: '2026-03-20T00:00:00Z', role: 'Bioinformatics', skills: ['R', 'BioPython'] },
];

// 각 해커톤별로 참가한 페르소나 팀 이름을 미리 정의 (리더보드 팀명과 1:1 매칭)
// 페르소나 여정: 전공성에 맞는 대회에 참가, 여러 대회에 복수 출전기록 보유
const hackathonTeamMap: Record<string, { leaderId: string; teamName: string }[]> = {
  // ======= 진행 중 해커톤 =======
  'gen-ai-startup-challenge': [
    { leaderId: 'p-001', teamName: 'Prompt Wizards' },
    { leaderId: 'p-002', teamName: 'Neural Nomads' },
    { leaderId: 'p-003', teamName: 'Vibe Engineers' },
    { leaderId: 'p-019', teamName: 'Semantic Raiders' },
    { leaderId: 'p-020', teamName: 'Data Driven' },
  ],
  'cloud-native-modernization': [
    { leaderId: 'p-005', teamName: 'Cloud Runners' },
    { leaderId: 'p-011', teamName: 'Deploy Fast' },
    { leaderId: 'p-017', teamName: 'Zero Latency' },
  ],
  'daker-handover-2026-03': [
    { leaderId: 'p-009', teamName: '명세서 저격수' },
    { leaderId: 'p-008', teamName: '바이브 장인들' },
  ],
  'ux-ui-redesign-2026': [
    { leaderId: 'p-004', teamName: 'Pixel Perfect' },
    { leaderId: 'p-022', teamName: 'Open Canvas' },
  ],
  'fintech-security-hack': [
    { leaderId: 'p-024', teamName: 'Cipher Squad' },
    { leaderId: 'p-007', teamName: 'Epsilon Secure' },
  ],
  'metabolism-healthcare-2026': [
    { leaderId: 'p-025', teamName: 'Quantum Leap' },
    { leaderId: 'p-006', teamName: 'Insight Seekers' },
  ],
  // ======= 종료된 해커톤 — 페르소나 여정 제대로 설계 =======
  'aimers-8-model-lite': [
    // AI/ML 전공가들의 모델 경막
    { leaderId: 'p-002', teamName: 'Alpha ML' },          // 이서연 (AI/ML 엔지니어) → 1위 우승
    { leaderId: 'p-012', teamName: 'Beta Opt' },           // 남지은 (AI 연구자) → 2위
    { leaderId: 'p-021', teamName: 'Gamma Vision' },       // 노재원 (MLOps) → 3위
    { leaderId: 'p-006', teamName: 'Delta Analytics' },   // 강다은 (데이터 사이언티스트) → 4위
    { leaderId: 'p-025', teamName: 'Epsilon Labs' },       // 진예나 (헬스케어 IT) → 5위
    { leaderId: 'p-014', teamName: 'Data Raptors' },      // 변하은 (데이터 엔지니어) → 6위
    { leaderId: 'p-030', teamName: 'Bio ML' },             // 편유나 (생정보 분석) → 7위
  ],
  'public-data-2025-final': [
    // 공공데이터 분석 대회 — 데이터/기획 전공가들
    { leaderId: 'p-006', teamName: '공조팀' },             // 강다은 → 1위 우승
    { leaderId: 'p-014', teamName: 'Delta Stream' },       // 변하은 → 2위
    { leaderId: 'p-020', teamName: 'Growth Lens' },        // 류하린 (Growth Hacker) → 3위
    { leaderId: 'p-001', teamName: 'Analytics Pro' },      // 김민준 (Frontend+분석) → 4위
    { leaderId: 'p-010', teamName: 'Mobile Data' },        // 오효진 (Mobile Dev) → 5위
    { leaderId: 'p-027', teamName: 'Story Data' },         // 홍유라 (Content) → 6위
  ],
  'university-sw-challenge-2025': [
    // SW 창작 첼린지 — 전공 다양한 대학적 대회
    { leaderId: 'p-001', teamName: 'Best Team SW-1' },     // 김민준 (Frontend) → 1위 우승
    // 강유진 → 2위 (따로 T-OLD-UNI-001로 선언)
    { leaderId: 'p-009', teamName: 'Runner Team SW-2' },   // 한소희 (Fullstack) → 3위
    { leaderId: 'p-003', teamName: 'Logic Gates' },        // 박지훈 (Backend) → 4위
    { leaderId: 'p-018', teamName: 'QA Masters' },         // 신예린 (QA) → 5위
    { leaderId: 'p-013', teamName: 'Chain Code' },         // 황준서 (Blockchain) → 6위
    { leaderId: 'p-017', teamName: 'Ops Masters' },        // 조건우 (SRE) → 7위
    { leaderId: 'p-010', teamName: 'Mobile First' },       // 오효진 (Mobile) → 8위
  ],
  'metaverse-camp-2025': [
    // 메타버스 현쩠성 포켌스 대회
    { leaderId: 'p-016', teamName: 'Gamma Vision' },       // 유나연 (Game Dev) → 1위 우승
    { leaderId: 'p-023', teamName: 'Byte Brigade' },       // 배민재 (AR/VR) → 2위
    { leaderId: 'p-010', teamName: 'Mobile World' },       // 오효진 (Mobile) → 3위
    { leaderId: 'p-022', teamName: 'Pixel Art' },          // 장수현 (Designer) → 4위
    { leaderId: 'p-004', teamName: 'XR Design' },          // 최수아 (UX) → 5위
    { leaderId: 'p-019', teamName: 'Pitch Kings' },        // 권태민 (Startup) → 6위
    // 강유진 → 15위 (따로 T-OLD-META-001로 선언)
  ],
  'opensource-mentoring-2025': [
    // 오픈소스 활성화 멘토링 프로그램
    { leaderId: 'p-026', teamName: 'Open Canvas' },        // 공민수 (OS 기여자) → 1위
    { leaderId: 'p-029', teamName: 'Rust Belt' },          // 천민호 (Systems Eng) → 2위
    { leaderId: 'p-013', teamName: 'Blockchain OS' },      // 황준서 (Blockchain) → 3위
    { leaderId: 'p-017', teamName: 'Ops Stack' },          // 조건우 (SRE) → 4위
    { leaderId: 'p-011', teamName: 'CI/CD Masters' },      // 서태양 (DevOps) → 5위
    { leaderId: 'p-003', teamName: 'Backend Guild' },      // 박지훈 (Backend) → 6위
  ],
  'iot-smart-home-2025': [
    // IoT 스마트 홈 확장 프로젝트
    { leaderId: 'p-015', teamName: 'Loop Masters' },       // 문성민 (Embedded Dev) → 1위
    { leaderId: 'p-028', teamName: 'Signal Noise' },       // 백강현 (Network Eng) → 2위
    { leaderId: 'p-005', teamName: 'Cloud IoT' },          // 정현우 (Cloud) → 3위
    { leaderId: 'p-017', teamName: 'SRE Smart' },          // 조건우 (SRE) → 4위
    { leaderId: 'p-029', teamName: 'Rust Systems' },       // 천민호 (Systems) → 5위
    { leaderId: 'p-021', teamName: 'MLOps Home' },         // 노재원 (MLOps) → 6위
  ],
  'dos-operation-hack-2025': [
    // 전쇄식 운영 해커톤
    { leaderId: 'p-019', teamName: 'Refactor Kings' },     // 권태민 (Startup Founder) → 1위
    { leaderId: 'p-008', teamName: 'Sync Tank' },          // 임채원 (PM) → 2위
    { leaderId: 'p-011', teamName: 'Deploy Fast' },        // 서태양 (DevOps) → 3위
    { leaderId: 'p-007', teamName: 'Cipher Strike' },      // 윤준혁 (Security) → 4위
    { leaderId: 'p-017', teamName: 'Ops Guard' },          // 조건우 (SRE) → 5위
    { leaderId: 'p-005', teamName: 'Cloud Fortress' },     // 정현우 (Cloud) → 6위
  ],
  'cyber-security-grand-2025': [
    // 대한민국 에스 보안 첼린지
    { leaderId: 'p-007', teamName: 'Dark Pattern' },       // 윤준혁 (Security) → 1위
    { leaderId: 'p-028', teamName: 'Type Safe' },          // 백강현 (Network) → 2위
    { leaderId: 'p-013', teamName: 'Chain Breaker' },      // 황준서 (Blockchain) → 3위
    { leaderId: 'p-024', teamName: 'Fintech Guard' },      // 석지원 (FinTech) → 4위
    { leaderId: 'p-029', teamName: 'Null Sector' },        // 천민호 (Systems) → 5위
    { leaderId: 'p-015', teamName: 'Embedded Shield' },    // 문성민 (Embedded) → 6위
    { leaderId: 'p-003', teamName: 'Backend Firewall' },   // 박지훈 (Backend) → 7위
  ],
};

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
  {
    teamCode: 'T-YUJIN-SOLO-01',
    hackathonSlug: 'gen-ai-startup-challenge',
    name: '강유진 (개인)',
    isOpen: false,
    isPrivate: true,
    isSolo: true,
    leaderId: 'user-001-yujin',
    memberCount: 1,
    maxTeamSize: 4, // 개인참가
    lookingFor: [],
    intro: '단독으로 끝장냅니다!',
    contact: { type: 'link', url: 'https://vibe.app' },
    createdAt: '2026-03-25T10:00:00Z',
    progressStatus: 'designing',
    progressPercent: 60,
  },
  {
    teamCode: 'T-OLD-UNI-001',
    hackathonSlug: 'university-sw-challenge-2025',
    name: '강유진 Team',
    isOpen: false,
    isPrivate: true,
    leaderId: 'user-001-yujin',
    memberCount: 4,
    maxTeamSize: 4,
    lookingFor: [],
    intro: '성공적으로 마쳤습니다.',
    contact: { type: 'link', url: 'https://vibe.app' },
    createdAt: '2025-11-01T10:00:00Z',
    progressStatus: 'completed',
    progressPercent: 100,
  },
  {
    teamCode: 'T-OLD-META-001',
    hackathonSlug: 'metaverse-camp-2025',
    name: '강유진 Team',
    isOpen: false,
    isPrivate: true,
    leaderId: 'user-001-yujin',
    memberCount: 5,
    maxTeamSize: 5,
    lookingFor: [],
    intro: '메타버스 캠프 수료 완료!',
    contact: { type: 'link', url: 'https://vibe.app' },
    createdAt: '2025-09-01T10:00:00Z',
    progressStatus: 'completed',
    progressPercent: 100,
  },
  // 페르소나 팀 (hackathonTeamMap에 정의된 팀들 — leaderId 실제 연결)
  ...Object.entries(hackathonTeamMap).flatMap(([slug, mappings]) =>
    mappings.map(({ leaderId, teamName }, i) => ({
      teamCode: `T-PERSONA-${slug.slice(0, 4).toUpperCase()}-${i + 1}`,
      hackathonSlug: slug,
      name: teamName,
      isOpen: ['Prompt Wizards', 'Data Driven', 'Pixel Perfect'].includes(teamName),
      isPrivate: false,
      leaderId,
      memberCount: 3,
      maxTeamSize: 5,
      lookingFor: ['Prompt Wizards', 'Data Driven', 'Pixel Perfect'].includes(teamName)
        ? [
            { position: 'Frontend', description: 'React/Next.js 개발자' },
            { position: 'Designer', description: 'UI/UX 디자이너' }
          ]
        : ([] as { position: string; description: string }[]),
      intro: introLibrary[i % introLibrary.length],
      contact: { type: 'link' as const, url: '#' },
      createdAt: slug.includes('2025') ? '2025-06-01T00:00:00Z' : '2026-02-01T00:00:00Z',
      progressStatus: 'completed' as const,
      progressPercent: 100,
    }))
  ),
  // Ongoing Hackathons Teams (추가 더미 팀, leaderId는 페르소나 풀에서 순환)
  ...['gen-ai-startup-challenge', 'cloud-native-modernization', 'daker-handover-2026-03', 'ux-ui-redesign-2026', 'fintech-security-hack', 'metabolism-healthcare-2026'].flatMap((slug, sIdx) =>
    Array.from({ length: slug === 'daker-handover-2026-03' ? 35 : 25 + sIdx * 5 }).map((_, i) => {
      // hackathonTeamMap에 이미 있는 팀은 skip (중복 방지)
      const existingNames = (hackathonTeamMap[slug] || []).map(m => m.teamName);
      const name = teamNameLibrary[(i + sIdx + 5) % teamNameLibrary.length] + (i >= teamNameLibrary.length ? ` #${Math.floor(i / teamNameLibrary.length) + 1}` : '');
      if (existingNames.includes(name)) return null;
      const personaIdx = (i + sIdx * 7 + 3) % personaPool.length;
      return {
        teamCode: `T-${slug.slice(0, 3).toUpperCase()}-${i + 1}`,
        hackathonSlug: slug,
        name,
        isOpen: i % 3 === 0,
        isPrivate: i % 5 === 0,
        leaderId: personaPool[personaIdx].id,
        memberCount: (i % 3) + 2,
        maxTeamSize: 4,
        lookingFor: i % 3 === 0 ? (() => {
          const positionPool = [
            { position: 'Designer', description: 'UX/UI 디자인 담당' },
            { position: 'Frontend', description: 'React/Next.js 개발' },
            { position: 'Backend', description: 'API 및 DB 설계' },
            { position: 'PM', description: '일정 관리 및 기획 조율' },
            { position: 'AI/ML', description: 'AI 모델 개발 및 실험' },
            { position: 'Data Analyst', description: '데이터 분석 및 시각화' },
            { position: 'Security', description: '보안 취약점 분석' },
            { position: 'Fullstack', description: '프론트·백엔드 전담' },
          ];
          return [positionPool[(i + sIdx * 3) % positionPool.length]];
        })() : [],
        intro: introLibrary[(i + sIdx) % introLibrary.length],
        contact: { type: 'link' as const, url: '#' },
        createdAt: '2026-03-10T10:00:00Z',
        progressStatus: (i % 4 === 0 ? 'developing' : i % 4 === 1 ? 'designing' : 'planning') as any,
        progressPercent: (i % 4) * 25,
      };
    }).filter(Boolean) as Team[]
  ),
  // Ended Hackathons Teams — hackathonTeamMap의 페르소나 팀만 사용 (더미 팀 제거)
  // 강유진 팀들은 위에서 직접 선언됨 (T-OLD-UNI-001, T-OLD-META-001)
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
  {
    id: 'sub-yujin-01',
    hackathonSlug: 'gen-ai-startup-challenge',
    teamCode: 'T-YUJIN-SOLO-01',
    teamName: '강유진 (개인)',
    status: 'submitted',
    artifacts: [{ type: 'pdf', key: 'plan', content: 'yujin_plan.pdf', uploadedAt: '2026-03-27T09:58:00Z' }],
    notes: '기획서 제출',
    submittedAt: '2026-03-27T09:58:00Z',
  },
  {
    id: 'sub-yujin-old-01',
    hackathonSlug: 'university-sw-challenge-2025',
    teamCode: 'T-OLD-UNI-001',
    teamName: '강유진 Team',
    status: 'submitted',
    artifacts: [
      { type: 'pdf', key: 'plan', content: 'plan.pdf', uploadedAt: '2025-11-20T09:58:00Z' },
      { type: 'url', key: 'web', content: 'https://vibe.app', uploadedAt: '2025-12-05T09:58:00Z' }
    ],
    notes: '완료',
    submittedAt: '2025-12-05T09:58:00Z',
  },
  {
    id: 'sub-yujin-old-02',
    hackathonSlug: 'metaverse-camp-2025',
    teamCode: 'T-OLD-META-001',
    teamName: '강유진 Team',
    status: 'submitted',
    artifacts: [{ type: 'url', key: 'task', content: 'https://vibe.app', uploadedAt: '2025-10-01T09:58:00Z' }],
    notes: '완료',
    submittedAt: '2025-10-01T09:58:00Z',
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
  // UX-UI (2 stages: research, figma)
  ...Array.from({ length: 25 }).flatMap((_, i) => {
    const arts: any[] = [];
    if (i < 20) arts.push({ type: 'pdf', key: 'research', content: 'research.pdf', uploadedAt: '2026-04-05T10:00:00Z' });
    if (i < 5) arts.push({ type: 'url', key: 'figma', content: 'https://figma.com/file', uploadedAt: '2026-04-15T10:00:00Z' });

    if (arts.length === 0) return [];
    return [{
      id: `sub-ux-${i}`,
      hackathonSlug: 'ux-ui-redesign-2026',
      teamCode: `T-UX--${i + 1}`,
      teamName: `UI Design Team ${i + 1}`,
      status: 'submitted' as const,
      artifacts: arts,
      notes: '디자인 중',
      submittedAt: arts[arts.length - 1].uploadedAt,
    }];
  }),
  // Fintech (2 stages: threat, patch)
  ...Array.from({ length: 20 }).flatMap((_, i) => {
    const arts: any[] = [];
    if (i < 15) arts.push({ type: 'pdf', key: 'threat', content: 'threat.pdf', uploadedAt: '2026-04-05T10:00:00Z' });
    if (i < 8) arts.push({ type: 'url', key: 'patch', content: 'https://github.com/patch', uploadedAt: '2026-04-15T10:00:00Z' });

    if (arts.length === 0) return [];
    return [{
      id: `sub-fin-${i}`,
      hackathonSlug: 'fintech-security-hack',
      teamCode: `T-FIN-${i + 1}`,
      teamName: `Fintech Sec ${i + 1}`,
      status: 'submitted' as const,
      artifacts: arts,
      notes: '보안 점검',
      submittedAt: arts[arts.length - 1].uploadedAt,
    }];
  }),
  // Metabolism (2 stages: dataset, model)
  ...Array.from({ length: 15 }).flatMap((_, i) => {
    const arts: any[] = [];
    if (i < 10) arts.push({ type: 'url', key: 'dataset', content: 'https://huggingface.co/dataset', uploadedAt: '2026-04-10T10:00:00Z' });

    if (arts.length === 0) return [];
    return [{
      id: `sub-met-${i}`,
      hackathonSlug: 'metabolism-healthcare-2026',
      teamCode: `T-MET-${i + 1}`,
      teamName: `Health AI ${i + 1}`,
      status: 'submitted' as const,
      artifacts: arts,
      notes: '데이터 셋업',
      submittedAt: arts[arts.length - 1].uploadedAt,
    }];
  }),
  // Ended Hackathons (100% submission)
  ...['aimers-8-model-lite', 'public-data-2025-final', 'university-sw-challenge-2025', 'metaverse-camp-2025', 'opensource-mentoring-2025', 'iot-smart-home-2025', 'dos-operation-hack-2025', 'cyber-security-grand-2025'].flatMap((slug, sIdx) =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: `sub-old-${slug}-${i}`,
      hackathonSlug: slug,
      teamCode: `T-OLD-${slug.slice(0, 3).toUpperCase()}-${i + 1}`,
      teamName: i === 0 ? (slug === 'aimers-8-model-lite' ? 'Alpha ML' : slug === 'public-data-2025-final' ? '공조팀' : `Best Team ${sIdx + i}`) :
        i === 1 ? (slug === 'aimers-8-model-lite' ? 'Beta Opt' : `Runner Team ${sIdx + i}`) :
          teamNameLibrary[(i + sIdx + 10) % teamNameLibrary.length] + ` (E)`,
      status: 'submitted' as const,
      artifacts: [
        { type: 'url', key: slug === 'aimers-8-model-lite' ? 'final' : 'report', content: 'https://result.app', uploadedAt: '2025-12-01T10:00:00Z' }
      ],
      notes: '최종 완료',
      submittedAt: '2025-12-01T10:00:00Z',
    }))
  ),
];

// ─── Leaderboards (팀명 = teams.name 과 1:1 매칭) ───────────────
// 실시간 연동 대회는 rank/score null, 종료 대회는 rank/score 고정
export const leaderboards: Record<string, Leaderboard> = {
  'gen-ai-startup-challenge': {
    updatedAt: new Date().toISOString(),
    entries: [
      // 페르소나 팀 (hackathonTeamMap 기반)
      { rank: null, teamName: 'Prompt Wizards', score: null, votes: 380, submittedAt: '2026-03-20T10:00:00Z' },
      { rank: null, teamName: 'Neural Nomads', score: null, votes: 310, submittedAt: '2026-03-20T10:00:00Z' },
      { rank: null, teamName: 'Vibe Engineers', score: null, votes: 290, submittedAt: '2026-03-20T10:00:00Z' },
      { rank: null, teamName: '강유진 (개인)', score: null, votes: 240, submittedAt: '2026-03-27T09:58:00Z' },
      { rank: null, teamName: 'Semantic Raiders', score: null, votes: 200, submittedAt: '2026-03-20T10:00:00Z' },
      { rank: null, teamName: 'Data Driven', score: null, votes: 180, submittedAt: '2026-03-20T10:00:00Z' },
      ...Array.from({ length: 30 }).map((_, i) => ({
        rank: null,
        teamName: teamNameLibrary[(i + 6) % teamNameLibrary.length] + ` #${i + 1}`,
        score: null,
        votes: Math.max(10, 170 - i * 5),
        submittedAt: i < 26 ? '2026-03-20T10:00:00Z' : null,
      })),
    ],
  },
  'cloud-native-modernization': {
    updatedAt: '2026-04-01T10:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'Cloud Runners', score: 96.5, votes: 280, submittedAt: '2026-02-28T10:00:00Z' },
      { rank: 2, teamName: 'Deploy Fast', score: 91.0, votes: 220, submittedAt: '2026-02-28T11:00:00Z' },
      { rank: 3, teamName: 'Zero Latency', score: 85.5, votes: 190, submittedAt: '2026-02-28T12:00:00Z' },
      ...Array.from({ length: 22 }).map((_, i) => ({
        rank: i + 4,
        teamName: teamNameLibrary[(i + 3) % teamNameLibrary.length] + ` #${i + 1}`,
        score: Math.max(30, 82 - i * 2.3),
        votes: Math.max(10, 180 - i * 7),
        submittedAt: i < 18 ? '2026-02-28T10:00:00Z' : null,
      })),
    ],
  },
  'ux-ui-redesign-2026': {
    updatedAt: new Date().toISOString(),
    entries: [
      { rank: null, teamName: 'Pixel Perfect', score: null, votes: 230, submittedAt: '2026-04-05T10:00:00Z' },
      { rank: null, teamName: 'Open Canvas', score: null, votes: 180, submittedAt: '2026-04-05T10:00:00Z' },
      ...Array.from({ length: 20 }).map((_, i) => ({
        rank: null,
        teamName: teamNameLibrary[(i + 8) % teamNameLibrary.length] + ` D${i + 1}`,
        score: null,
        votes: Math.max(5, 170 - i * 8),
        submittedAt: i < 16 ? '2026-04-05T10:00:00Z' : null,
      })),
    ],
  },
  'fintech-security-hack': {
    updatedAt: new Date().toISOString(),
    entries: [
      { rank: null, teamName: 'Cipher Squad', score: null, votes: 190, submittedAt: '2026-04-05T10:00:00Z' },
      { rank: null, teamName: 'Epsilon Secure', score: null, votes: 160, submittedAt: '2026-04-05T10:00:00Z' },
      ...Array.from({ length: 16 }).map((_, i) => ({
        rank: null,
        teamName: `Fintech Team ${i + 1}`,
        score: null,
        votes: Math.max(5, 150 - i * 9),
        submittedAt: i < 13 ? '2026-04-05T10:00:00Z' : null,
      })),
    ],
  },
  'metabolism-healthcare-2026': {
    updatedAt: new Date().toISOString(),
    entries: [
      { rank: null, teamName: 'Quantum Leap', score: null, votes: 140, submittedAt: '2026-04-10T10:00:00Z' },
      { rank: null, teamName: 'Insight Seekers', score: null, votes: 110, submittedAt: '2026-04-10T10:00:00Z' },
      ...Array.from({ length: 12 }).map((_, i) => ({
        rank: null,
        teamName: `Health AI ${i + 1}`,
        score: null,
        votes: Math.max(5, 100 - i * 8),
        submittedAt: i < 8 ? '2026-04-10T10:00:00Z' : null,
      })),
    ],
  },
  'daker-handover-2026-03': {
    updatedAt: new Date().toISOString(),
    entries: [
      { rank: null, teamName: '명세서 저격수', score: null, votes: 452, submittedAt: '2026-03-28T15:00:00Z' },
      { rank: null, teamName: '바이브 장인들', score: null, votes: 312, submittedAt: '2026-03-25T14:30:00Z' },
      { rank: null, teamName: '404found', score: null, votes: 298, submittedAt: '2026-03-28T09:58:00Z' },
      ...Array.from({ length: 37 }).map((_, i) => ({
        rank: null,
        teamName: teamNameLibrary[(i + 4) % teamNameLibrary.length] + ` D${i + 1}`,
        score: null,
        votes: Math.max(5, 270 - i * 7),
        submittedAt: '2026-03-28T00:00:00Z',
      }))
    ],
  },
  'aimers-8-model-lite': {
    updatedAt: '2026-03-15T18:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'Alpha ML',        score: 98.5, votes: 312, submittedAt: '2026-02-24T10:00:00Z' },
      { rank: 2, teamName: 'Beta Opt',         score: 92.2, votes: 257, submittedAt: '2026-02-24T11:00:00Z' },
      { rank: 3, teamName: 'Gamma Vision',    score: 88.1, votes: 198, submittedAt: '2026-02-24T12:00:00Z' },
      { rank: 4, teamName: 'Delta Analytics', score: 84.0, votes: 155, submittedAt: '2026-02-24T12:30:00Z' },
      { rank: 5, teamName: 'Epsilon Labs',    score: 79.5, votes: 122, submittedAt: '2026-02-24T13:00:00Z' },
      { rank: 6, teamName: 'Data Raptors',    score: 74.8, votes: 98,  submittedAt: '2026-02-24T13:30:00Z' },
      { rank: 7, teamName: 'Bio ML',          score: 70.2, votes: 75,  submittedAt: '2026-02-24T14:00:00Z' },
    ],
  },
  'public-data-2025-final': {
    updatedAt: '2025-12-28T18:00:00+09:00',
    entries: [
      { rank: 1, teamName: '공조팀',        score: 99.0, votes: 481, submittedAt: '2025-12-10T10:00:00Z' },
      { rank: 2, teamName: 'Delta Stream',   score: 95.5, votes: 389, submittedAt: '2025-12-10T11:00:00Z' },
      { rank: 3, teamName: 'Growth Lens',    score: 91.0, votes: 314, submittedAt: '2025-12-10T12:00:00Z' },
      { rank: 4, teamName: 'Analytics Pro',  score: 86.3, votes: 260, submittedAt: '2025-12-10T13:00:00Z' },
      { rank: 5, teamName: 'Mobile Data',    score: 81.7, votes: 198, submittedAt: '2025-12-10T14:00:00Z' },
      { rank: 6, teamName: 'Story Data',     score: 76.4, votes: 142, submittedAt: '2025-12-10T15:00:00Z' },
    ],
  },
  'university-sw-challenge-2025': {
    updatedAt: '2025-12-05T18:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'Best Team SW-1', score: 99.0, votes: 520, submittedAt: '2025-11-20T10:00:00Z' },
      { rank: 2, teamName: '강유진 Team',     score: 98.5, votes: 478, submittedAt: '2025-12-05T09:58:00Z' },
      { rank: 3, teamName: 'Runner Team SW-2', score: 95.0, votes: 401, submittedAt: '2025-11-20T11:00:00Z' },
      { rank: 4, teamName: 'Logic Gates',    score: 91.0, votes: 344, submittedAt: '2025-11-20T12:00:00Z' },
      { rank: 5, teamName: 'QA Masters',     score: 86.5, votes: 289, submittedAt: '2025-11-20T13:00:00Z' },
      { rank: 6, teamName: 'Chain Code',     score: 81.3, votes: 230, submittedAt: '2025-11-20T14:00:00Z' },
      { rank: 7, teamName: 'Ops Masters',    score: 76.8, votes: 177, submittedAt: '2025-11-20T15:00:00Z' },
      { rank: 8, teamName: 'Mobile First',   score: 71.2, votes: 124, submittedAt: '2025-11-20T16:00:00Z' },
    ],
  },
  'metaverse-camp-2025': {
    updatedAt: '2025-10-15T18:00:00+09:00',
    entries: [
      { rank: 1,  teamName: 'Gamma Vision',  score: 97.0, votes: 588, submittedAt: '2025-10-01T10:00:00Z' },
      { rank: 2,  teamName: 'Byte Brigade',  score: 93.5, votes: 512, submittedAt: '2025-10-01T11:00:00Z' },
      { rank: 3,  teamName: 'Mobile World',  score: 89.0, votes: 441, submittedAt: '2025-10-01T12:00:00Z' },
      { rank: 4,  teamName: 'Pixel Art',     score: 84.5, votes: 370, submittedAt: '2025-10-01T13:00:00Z' },
      { rank: 5,  teamName: 'XR Design',     score: 80.0, votes: 303, submittedAt: '2025-10-01T14:00:00Z' },
      { rank: 6,  teamName: 'Pitch Kings',   score: 75.5, votes: 228, submittedAt: '2025-10-01T15:00:00Z' },
      { rank: 15, teamName: '강유진 Team',   score: 48.0, votes: 67,  submittedAt: '2025-10-01T09:58:00Z' },
    ],
  },
  'opensource-mentoring-2025': {
    updatedAt: '2025-09-30T18:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'Open Canvas',    score: 96.0, votes: 392, submittedAt: '2025-09-15T10:00:00Z' },
      { rank: 2, teamName: 'Rust Belt',      score: 91.0, votes: 318, submittedAt: '2025-09-15T11:00:00Z' },
      { rank: 3, teamName: 'Blockchain OS',  score: 86.5, votes: 257, submittedAt: '2025-09-15T12:00:00Z' },
      { rank: 4, teamName: 'Ops Stack',      score: 81.0, votes: 198, submittedAt: '2025-09-15T13:00:00Z' },
      { rank: 5, teamName: 'CI/CD Masters',  score: 75.8, votes: 147, submittedAt: '2025-09-15T14:00:00Z' },
      { rank: 6, teamName: 'Backend Guild',  score: 70.3, votes: 101, submittedAt: '2025-09-15T15:00:00Z' },
    ],
  },
  'iot-smart-home-2025': {
    updatedAt: '2025-08-25T18:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'Loop Masters',  score: 95.0, votes: 431, submittedAt: '2025-08-10T10:00:00Z' },
      { rank: 2, teamName: 'Signal Noise',  score: 89.0, votes: 355, submittedAt: '2025-08-10T11:00:00Z' },
      { rank: 3, teamName: 'Cloud IoT',     score: 83.5, votes: 288, submittedAt: '2025-08-10T12:00:00Z' },
      { rank: 4, teamName: 'SRE Smart',     score: 77.2, votes: 223, submittedAt: '2025-08-10T13:00:00Z' },
      { rank: 5, teamName: 'Rust Systems',  score: 71.0, votes: 167, submittedAt: '2025-08-10T14:00:00Z' },
      { rank: 6, teamName: 'MLOps Home',    score: 65.8, votes: 118, submittedAt: '2025-08-10T15:00:00Z' },
    ],
  },
  'dos-operation-hack-2025': {
    updatedAt: '2025-07-20T18:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'Refactor Kings',   score: 97.0, votes: 512, submittedAt: '2025-07-05T10:00:00Z' },
      { rank: 2, teamName: 'Sync Tank',        score: 92.0, votes: 430, submittedAt: '2025-07-05T11:00:00Z' },
      { rank: 3, teamName: 'Deploy Fast',      score: 87.5, votes: 350, submittedAt: '2025-07-05T12:00:00Z' },
      { rank: 4, teamName: 'Cipher Strike',    score: 82.2, votes: 278, submittedAt: '2025-07-05T13:00:00Z' },
      { rank: 5, teamName: 'Ops Guard',        score: 77.0, votes: 210, submittedAt: '2025-07-05T14:00:00Z' },
      { rank: 6, teamName: 'Cloud Fortress',   score: 71.3, votes: 149, submittedAt: '2025-07-05T15:00:00Z' },
    ],
  },
  'cyber-security-grand-2025': {
    updatedAt: '2025-06-25T18:00:00+09:00',
    entries: [
      { rank: 1, teamName: 'Dark Pattern',     score: 99.0, votes: 712, submittedAt: '2025-06-10T10:00:00Z' },
      { rank: 2, teamName: 'Type Safe',        score: 94.0, votes: 618, submittedAt: '2025-06-10T11:00:00Z' },
      { rank: 3, teamName: 'Chain Breaker',    score: 89.5, votes: 534, submittedAt: '2025-06-10T12:00:00Z' },
      { rank: 4, teamName: 'Fintech Guard',    score: 84.2, votes: 441, submittedAt: '2025-06-10T13:00:00Z' },
      { rank: 5, teamName: 'Null Sector',      score: 79.1, votes: 358, submittedAt: '2025-06-10T14:00:00Z' },
      { rank: 6, teamName: 'Embedded Shield',  score: 74.0, votes: 278, submittedAt: '2025-06-10T15:00:00Z' },
      { rank: 7, teamName: 'Backend Firewall', score: 69.5, votes: 201, submittedAt: '2025-06-10T16:00:00Z' },
    ],
  },
};

// ─── User Profiles (AI 매칭용, personaPool과 별도) ──────────────
// AI 팀 매칭 UI에 사용되는 상세 프로필 (personaPool이 메인 소스)
export const users: UserProfile[] = personaPool;

// ─── Current User ──────────────────
export const currentUser: CurrentUser = {
  id: 'user-001-yujin',
  nickname: '강유진',
  email: 'yujin.kang@daker.ai',
  teamCodes: ['T-HANDOVER-01', 'T-YUJIN-SOLO-01', 'T-OLD-UNI-001', 'T-OLD-META-001'],
  joinedAt: '2026-01-15T10:00:00Z',
  bookmarkedSlugs: ['daker-handover-2026-03', 'gen-ai-startup-challenge'],
  role: '서비스기획자',
  preferredTypes: ['서비스기획', '데이터/AI'],
  skills: ['Figma', 'Notion', 'PRD 작성'],
  pointHistory: [{ id: 'ph-1', description: '참가 보너스', points: 100, date: '2026-01-15T10:00:00Z' }],
};

// rankings 배열은 제거됨 — useRankingStore가 personaPool + currentUser 기반으로 실시간 산출
export const rankings: RankingUser[] = [];

export const boards = [
  { id: 'p1', teamCode: 'T-HANDOVER-01', authorNickname: '강유진', content: '최종 제출 완료!', topic: '공지', color: 'bg-emerald-100', createdAt: '2026-03-29T10:00:00Z', likes: 5 },
];

const availabilityPatterns = [
  '평일 20:00~24:00 집중, 주말은 반나절씩 대응 가능합니다.',
  '오전 짧은 싱크 후 저녁 메이킹 세션 중심으로 움직입니다.',
  '야간 작업 비중이 높고, 마감 주간에는 주말도 유동적으로 맞출 수 있습니다.',
  '점심 전후 체크인과 밤 시간대 실작업 위주로 합을 맞추고 있습니다.',
  '평일에는 비동기 협업, 주말에는 2~3시간씩 몰아서 진행하는 패턴입니다.',
];

const progressNarratives = {
  planning: [
    '문제 정의와 타깃 사용자 페르소나를 정리하는 중입니다. 이번 주 안에 핵심 가설과 MVP 범위를 확정하려고 합니다.',
    '아이디어 후보를 압축했고, 지금은 기능 우선순위와 역할 분담을 맞추는 단계입니다. 초반 방향 설계에 함께할 분이 필요합니다.',
  ],
  designing: [
    '핵심 플로우와 화면 구조를 잡아두었고, 프로토타입 디테일을 다듬는 중입니다. 실제 구현 관점에서 함께 설계 보완이 필요합니다.',
    '와이어프레임과 사용자 시나리오는 정리됐습니다. 지금은 화면 완성도와 개발 연결성을 높이는 단계입니다.',
  ],
  developing: [
    '핵심 기능 구현에 들어갔고, 데모 기준으로 우선순위를 나눠 병렬 작업 중입니다. 지금 합류하면 바로 맡을 수 있는 작업이 있습니다.',
    '기본 뼈대는 올라왔고, 현재는 품질 보강과 제출용 시나리오 정리에 집중하고 있습니다. 마지막 완성도를 함께 끌어올릴 멤버를 찾고 있습니다.',
  ],
  completed: [
    '제출 가능한 수준까지 정리된 상태입니다. 이후 발표 자료와 마무리 디테일 중심으로 움직이고 있습니다.',
    '핵심 산출물은 완료했고, 현재는 회고나 후속 정리 위주로 운영 중입니다.',
  ],
} as const;

const buildAvailabilitySummary = (index: number, role?: string) => {
  const base = availabilityPatterns[index % availabilityPatterns.length];

  if (!role) return base;
  if (role.includes('Designer')) return `${base} 디자인 리뷰는 저녁 시간대에 빠르게 돌립니다.`;
  if (role.includes('AI') || role.includes('Data')) return `${base} 모델 실험과 데이터 확인은 낮 시간에도 간헐적으로 대응합니다.`;
  if (role.includes('Backend') || role.includes('Cloud') || role.includes('DevOps')) return `${base} 배포나 인프라 점검은 심야에도 짧게 커버 가능합니다.`;

  return `${base} 필요하면 짧은 스탠드업으로 의사결정을 빠르게 끝냅니다.`;
};

const buildProjectStatusDetail = (
  status: Team['progressStatus'],
  index: number,
  intro: string,
  lookingFor: { position: string; description: string }[]
) => {
  const narratives = progressNarratives[status || 'planning'];
  const recruitingHint =
    lookingFor.length > 0
      ? ` 특히 ${lookingFor.map((item) => item.position).join(', ')} 포지션이 들어오면 바로 병렬로 속도를 낼 수 있습니다.`
      : '';

  return `${narratives[index % narratives.length]}${recruitingHint} 팀 톤은 "${intro.slice(0, 28)}${intro.length > 28 ? '...' : ''}" 쪽에 가깝습니다.`;
};
