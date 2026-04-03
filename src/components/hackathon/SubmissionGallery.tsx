'use client';

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink, Heart, Users, FileText, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

type GalleryEntry = {
  teamCode: string;
  name: string;
  isSolo: boolean;
  votes: number;
  submittedAt: string | null;
  artifacts: { key: string; type: string; content?: string; fileName?: string }[];
  isMyTeam: boolean;
};

type SubmissionGalleryProps = {
  entries: GalleryEntry[];
  currentPhaseKey?: string;
  isVotingPhase: boolean;
  onVote?: (teamCode: string) => void;
  targetItemKey?: string;
};

export default function SubmissionGallery({ entries, currentPhaseKey, isVotingPhase, onVote, targetItemKey }: SubmissionGalleryProps) {
  const submittedEntries = entries.filter(e => e.submittedAt);

  if (submittedEntries.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-slate-50 dark:bg-slate-900/20">
        <p className="text-muted-foreground">아직 제출된 작품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {submittedEntries.map((entry) => {
        const mainArtifact = targetItemKey 
          ? entry.artifacts.find(a => a.key === targetItemKey) 
          : entry.artifacts[entry.artifacts.length - 1];

        return (
          <Card key={entry.teamCode} className={cn(
            "group overflow-hidden border-slate-200 dark:border-slate-800 transition-all hover:shadow-xl hover:-translate-y-1",
            entry.isMyTeam && "ring-2 ring-indigo-500 border-transparent"
          )}>
            {/* Artifact Preview Placeholder */}
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent group-hover:from-indigo-500/10 transition-colors" />
              <div className="text-center group-hover:scale-110 transition-transform duration-500">
                {mainArtifact?.type === 'url' ? (
                  <Globe className="w-12 h-12 text-indigo-500/50 group-hover:text-indigo-500 transition-colors" />
                ) : (
                  <FileText className="w-12 h-12 text-indigo-500/50 group-hover:text-indigo-500 transition-colors" />
                )}
              </div>
              <div className="absolute top-3 right-3">
                <Badge className={cn(entry.isSolo ? "bg-emerald-500" : "bg-blue-500")}>
                  {entry.isSolo ? '개인' : '팀'}
                </Badge>
              </div>
              {entry.isMyTeam && (
                <Badge className="absolute top-3 left-3 bg-slate-900 dark:bg-white dark:text-slate-950 font-bold">MY TEAM</Badge>
              )}
            </div>

          <CardContent className="p-5">
            <h4 className="font-bold text-lg mb-1 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {entry.name}
            </h4>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>{entry.isSolo ? '개인 참여' : '팀 프로젝트'}</span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">제출물 ({entry.artifacts.length})</p>
              <div className="flex flex-wrap gap-2">
                {entry.artifacts.map((art, i) => (
                  <TooltipProvider key={i}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-help">
                          {art.type === 'url' ? <ExternalLink className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="text-[10px] font-bold">
                        {art.key === 'plan' ? '기획서' : art.key === 'web' ? '라이브 데모' : '발표 자료'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 mt-auto">
            <div className="flex items-center gap-1.5 text-rose-500 font-bold">
              <Heart className="w-4 h-4 fill-current" />
              <span className="text-sm">{entry.votes.toLocaleString()}</span>
            </div>
            
            <div className="flex gap-2">
              {mainArtifact?.content && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(mainArtifact.content, '_blank')}
                  className="h-8 font-bold text-xs rounded-lg px-3"
                >
                  작품 보기
                </Button>
              )}
              {isVotingPhase && (
                <Button 
                  size="sm" 
                  variant="default"
                  disabled={entry.isMyTeam}
                  onClick={() => onVote?.(entry.teamCode)}
                  className="h-8 font-bold text-xs rounded-lg px-4 bg-indigo-600 hover:bg-indigo-700"
                >
                  투표하기
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )})}
    </div>
  );
}
