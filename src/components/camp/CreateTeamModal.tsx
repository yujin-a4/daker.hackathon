'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { useToast } from '@/hooks/use-toast';
import { useTeamStore } from '@/store/useTeamStore';
import { useUserStore } from '@/store/useUserStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import type { Team } from '@/types';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const positions = ['Frontend', 'Backend', 'Designer', 'PM', 'ML Engineer', 'Data Analyst', 'Other'];

const FormSchema = z.object({
  name: z.string().min(2, '팀 이름은 2자 이상 입력해주세요.').max(30, '팀 이름은 30자 이하여야 합니다.'),
  intro: z.string().min(10, '팀 소개는 10자 이상 입력해주세요.').max(500, '팀 소개는 500자 이하여야 합니다.'),
  availabilitySummary: z.string().max(120, '작업 가능 시간은 120자 이하여야 합니다.').optional(),
  projectStatusDetail: z.string().max(600, '상세 진행 상태/비전은 600자 이하여야 합니다.').optional(),
  hackathonSlug: z.string().optional(),
  maxTeamSize: z.number().min(2).max(5),
  lookingFor: z.array(z.object({
    position: z.string(),
    description: z.string(),
  })).optional(),
  contact: z.string().url('유효한 URL을 입력해주세요. (https://...)'),
  isPrivate: z.boolean().default(false),
});

type FormData = z.infer<typeof FormSchema>;

interface CreateTeamModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingTeam?: Team | null;
  defaultHackathonSlug?: string;
}

