import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Submission } from '@/types';
import { generateId } from '@/lib/utils';
import { submissions as initialSubmissions } from '@/data/seed';

interface SubmissionState {
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'id'>) => Submission;
  updateSubmission: (id: string, submission: Partial<Submission>) => void;
  deleteSubmission: (id: string) => void;
}

export const useSubmissionStore = create<SubmissionState>()(
  persist(
    (set, get) => ({
      submissions: initialSubmissions,
      addSubmission: (submissionData) => {
        const newSubmission: Submission = {
          ...submissionData,
          id: generateId('sub'),
        };
        set((state) => ({
          submissions: [...state.submissions, newSubmission],
        }));
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
      name: 'vibehack-submission-storage-v4',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
