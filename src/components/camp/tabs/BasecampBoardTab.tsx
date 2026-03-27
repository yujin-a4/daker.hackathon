'use client';

import { useState } from 'react';
import type { Team } from '@/types';
import { useBoardStore } from '@/store/useBoardStore';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Heart, Trash2, Edit3, MessageSquareText, StickyNote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const POST_COLORS = [
  'bg-yellow-200 text-yellow-900',
  'bg-blue-200 text-blue-900',
  'bg-green-200 text-green-900',
  'bg-rose-200 text-rose-900',
  'bg-purple-200 text-purple-900',
  'bg-orange-200 text-orange-900',
];

export default function BasecampBoardTab({ team }: { team: Team }) {
  const { currentUser } = useUserStore();
  const { posts, addPost, deletePost, likePost } = useBoardStore();
  const teamPosts = posts.filter(p => p.teamCode === team.teamCode);

  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(POST_COLORS[0]);

  const handleAddPost = () => {
    if (!newContent.trim() || !currentUser) return;
    addPost({
      teamCode: team.teamCode,
      authorNickname: currentUser.nickname,
      content: newContent.trim(),
      color: selectedColor,
    });
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-blue-500" /> 
            아이디어 보드 (패들렛)
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            팀원들과 자유롭게 아이디어와 자료를 공유하세요.
          </p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? 'secondary' : 'default'} className="font-semibold shadow-sm">
          {isAdding ? "취소" : <><Plus className="w-4 h-4 mr-1.5" /> 포스트 추가</>}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="p-4 sm:p-5 rounded-xl border bg-card shadow-sm space-y-4">
              <Textarea
                placeholder="어떤 아이디어가 떠오르셨나요?"
                className="resize-none min-h-[120px] text-base focus-visible:ring-blue-500"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                autoFocus
              />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-medium text-muted-foreground mr-2">색상:</span>
                  {POST_COLORS.map(color => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full ${color.split(' ')[0]} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''} transition-all`}
                      onClick={() => setSelectedColor(color)}
                      aria-label="색상 선택"
                    />
                  ))}
                </div>
                <Button onClick={handleAddPost} disabled={!newContent.trim()} className="bg-blue-600 hover:bg-blue-700 font-bold px-6">
                  <Edit3 className="w-4 h-4 mr-2" /> 등록하기
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {teamPosts.length === 0 && !isAdding && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10 opacity-70">
          <StickyNote className="w-12 h-12 mb-4 text-muted" />
          <p className="font-medium text-lg text-foreground/70">아직 등록된 아이디어가 없습니다.</p>
          <p className="text-sm mb-6">오른쪽 위 버튼을 눌러 첫 포스트잇을 붙여보세요!</p>
        </div>
      )}

      {/* Masonry-like Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 pb-20">
        <AnimatePresence>
          {teamPosts.map((post) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              key={post.id}
              className={`break-inside-avoid shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl p-4 sm:p-5 relative group ${post.color}`}
            >
              {/* Note Content */}
              <p className="whitespace-pre-wrap leading-relaxed text-[15px] font-medium mb-8 select-text">
                {post.content}
              </p>

              {/* Note Footer */}
              <div className="absolute left-4 sm:left-5 bottom-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">
                  {post.authorNickname.substring(0, 1)}
                </div>
                <div className="flex flex-col">
                   <span className="text-[11px] font-bold opacity-80">{post.authorNickname}</span>
                   <span className="text-[9px] font-medium opacity-60">
                     {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                   </span>
                </div>
              </div>

              {/* Interaction Buttons */}
              <div className="absolute right-4 sm:right-5 bottom-3.5 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => likePost(post.id)}
                  className="p-1.5 hover:bg-black/10 rounded-full transition-colors flex items-center gap-1 font-bold text-xs"
                >
                  <Heart className={`w-3.5 h-3.5 ${post.likes > 0 ? 'fill-current text-rose-500' : ''}`} />
                  {post.likes > 0 && post.likes}
                </button>
                {currentUser?.nickname === post.authorNickname && (
                  <button 
                    onClick={() => deletePost(post.id, currentUser.nickname)}
                    className="p-1.5 hover:bg-black/10 hover:text-red-700 rounded-full transition-colors"
                    aria-label="포스트 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