export default function CreateTeamModal({ isOpen, onOpenChange, editingTeam, defaultHackathonSlug }: CreateTeamModalProps) {
  const { toast } = useToast();
  const { addTeam, updateTeam } = useTeamStore();
  const { currentUser, addTeamCode } = useUserStore();
  const { hackathons, hackathonDetails } = useHackathonStore();
  const [isSolo, setIsSolo] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      intro: '',
      availabilitySummary: '',
      projectStatusDetail: '',
      hackathonSlug: defaultHackathonSlug || 'none',
      maxTeamSize: 5,
      lookingFor: [],
      contact: '',
      isPrivate: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lookingFor',
  });

  useEffect(() => {
    if (!isOpen) return;

    if (editingTeam) {
      setIsSolo(editingTeam.isSolo ?? false);
      form.reset({
        name: editingTeam.name,
        intro: editingTeam.intro,
        availabilitySummary: editingTeam.availabilitySummary || '',
        projectStatusDetail: editingTeam.projectStatusDetail || '',
        hackathonSlug: editingTeam.hackathonSlug || 'none',
        maxTeamSize: editingTeam.maxTeamSize,
        lookingFor: editingTeam.lookingFor || [],
        contact: editingTeam.contact.url,
        isPrivate: editingTeam.isPrivate ?? false,
      });
      return;
    }

    setIsSolo(false);
    form.reset({
      name: '',
      intro: '',
      availabilitySummary: '',
      projectStatusDetail: '',
      hackathonSlug: defaultHackathonSlug || 'none',
      maxTeamSize: 5,
      lookingFor: [],
      contact: '',
      isPrivate: false,
    });
  }, [editingTeam, defaultHackathonSlug, form, isOpen]);

  const selectedHackathonSlug = form.watch('hackathonSlug');
  const selectedHackathonDetail = selectedHackathonSlug ? hackathonDetails[selectedHackathonSlug] : null;
  const maxTeamSizeForHackathon = selectedHackathonDetail?.sections.overview.teamPolicy.maxTeamSize || 5;

  const onSubmit = (data: FormData) => {
    if (!currentUser) {
      toast({ variant: 'destructive', title: '로그인이 필요합니다.' });
      return;
    }

    try {
      const finalHackathonSlug: string | null = data.hackathonSlug === 'none' ? null : (data.hackathonSlug ?? null);
      const { hackathonSlug: _unusedHackathonSlug, ...restData } = data;
      const teamData = {
        ...restData,
        availabilitySummary: data.availabilitySummary?.trim() || '',
        projectStatusDetail: data.projectStatusDetail?.trim() || '',
        hackathonSlug: finalHackathonSlug,
        isSolo,
        isPrivate: data.isPrivate,
        lookingFor: isSolo ? [] : (data.lookingFor || []),
        contact: { type: 'link', url: data.contact },
      };

      if (editingTeam) {
        updateTeam(editingTeam.teamCode, teamData);
        toast({ title: '팀 정보를 수정했습니다.' });
      } else {
        const newTeam = addTeam({
          ...teamData,
          leaderId: currentUser.id,
          isOpen: !isSolo,
          memberCount: 1,
        });
        addTeamCode(newTeam.teamCode);
        toast({ title: isSolo ? '개인 참가 정보를 등록했습니다.' : '팀 모집 글을 등록했습니다.' });
      }

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: '오류가 발생했습니다.', description: '다시 시도해주세요.' });
    }
  };

  const introLength = form.watch('intro')?.length || 0;
  const availabilityLength = form.watch('availabilitySummary')?.length || 0;
  const projectStatusDetailLength = form.watch('projectStatusDetail')?.length || 0;
  const isPrivateWatch = form.watch('isPrivate');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editingTeam ? '팀 정보 수정' : '팀 모집글 / 개인 참가 등록'}</DialogTitle>
          <DialogDescription>
            {editingTeam ? '팀 소개와 모집 정보를 수정합니다.' : '팀 모집 또는 개인 참가 방식을 선택하고 필요한 정보를 입력하세요.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 pb-4">
          {!editingTeam && (
            <div className="grid grid-cols-2 gap-2 rounded-xl border bg-muted/50 p-1.5">
              <button
                type="button"
                onClick={() => setIsSolo(false)}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                  !isSolo ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Users className="w-4 h-4" /> 팀 참가 (팀원 모집)
              </button>
              <button
                type="button"
                onClick={() => setIsSolo(true)}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                  isSolo ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <User className="w-4 h-4" /> 개인 참가
              </button>
            </div>
          )}

          {!isSolo && (
            <div className="space-y-2">
              <label className="text-sm font-semibold">모집 공개 방식</label>
              <div className="grid grid-cols-2 gap-2 rounded-xl border bg-muted/50 p-1.5">
                <button
                  type="button"
                  onClick={() => form.setValue('isPrivate', false)}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200',
                    !isPrivateWatch ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  공개 모집
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue('isPrivate', true)}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-200',
                    isPrivateWatch ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  초대 전용
                </button>
              </div>
              <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
                {isPrivateWatch
                  ? '초대 전용 팀은 목록에 노출되더라도 직접 지원을 받지 않고, 리더가 초대한 사람만 합류할 수 있습니다.'
                  : '공개 모집 팀은 누구나 팀 정보를 보고 연락하거나 참여 의사를 보낼 수 있습니다.'}
              </p>
            </div>
          )}

          {isSolo && !editingTeam && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-muted-foreground dark:border-amber-800 dark:bg-amber-950/30">
              개인 참가 글은 팀 찾기 목록에 노출되지 않습니다. 대신 개인 전용 Basecamp가 생성됩니다.
            </p>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>팀명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="팀 이름을 입력하세요" {...field} maxLength={30} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="intro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>팀 소개 *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="팀과 프로젝트를 한눈에 이해할 수 있게 소개해주세요." {...field} rows={4} maxLength={500} />
                    </FormControl>
                    <div className="text-right text-xs text-muted-foreground">{introLength} / 500</div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availabilitySummary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>작업 가능 시간</FormLabel>
                    <FormControl>
                      <Input placeholder="평일 20:00~24:00, 주말 오후 가능" {...field} maxLength={120} />
                    </FormControl>
                    <div className="text-right text-xs text-muted-foreground">{availabilityLength} / 120</div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectStatusDetail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상세 진행 상태 / 비전</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="현재 어디까지 진행됐는지, 다음 단계가 무엇인지, 새 팀원에게 기대하는 역할이 무엇인지 적어주세요."
                        {...field}
                        rows={4}
                        maxLength={600}
                      />
                    </FormControl>
                    <div className="text-right text-xs text-muted-foreground">{projectStatusDetailLength} / 600</div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hackathonSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>연결 해커톤</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'none'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="해커톤을 선택하세요 (선택사항)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">선택 안 함</SelectItem>
                        {hackathons.map((hackathon) => (
                          <SelectItem key={hackathon.slug} value={hackathon.slug}>
                            {hackathon.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxTeamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최대 팀 인원</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="최대 팀 인원을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[2, 3, 4, 5]
                          .filter((size) => size <= maxTeamSizeForHackathon)
                          .map((size) => (
                            <SelectItem key={size} value={String(size)}>
                              {size}명
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isSolo && (
                <FormField
                  control={form.control}
                  name="lookingFor"
                  render={() => (
                    <FormItem>
                      <FormLabel>모집 포지션</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {positions.map((position) => {
                          const fieldIndex = fields.findIndex((field) => field.position === position);
                          const isSelected = fieldIndex !== -1;

                          return (
                            <button
                              type="button"
                              key={position}
                              onClick={() => {
                                if (isSelected) {
                                  remove(fieldIndex);
                                } else {
                                  append({ position, description: '' });
                                }
                              }}
                              className={cn(
                                'rounded-full px-3 py-1 text-sm transition-colors duration-200',
                                isSelected ? 'bg-primary font-medium text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                              )}
                            >
                              {position}
                            </button>
                          );
                        })}
                      </div>

                      <div className="space-y-3 pt-2">
                        <AnimatePresence>
                          {fields.map((field, index) => (
                            <motion.div
                              key={field.id}
                              layout
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: '12px' }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FormField
                                control={form.control}
                                name={`lookingFor.${index}.description`}
                                render={({ field: descField }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                      {field.position} 상세 설명 (선택)
                                    </FormLabel>
                                    <FormControl>
                                      <Input placeholder="어떤 경험이나 역할을 기대하는지 적어주세요." {...descField} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>연락 링크 *</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://open.kakao.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  취소
                </Button>
                <Button type="submit">{editingTeam ? '수정하기' : isSolo ? '개인 참가 등록' : '모집글 등록하기'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
