import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Submission, LeaderboardEntry } from '@/types';
import { generateId } from '@/lib/utils';
import { useHackathonStore } from './useHackathonStore';

interface SubmissionState {
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'id'>) => Submission;
  updateSubmission: (id: string, submission: Partial<Submission>) => void;
  deleteSubmission: (id: string) => void;
}

export const useSubmissionStore = create<SubmissionState>()(
  persist(
    (set, get) => ({
      submissions: [],
      addSubmission: (submissionData) => {
        const newSubmission: Submission = {
          ...submissionData,
          id: generateId('sub'),
        };
        set((state) => ({
          submissions: [...state.submissions, newSubmission],
        }));

        if (newSubmission.status === 'submitted' && newSubmission.submittedAt) {
          const newLeaderboardEntry: LeaderboardEntry = {
            rank: null,
            teamName: newSubmission.teamName,
            score: null,
            submittedAt: newSubmission.submittedAt,
          };
          useHackathonStore.getState().addLeaderboardEntry(newSubmission.hackathonSlug, newLeaderboardEntry);
        }

        return newSubmission;
      },
      updateSubmission: (id, submissionUpdate) => {
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id ? { ...s, ...submissionUpdate } : s
          ),
        }));
      },
      deleteSubmission: (id) => {
        set((state) => ({
          submissions: state.submissions.filter((s) => s.id !== id),
        }));
      },
    }),
    {
      name: 'vibehack-submission-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
