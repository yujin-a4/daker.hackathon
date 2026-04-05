import type { Hackathon, Team } from '@/types';
import { isHackathonRecruiting } from '@/lib/hackathon-utils';

export function isTeamRecruiting(team: Team, hackathon?: Hackathon | null) {
  if (!team.isOpen) return false;
  if (!team.hackathonSlug) return true;
  if (!hackathon) return false;
  return isHackathonRecruiting(hackathon);
}
