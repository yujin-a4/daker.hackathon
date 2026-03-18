import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Submission } from '@/types';
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
           useHackathonStore.getState().updateLeaderboardEntryTimestamp(newSubmission.hackathonSlug, newSubmission.teamName, newSubmission.submittedAt);
        }

        return newSubmission;
      },
      updateSubmission: (id, submissionUpdate) => {
        const submission = get().submissions.find(s => s.id === id);
        if (submission) {
            const updatedSubmission = { ...submission, ...submissionUpdate };
            const newSubmittedAt = updatedSubmission.submittedAt;

            // If artifacts are being removed and the list becomes empty
            if ('artifacts' in submissionUpdate && submissionUpdate.artifacts?.length === 0) {
                 useHackathonStore.getState().updateLeaderboardEntryTimestamp(submission.hackathonSlug, submission.teamName, null);
            } else if (newSubmittedAt) {
                 useHackathonStore.getState().updateLeaderboardEntryTimestamp(submission.hackathonSlug, submission.teamName, newSubmittedAt);
            }
        }
        
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id ? { ...s, ...submissionUpdate } : s
          ),
        }));
      },
      deleteSubmission: (id) => {
         const submission = get().submissions.find(s => s.id === id);
         if (submission) {
            useHackathonStore.getState().updateLeaderboardEntryTimestamp(submission.hackathonSlug, submission.teamName, null);
         }
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
