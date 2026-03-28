'use client';

import { useState } from 'react';
import type { Team } from '@/types';
import { useBoardStore } from '@/store/useBoardStore';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Plus, Heart, Trash2, Edit3, StickyNote, X, GripVertical,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ── 색상 팔레트 ──────────────────────────────────────────────────────────────
const POST_COLORS = [
  { cls: 'bg-yellow-200 text-yellow-900', label: '노랑' },
  { cls: 'bg-sky-200 text-sky-900',       label: '파랑' },
  { cls: 'bg-emerald-200 text-emerald-900', label: '초록' },
  { cls: 'bg-rose-200 text-rose-900',     label: '분홍' },
  { cls: 'bg-purple-200 text-purple-900', label: '보라' },
  { cls: 'bg-orange-200 text-orange-900', label: '주황' },
  { cls: 'bg-slate-100 text-slate-800',   label: '흰색' },
];

// ── 기본 컬럼 ────────────────────────────────────────────────────────────────
const DEFAULT_COLUMNS = ['💡 아이디어', '📎 리소스', '🔥 할 일', '💬 피드백'];

// ── 컬럼 헤더 색상 (순환) ────────────────────────────────────────────────────
const COLUMN_COLORS = [
  'from-violet-500/20 to-purple-500/10 border-purple-300/50',
  'from-sky-500/20 to-blue-500/10 border-sky-300/50',
  'from-rose-500/20 to-pink-500/10 border-rose-300/50',
  'from-emerald-500/20 to-green-500/10 border-emerald-300/50',
  'from-amber-500/20 to-yellow-500/10 border-amber-300/50',
  'from-cyan-500/20 to-teal-500/10 border-cyan-300/50',
];

interface AddCardState {
  topic: string;
  content: string;
  color: string;
}

