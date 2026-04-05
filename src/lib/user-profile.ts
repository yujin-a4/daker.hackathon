import type { CurrentUser } from '@/types';

function hasText(value?: string | null) {
  return (value || '').trim().length > 0;
}

export function hasMatchingProfile(user: CurrentUser | null | undefined) {
  if (!user) return false;

  const hasRole = hasText(user.role);
  const hasPreferredTypes = (user.preferredTypes || []).some((item) => hasText(item));
  const hasSkills = (user.skills || []).some((item) => hasText(item));

  return hasRole || hasPreferredTypes || hasSkills;
}
