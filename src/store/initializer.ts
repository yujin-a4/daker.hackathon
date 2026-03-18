import {
  hackathons,
  hackathonDetails,
  leaderboards,
  teams,
  rankings,
  submissions,
  currentUser,
} from '@/data/seed';
import { useHackathonStore } from './useHackathonStore';
import { useTeamStore } from './useTeamStore';
import { useSubmissionStore } from './useSubmissionStore';
import { useRankingStore } from './useRankingStore';
import { useUserStore } from './useUserStore';

export function initializeStore() {
  const isInitialized = useHackathonStore.getState().hackathons.length > 0;

  if (!isInitialized) {
    console.log('Initializing stores with seed data...');

    useHackathonStore.setState({
      hackathons: hackathons,
      hackathonDetails: hackathonDetails,
      leaderboards: leaderboards,
    });

    useTeamStore.setState({ teams: teams });
    useSubmissionStore.setState({ submissions: submissions });
    useRankingStore.setState({ rankings: rankings });
    useUserStore.setState({ currentUser: currentUser });
    
    console.log('Stores initialized. Check localStorage in your browser dev tools.');
  } else {
    console.log('Stores already initialized from localStorage.');
  }
}
