'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { HackathonDetail } from '@/types';

const ChecklistItemSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const StrategyResponseSchema = z.object({
  strategy: z.string(),
  checklist: z.array(ChecklistItemSchema),
});

export async function generateAiWarroomContent(hackathonDetail: HackathonDetail, phase: string) {
  const prompt = `
    당신은 해커톤 우승 전략가입니다. 다음 해커톤 정보를 바탕으로 현재 '${phase}' 단계에서 팀이 우승하기 위해 수행해야 할 가장 구체적이고 실전적인 체크리스트와 전략 브리핑을 생성하세요.

    해커톤 제목: ${hackathonDetail.title}
    해커톤 요약: ${hackathonDetail.sections.overview.summary}
    평가 기준: ${hackathonDetail.sections.eval.description}
    제출 항목: ${JSON.stringify(hackathonDetail.sections.submit.submissionItems)}
    제출 가이드: ${hackathonDetail.sections.submit.guide.join(', ')}

    지침:
    1. 체크리스트는 반드시 이 해커톤의 특성을 반영해야 합니다 (예: AI 대회라면 AI 모델 최적화, 기획 대회라면 시장성 검증 등).
    2. 매우 짧고 핵심적인 액션 위주로 제안하세요 (각 항목은 40자 이내).
    3. 전략 브리핑은 단 1-2개 문장으로, 100자 이내로 아주 강력하게 작성하세요.
    4. 체크리스트 항목은 5-6개 정도로 생성하세요.
    5. 현재 단계를 집중 분석하십시오. 만약 'completed' 단계라면 최종 제출물의 퀄리티와 누락 방지에 집중하세요.
    6. 보조적인 설명 없이 '명사형' 또는 '단문' 위주로 직관적으로 답변하세요.

    현재 단계: ${phase}
  `;

  try {
    console.log(`[AI] Generating content for phase: ${phase} using ${hackathonDetail.title}`);
    
    // Check if Genkit is configured
    if (!ai) {
      console.error('[AI] Genkit instance is not defined');
      return null;
    }

    const { output } = await ai.generate({
      prompt,
      output: {
        schema: StrategyResponseSchema,
      },
    });

    if (!output) {
      console.warn('[AI] Empty output from model');
      throw new Error('No output from AI');
    }

    console.log('[AI] Successfully generated content');
    return output;
  } catch (error: any) {
    console.error('[AI] Generation error details:', {
      message: error.message,
      stack: error.stack,
      phase,
      hackathonSlug: hackathonDetail.slug
    });
    return null;
  }
}
