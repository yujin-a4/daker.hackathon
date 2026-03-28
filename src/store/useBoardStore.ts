import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateId } from '@/lib/utils';

export interface BoardPost {
  id: string;
  teamCode: string;
  authorNickname: string;
  content: string;
  topic: string;       // 컨럼(theme) 식별자 e.g. '아이디어'
  color: string;       // Tailwind color classes e.g. 'bg-yellow-200'
  createdAt: string;
  likes: number;
}

interface BoardState {
  posts: BoardPost[];
  addPost: (postData: Omit<BoardPost, 'id' | 'createdAt' | 'likes'>) => BoardPost;
  deletePost: (id: string, authorNickname: string) => boolean;
  likePost: (id: string) => void;
  getPostsByTeam: (teamCode: string) => BoardPost[];
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      posts: [],
      addPost: (postData) => {
        const newPost: BoardPost = {
          ...postData,
          id: generateId('post'),
          createdAt: new Date().toISOString(),
          likes: 0,
        };
        set((state) => ({
          posts: [newPost, ...state.posts], // 최신순
        }));
        return newPost;
      },
      deletePost: (id, authorNickname) => {
        const { posts } = get();
        const target = posts.find((p) => p.id === id);
        if (!target || target.authorNickname !== authorNickname) {
          return false; // 작성자 불일치
        }
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        }));
        return true;
      },
      likePost: (id) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id ? { ...p, likes: p.likes + 1 } : p
          ),
        }));
      },
      getPostsByTeam: (teamCode) => {
        return get().posts.filter((p) => p.teamCode === teamCode);
      },
    }),
    {
      name: 'vibehack-board-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
