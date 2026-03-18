'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

const positions = ['Frontend', 'Backend', 'Designer', 'PM', 'ML Engineer', 'Data Analyst', '기타'];

const FormSchema = z.object({
  name: z.string().min(2, '팀 이름은 2자 이상이어야 합니다.').max(30, '팀 이름은 30자를 초과할 수 없습니다.'),
  intro: z.string().min(10, '소개는 10자 이상이어야 합니다.').max(500, '소개는 500자를 초과할 수 없습니다.'),
  hackathonSlug: z.string().optional(),
  maxTeamSize: z.number().min(2).max(5),
  lookingFor: z.array(z.string()).optional(),
  contact: z.string().url('유효한 URL을 입력해주세요. (https://...)'),
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
  const { addTeamCode } = useUserStore();
  const { hackathons, hackathonDetails } = useHackathonStore();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      intro: '',
      hackathonSlug: defaultHackathonSlug || 'none',
      maxTeamSize: 5,
      lookingFor: [],
      contact: '',
    },
  });

  useEffect(() => {
    if (editingTeam) {
      form.reset({
        name: editingTeam.name,
        intro: editingTeam.intro,
        hackathonSlug: editingTeam.hackathonSlug || 'none',
        maxTeamSize: editingTeam.maxTeamSize,
        lookingFor: editingTeam.lookingFor || [],
        contact: editingTeam.contact.url,
      });
    } else {
      form.reset({
        name: '',
        intro: '',
        hackathonSlug: defaultHackathonSlug || 'none',
        maxTeamSize: 5,
        lookingFor: [],
        contact: '',
      });
    }
  }, [editingTeam, defaultHackathonSlug, form, isOpen]);

  const selectedHackathonSlug = form.watch('hackathonSlug');
  const selectedHackathonDetail = selectedHackathonSlug ? hackathonDetails[selectedHackathonSlug] : null;
  const maxTeamSizeForHackathon = selectedHackathonDetail?.sections.overview.teamPolicy.maxTeamSize || 5;

  const onSubmit = (data: FormData) => {
    try {
      const finalHackathonSlug = data.hackathonSlug === 'none' ? null : data.hackathonSlug;
      if (editingTeam) {
        updateTeam(editingTeam.teamCode, {
          ...data,
          hackathonSlug: finalHackathonSlug,
          contact: { type: 'link', url: data.contact },
          lookingFor: data.lookingFor || [],
        });
        toast({ title: '팀 정보가 수정되었습니다.' });
      } else {
        const newTeam = addTeam({
          ...data,
          lookingFor: data.lookingFor || [],
          hackathonSlug: finalHackathonSlug,
          contact: { type: 'link', url: data.contact },
          isOpen: true,
          memberCount: 1,
        });
        addTeamCode(newTeam.teamCode);
        toast({ title: '팀 모집글이 등록되었습니다.' });
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: '오류가 발생했습니다.', description: '다시 시도해주세요.' });
    }
  };
  
  const introLength = form.watch('intro')?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingTeam ? '팀 정보 수정' : '새 팀 모집글 작성'}</DialogTitle>
          <DialogDescription>
            {editingTeam ? '팀 정보를 수정합니다.' : '함께 할 멋진 팀원을 찾아보세요.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>팀명 *</FormLabel>
                  <FormControl><Input placeholder="팀 이름을 입력하세요" {...field} maxLength={30} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="intro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>소개 *</FormLabel>
                  <FormControl><Textarea placeholder="팀과 프로젝트에 대해 소개해주세요" {...field} rows={4} maxLength={500} /></FormControl>
                   <div className="text-right text-xs text-muted-foreground">{introLength} / 500</div>
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
                      <SelectTrigger><SelectValue placeholder="해커톤을 선택하세요 (선택사항)" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">선택 안 함</SelectItem>
                      {hackathons.map(h => <SelectItem key={h.slug} value={h.slug}>{h.title}</SelectItem>)}
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
                  <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="최대 인원을 선택하세요" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[2, 3, 4, 5].filter(size => size <= maxTeamSizeForHackathon).map(size => <SelectItem key={size} value={String(size)}>{size}명</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lookingFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>모집 포지션</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {positions.map(pos => {
                        const isSelected = field.value?.includes(pos);
                        return (
                            <button
                                type="button"
                                key={pos}
                                onClick={() => {
                                    const newValue = isSelected
                                        ? field.value?.filter(p => p !== pos)
                                        : [...(field.value || []), pos];
                                    field.onChange(newValue);
                                }}
                                className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                                    isSelected
                                    ? 'bg-primary text-primary-foreground font-medium'
                                    : 'bg-muted text-muted-foreground hover:bg-accent'
                                }`}
                            >
                                {pos}
                            </button>
                        );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>연락 링크 *</FormLabel>
                  <FormControl><Input type="url" placeholder="https://open.kakao.com/..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>취소</Button>
              <Button type="submit">{editingTeam ? '수정하기' : '모집글 등록하기'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
