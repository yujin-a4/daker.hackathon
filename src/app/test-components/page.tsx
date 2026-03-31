'use client';

import React from 'react';
import MatchBadge from '@/components/hackathon/MatchBadge';
import HackathonTracker from '@/components/hackathon/HackathonTracker';
import ProofCard from '@/components/shared/ProofCard';

export default function TestComponentsPage() {
  const userProfile = {
    tags: ["기획", "제미나이 활용", "LLM 이해", "React", "Next.js"]
  };

  const hackathonInfo = {
    required_tags: ["기획", "프롬프트 엔지니어링", "데이터 분석", "LLM 이해"]
  };

  const hackathonStatus = {
    deadline: "2026-06-30T12:00:00",
    currentStage: "prompting" as const
  };

  const userActivityLog = {
    activity: "제미나이 활용 기획안 작성",
    tool: "Gemini Pro",
    time: "1시간",
    difficulty: "High" as const
  };

  return (
    <div className="min-h-screen bg-black text-white p-12 space-y-16">
      <div className="max-w-4xl mx-auto space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
          MAXER New Components
        </h1>
        <p className="text-gray-400 text-lg">"Vibe Coding" style premium UI components for Kang Yu-jin</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* MatchBadge Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-l-4 border-cyan-500 pl-4">1. AI Matcher</h2>
          <MatchBadge userProfile={userProfile} hackathonInfo={hackathonInfo} />
        </div>

        {/* HackathonTracker Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-l-4 border-purple-500 pl-4">2. Real-time Progress</h2>
          <HackathonTracker hackathonStatus={hackathonStatus} />
        </div>

        {/* ProofCard Section */}
        <div className="col-span-1 md:col-span-2 space-y-4 flex flex-col items-center">
          <h2 className="text-xl font-bold border-l-4 border-emerald-500 pl-4 w-full">3. Achievement Card</h2>
          <ProofCard userActivityLog={userActivityLog} />
        </div>
      </div>
    </div>
  );
}
