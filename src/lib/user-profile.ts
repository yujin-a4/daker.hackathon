import type { CurrentUser } from '@/types';

function hasItems(values?: string[] | null) {
  return (values || []).some((value) => (value || '').trim().length > 0);
}

export function hasMatchingProfile(user: CurrentUser | null | undefined) {
  if (!user) return false;

  return (
    hasItems(user.primaryRoles) ||
    hasItems(user.interestDomains) ||
    hasItems(user.techStacks) ||
    hasItems(user.collaborationStrengths)
  );
}