export default function BasecampBoardTab({ team }: { team: Team }) {
  const { currentUser } = useUserStore();
  const { posts, addPost, deletePost, likePost } = useBoardStore();
  const teamPosts = posts.filter(p => p.teamCode === team.teamCode);

  // ── 컬럼 목록 (로컬 상태) ─────────────────────────────────────────────────
  const [columns, setColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  // ── 포스트 추가 상태 ─────────────────────────────────────────────────────
  const [addCardState, setAddCardState] = useState<AddCardState | null>(null);

  const handleAddColumn = () => {
    const name = newColumnName.trim();
    if (!name || columns.includes(name)) return;
    setColumns(prev => [...prev, name]);
    setNewColumnName('');
    setIsAddingColumn(false);
  };

  const handleDeleteColumn = (col: string) => {
    setColumns(prev => prev.filter(c => c !== col));
    // 해당 컬럼 포스트는 "기타"로 이동되지 않고 단순히 사라짐
  };

  const handleStartAddCard = (topic: string) => {
    setAddCardState({ topic, content: '', color: POST_COLORS[0].cls });
  };

  const handleSubmitCard = () => {
    if (!addCardState?.content.trim() || !currentUser) return;
    addPost({
      teamCode: team.teamCode,
      authorNickname: currentUser.nickname,
      content: addCardState.content.trim(),
      topic: addCardState.topic,
      color: addCardState.color,
    });
    setAddCardState(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col min-h-0">
      {/* ── 헤더 ──────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-violet-500" />
            아이디어 보드
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            주제별 컬럼에 포스트잇을 붙여 아이디어를 공유하세요.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingColumn(v => !v)}
          className="font-semibold gap-1.5"
        >
          <Plus className="w-4 h-4" />
          컬럼 추가
        </Button>
      </div>

      {/* ── 새 컬럼 입력 ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAddingColumn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex gap-2 p-3 rounded-xl border bg-muted/40">
              <Input
                autoFocus
                value={newColumnName}
                onChange={e => setNewColumnName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddColumn()}
                placeholder="새 컬럼 이름 (예: 🎨 디자인)"
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddColumn} disabled={!newColumnName.trim()}>
                추가
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAddingColumn(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 쉘프 컬럼 영역 ────────────────────────────────────────────────── */}
      <div
        className="flex gap-4 overflow-x-auto pb-6 min-h-0"
        style={{ scrollbarWidth: 'thin' }}
      >
        {columns.map((col, colIdx) => {
          const colPosts = teamPosts.filter(p => p.topic === col);
          const colColor = COLUMN_COLORS[colIdx % COLUMN_COLORS.length];
          const isAddingHere = addCardState?.topic === col;

          return (
            <div
              key={col}
              className="flex-shrink-0 w-72 flex flex-col rounded-2xl border bg-muted/30 dark:bg-muted/10 overflow-hidden shadow-sm"
            >
              {/* 컬럼 헤더 */}
              <div className={cn('flex items-center justify-between px-4 py-3 bg-gradient-to-br border-b', colColor)}>
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-40" />
                  <span className="font-bold text-sm truncate">{col}</span>
                  <span className="text-[11px] font-medium text-muted-foreground bg-black/10 rounded-full px-1.5 py-0.5 shrink-0">
                    {colPosts.length}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleStartAddCard(col)}
                    className="p-1 rounded-lg hover:bg-black/10 transition-colors"
                    title="포스트 추가"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  {/* 기본 컬럼은 삭제 시 경고 필요 없이 삭제 가능 */}
                  <button
                    onClick={() => handleDeleteColumn(col)}
                    className="p-1 rounded-lg hover:bg-black/10 hover:text-red-500 transition-colors"
                    title="컬럼 삭제"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 카드 목록 */}
              <div className="flex flex-col gap-3 p-3 overflow-y-auto flex-1" style={{ maxHeight: '65vh' }}>
                {/* 새 카드 입력 폼 */}
                <AnimatePresence>
                  {isAddingHere && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="rounded-xl border bg-card shadow-md overflow-hidden"
                    >
                      <Textarea
                        autoFocus
                        placeholder="무슨 생각을 하고 계신가요?"
                        className="border-0 resize-none text-sm min-h-[90px] focus-visible:ring-0 bg-card rounded-none"
                        value={addCardState?.content ?? ''}
                        onChange={e =>
                          setAddCardState(prev =>
                            prev ? { ...prev, content: e.target.value } : prev
                          )
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmitCard();
                          if (e.key === 'Escape') setAddCardState(null);
                        }}
                      />
                      <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-2 gap-2">
                        {/* 색상 선택 */}
                        <div className="flex items-center gap-1.5">
                          {POST_COLORS.map(c => (
                            <button
                              key={c.cls}
                              title={c.label}
                              className={cn(
                                'w-4 h-4 rounded-full transition-all',
                                c.cls.split(' ')[0],
                                addCardState?.color === c.cls
                                  ? 'ring-2 ring-offset-1 ring-primary scale-110'
                                  : ''
                              )}
                              onClick={() =>
                                setAddCardState(prev =>
                                  prev ? { ...prev, color: c.cls } : prev
                                )
                              }
                            />
                          ))}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={() => setAddCardState(null)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 px-3 text-xs"
                            onClick={handleSubmitCard}
                            disabled={!addCardState?.content.trim()}
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            등록
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 기존 포스트 카드 */}
                <AnimatePresence>
                  {colPosts.map(post => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        'rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow relative group',
                        post.color
                      )}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed text-[13.5px] font-medium pb-8 select-text">
                        {post.content}
                      </p>

                      {/* 카드 하단 */}
                      <div className="absolute left-3.5 bottom-3 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[9px] font-bold shadow-sm">
                          {post.authorNickname.substring(0, 1)}
                        </div>
                        <div className="flex flex-col leading-none">
                          <span className="text-[10px] font-bold opacity-70">{post.authorNickname}</span>
                          <span className="text-[9px] opacity-50">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                          </span>
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="absolute right-3 bottom-2.5 flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => likePost(post.id)}
                          className="flex items-center gap-0.5 p-1 hover:bg-black/10 rounded-lg transition-colors text-[11px] font-bold"
                        >
                          <Heart
                            className={cn(
                              'w-3 h-3',
                              post.likes > 0 ? 'fill-current text-rose-500' : ''
                            )}
                          />
                          {post.likes > 0 && post.likes}
                        </button>
                        {currentUser?.nickname === post.authorNickname && (
                          <button
                            onClick={() => deletePost(post.id, currentUser.nickname)}
                            className="p-1 hover:bg-black/10 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* 빈 상태 */}
                {colPosts.length === 0 && !isAddingHere && (
                  <button
                    onClick={() => handleStartAddCard(col)}
                    className="flex flex-col items-center justify-center gap-2 py-10 rounded-xl border-2 border-dashed border-muted-foreground/20 text-muted-foreground/50 hover:border-primary/40 hover:text-primary/60 transition-colors text-xs font-medium w-full"
                  >
                    <Plus className="w-5 h-5" />
                    포스트 추가
                  </button>
                )}

                {/* 하단 "카드 추가" 버튼 */}
                {colPosts.length > 0 && !isAddingHere && (
                  <button
                    onClick={() => handleStartAddCard(col)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors font-medium w-full"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    포스트 추가
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* 우측 끝: 새 컬럼 추가 버튼 */}
        <div className="flex-shrink-0 w-72">
          <button
            onClick={() => {
              setIsAddingColumn(true);
              // 스크롤은 컬럼이 추가된 후 자동으로 이동하면 더 좋지만 단순하게 처리
            }}
            className="w-full h-24 rounded-2xl border-2 border-dashed border-muted-foreground/20 text-muted-foreground/50 hover:border-primary/40 hover:text-primary/60 transition-colors flex flex-col items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            새 컬럼 추가
          </button>
        </div>
      </div>
    </div>
  );
}
