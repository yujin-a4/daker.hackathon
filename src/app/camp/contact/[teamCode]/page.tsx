'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, MessageCircle, Users, Hash, ShieldCheck } from 'lucide-react';
import { useTeamStore } from '@/store/useTeamStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeamContactDemoPage() {
  const params = useParams<{ teamCode: string }>();
  const { teams } = useTeamStore();

  const team = useMemo(
    () => teams.find((item) => item.teamCode === params.teamCode),
    [params.teamCode, teams]
  );

  if (!team) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <Card className="rounded-3xl border-slate-200">
          <CardContent className="py-16 text-center">
            <p className="text-lg font-semibold text-slate-900">팀 정보를 찾을 수 없습니다.</p>
            <p className="mt-2 text-sm text-muted-foreground">목록으로 돌아가서 다시 시도해 주세요.</p>
            <Button asChild className="mt-6">
              <Link href="/camp">팀 빌딩으로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),_transparent_35%),linear-gradient(180deg,_#fff7ed_0%,_#ffffff_42%,_#f8fafc_100%)]">
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <Link href="/camp" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          팀 빌딩으로 돌아가기
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden rounded-[28px] border-0 shadow-xl shadow-orange-100/60">
            <div className="bg-[#FEE500] px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700">오픈채팅 데모</p>
                  <h1 className="mt-1 text-2xl font-black text-slate-950">{team.name}</h1>
                </div>
                <div className="rounded-2xl bg-black px-3 py-2 text-sm font-bold text-[#FEE500]">
                  KakaoTalk
                </div>
              </div>
            </div>

            <CardContent className="space-y-6 bg-white p-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MessageCircle className="h-4 w-4 text-amber-500" />
                  팀장에게 바로 연결되는 오픈채팅방
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  이 화면은 외부 링크 대신 보여주는 데모 페이지입니다. 실제 서비스에서는 카카오톡 오픈채팅,
                  디스코드, DM 링크로 자연스럽게 이어지는 지점을 여기에 붙이면 됩니다.
                </p>
              </div>

              <div className="space-y-3 rounded-3xl border border-dashed border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Users className="h-4 w-4" />
                  현재 인원 {team.memberCount}/{team.maxTeamSize}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Hash className="h-4 w-4" />
                  팀 코드 {team.teamCode}
                </div>
                {team.isPrivate && (
                  <div className="flex items-center gap-2 text-sm text-amber-700">
                    <ShieldCheck className="h-4 w-4" />
                    초대 전용 팀이라 공개 지원은 제한됩니다.
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-slate-950 p-5 text-slate-50">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preview Message</p>
                <p className="mt-3 text-sm leading-6">
                  안녕하세요. {team.name} 팀 소개를 보고 연락드렸습니다. 모집 중인 포지션과 진행 방식이 궁금합니다.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="h-12 flex-1 bg-[#FEE500] font-bold text-slate-950 hover:bg-[#f6dd00]">
                  카카오톡 오픈채팅 입장
                </Button>
                <Button asChild variant="outline" className="h-12 flex-1">
                  <Link href="/camp">팀 카드로 돌아가기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-slate-200 bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">연락 전 체크</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{team.isOpen ? '모집 중' : '모집 마감'}</Badge>
                <Badge variant="secondary">{team.isPrivate ? '초대 전용' : '공개 팀'}</Badge>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">팀 소개</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{team.intro}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">찾는 포지션</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {team.lookingFor.length > 0 ? (
                    team.lookingFor.map((item) => (
                      <Badge key={item.position} className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                        {item.position}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">별도 모집 포지션이 등록되지 않았습니다.</span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Original URL</p>
                <p className="mt-2 break-all text-sm text-slate-600">{team.contact.url || '미등록'}</p>
              </div>

              <Button variant="ghost" className="w-full justify-between text-slate-600">
                외부 링크로 전환 준비됨
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
