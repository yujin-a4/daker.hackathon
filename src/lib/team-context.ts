import type { Hackathon, Team } from '@/types';

type TeamContextFields = Pick<Team, 'availabilitySummary' | 'projectStatusDetail'>;

function hashText(value: string) {
  return Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function getVersionLabel(team: Team, hackathon?: Hackathon | null) {
  const salt = hashText(`${team.teamCode}-${team.name}`);
  const minor = (salt % 5) + 1;

  if (team.progressStatus === 'completed' || hackathon?.status === 'ended') {
    return `v1.0.${minor}`;
  }

  if (team.progressStatus === 'developing') {
    return `v0.9.${minor}`;
  }

  if (team.progressStatus === 'designing') {
    return `v0.5.${minor}`;
  }

  return `v0.2.${minor}`;
}

function getAvailabilitySummary(team: Team, hackathon?: Hackathon | null) {
  if (team.progressStatus === 'completed' || hackathon?.status === 'ended') {
    return '핵심 작업은 완료됐고, 현재는 회고 정리와 데모/질의 대응만 비정기적으로 진행 가능합니다.';
  }

  if (team.isSolo) {
    return '평일 21:00~24:00, 주말 오후 중심으로 작업합니다. 협업 슬롯은 없지만 피드백 반영은 빠르게 가능합니다.';
  }

  if (team.progressStatus === 'developing') {
    return team.isOpen
      ? '평일 20:00~01:00, 주말 13:00~23:00 작업 가능합니다. 신규 팀원 온보딩은 평일 밤과 토요일에 맞춰 진행합니다.'
      : '평일 20:00~01:00, 주말 13:00~23:00 집중 작업 중입니다. 마감 주간에는 오전 이슈 대응도 가능합니다.';
  }

  if (team.progressStatus === 'designing') {
    return team.isOpen
      ? '평일 19:30~23:30, 주말 14:00~20:00 작업 가능합니다. 합류 시 요구사항 싱크와 화면 리뷰 세션을 먼저 잡습니다.'
      : '평일 19:30~23:30, 주말 14:00~20:00 중심으로 설계와 화면 정의를 진행하고 있습니다.';
  }

  if (hackathon?.status === 'recruiting') {
    return '평일 20:00~23:30, 주말 오후 작업 가능합니다. 킥오프 이후에는 공통 회의 시간을 다시 고정할 예정입니다.';
  }

  return team.isOpen
    ? '평일 20:00~24:00, 주말 오후 작업 가능합니다. 합류 후 첫 1~2일은 역할 분담과 개발 환경 정리에 집중합니다.'
    : '평일 20:00~24:00, 주말 오후 작업 가능합니다. 현재는 기획 정리와 우선순위 확정 단계입니다.';
}

function getScenarioFocus(hackathon?: Hackathon | null) {
  switch (hackathon?.slug) {
    case 'gen-ai-startup-challenge':
      return '문제 정의, 사용자 시나리오, AI 워크플로우, 데모 랜딩 구성';
    case 'cloud-native-modernization':
      return '서비스 분리, API 계약 정리, 배포 구조 안정화, 운영 자동화';
    case 'daker-handover-2026-03':
      return '인수인계 문서 정리, 핵심 플로우 검증, 데모 품질 보강';
    case 'ux-ui-redesign-2026':
      return '사용자 여정 재설계, 핵심 화면 흐름, 프로토타입 완성도';
    case 'fintech-security-hack':
      return '인증/거래 시나리오, 위협 모델링, 로그 및 검증 체계';
    case 'metabolism-healthcare-2026':
      return '데이터 정제, 모델 실험, 해석 가능한 결과 화면 구성';
    case 'web3-defi-innovation':
      return '지갑 연결 흐름, 자산 이동 시나리오, 리스크 제어 로직';
    case 'lowcode-nocode-2026':
      return '자동화 플로우 설계, 운영 효율화, 비개발자 사용성';
    case 'gamification-startup-2026':
      return '핵심 동기부여 루프, 리텐션 가설, 초기 BM 검증';
    case 'green-tech-zero-waste':
      return '수거/분류 시나리오, 현장 데이터 수집, 운영 효율 개선';
    default:
      if (hackathon?.tags.includes('Security')) return '위협 시나리오 점검과 안정적인 사용자 흐름';
      if (hackathon?.tags.includes('AI') || hackathon?.tags.includes('ML')) return '데이터-모델-데모 연결이 자연스럽게 이어지는 흐름';
      if (hackathon?.tags.includes('UX') || hackathon?.tags.includes('UI')) return '핵심 사용자 여정과 인터랙션 완성도';
      return '문제 정의, 핵심 기능 우선순위, 제출물 완성도';
  }
}

function getIntegrationSentence(team: Team, hackathon?: Hackathon | null) {
  if (team.isSolo) {
    return '기획, 구현, 제출물을 한 사람이 순차적으로 묶어 처리해 의사결정 속도를 우선하고 있습니다.';
  }

  if (team.lookingFor.length > 0) {
    const roles = team.lookingFor.map((item) => item.position).join(', ');
    return `${roles} 포지션을 보강해 화면, API, 제출 산출물이 같은 기준으로 이어지도록 맞추는 중입니다.`;
  }

  if (hackathon?.slug === 'daker-handover-2026-03') {
    return '기존 코드 맥락, 인수인계 메모, 최종 데모 플로우가 끊기지 않도록 문서와 구현을 함께 정리하고 있습니다.';
  }

  return '기획 의도와 구현 범위, 제출 형식을 먼저 고정해 팀원별 병렬 작업이 어긋나지 않도록 관리하고 있습니다.';
}

function getVolatilitySentence(team: Team, hackathon?: Hackathon | null) {
  if (team.progressStatus === 'completed' || hackathon?.status === 'ended') {
    return '변동성은 낮고, 발표 대응이나 경미한 수정만 남아 있습니다.';
  }

  if (team.progressStatus === 'developing') {
    return '변동성은 중간 수준이며, 외부 연동이나 심사 기준 변화가 생기면 우선순위만 조정하는 방식으로 대응합니다.';
  }

  if (team.progressStatus === 'designing') {
    return '변동성은 다소 있는 편이라 사용자 흐름과 범위를 이번 주 안에 고정하는 것을 목표로 합니다.';
  }

  if (hackathon?.status === 'recruiting') {
    return '변동성은 높을 수 있어 킥오프 전까지 역할과 요구사항을 가볍게 유지하고 있습니다.';
  }

  return '변동성은 아직 있는 단계라 구현보다 요구사항 정합성과 역할 분리를 먼저 맞추고 있습니다.';
}

function getCurrentPhaseSentence(team: Team, versionLabel: string) {
  if (team.progressStatus === 'completed') {
    return `현재 제출 기준선은 ${versionLabel}로 고정했고 핵심 기능은 모두 마감했습니다.`;
  }

  if (team.progressStatus === 'developing') {
    return `현재 ${versionLabel} 기준 MVP를 통합 중이며, 데모에 필요한 핵심 기능은 동작 확인 단계입니다.`;
  }

  if (team.progressStatus === 'designing') {
    return `현재 ${versionLabel} 설계안까지 정리됐고, 와이어프레임과 역할 분담을 구현 가능한 수준으로 구체화하고 있습니다.`;
  }

  return `현재 ${versionLabel} 초안 단계이며, 문제 정의와 우선 기능 범위를 빠르게 좁히는 중입니다.`;
}

export function buildTeamContext(team: Team, hackathon?: Hackathon | null): TeamContextFields {
  const versionLabel = getVersionLabel(team, hackathon);
  const scenario = getScenarioFocus(hackathon);
  const currentPhase = getCurrentPhaseSentence(team, versionLabel);
  const integration = getIntegrationSentence(team, hackathon);
  const volatility = getVolatilitySentence(team, hackathon);

  return {
    availabilitySummary: getAvailabilitySummary(team, hackathon),
    projectStatusDetail: `${scenario} 중심으로 움직이고 있습니다. ${currentPhase} ${integration} ${volatility}`,
  };
}

export function enrichTeamsWithContext<T extends Team>(
  teams: T[],
  hackathons: Hackathon[],
  options?: { preserveExisting?: boolean }
) {
  const preserveExisting = options?.preserveExisting ?? false;

  return teams.map((team) => {
    const hackathon = team.hackathonSlug
      ? hackathons.find((item) => item.slug === team.hackathonSlug) ?? null
      : null;
    const generated = buildTeamContext(team, hackathon);

    return {
      ...team,
      availabilitySummary:
        preserveExisting && team.availabilitySummary?.trim()
          ? team.availabilitySummary
          : generated.availabilitySummary,
      projectStatusDetail:
        preserveExisting && team.projectStatusDetail?.trim()
          ? team.projectStatusDetail
          : generated.projectStatusDetail,
    };
  });
}

export function getTeamAvailabilitySummary(team: Team, hackathon?: Hackathon | null) {
  return team.availabilitySummary?.trim() || buildTeamContext(team, hackathon).availabilitySummary;
}

export function getTeamProjectStatusDetail(team: Team, hackathon?: Hackathon | null) {
  return team.projectStatusDetail?.trim() || buildTeamContext(team, hackathon).projectStatusDetail;
}
