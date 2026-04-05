'use client';

import type { Team } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import { getTeamComposition } from '@/lib/teamComposition';
import { Badge } from '@/components/ui/badge';

interface TeamCompositionSectionProps {
  team: Team;
  className?: string;
}

export default function TeamCompositionSection({ team, className }: TeamCompositionSectionProps) {
  const { allUsers, currentUser } = useUserStore();
  const composition = getTeamComposition(team, allUsers, currentUser);

  const roles = composition.members.flatMap((member) => member.primaryRoles || []);

  if (roles.length === 0 && composition.hiddenConfirmedCount === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h4 className="mb-2 text-sm font-medium text-muted-foreground">현재 참여중인 직무</h4>
      <div className="flex flex-wrap items-center gap-1.5">
        {roles.map((role, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
          >
            {role}
          </Badge>
        ))}
        {Array.from({ length: composition.hiddenConfirmedCount }).map((_, idx) => (
          <Badge
            key={`hidden-${idx}`}
            variant="secondary"
            className="bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          >
            팀원
          </Badge>
        ))}
      </div>
    </div>
  );
}
