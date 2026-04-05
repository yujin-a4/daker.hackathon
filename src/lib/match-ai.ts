'use server';

import { ai, z } from '@/ai/genkit';
import type { Hackathon, CurrentUser } from '@/types';
import { MatchAnalysisResult } from '@/lib/match-analysis';

const MatchSchema = z.object({
  matchRate: z.number(),
  suggestedRole: z.string(),
  insight: z.string(),
  neededTeamRoles: z.array(z.string())
});

export async function getAiMatchAnalysis(hackathon: Hackathon, user: CurrentUser): Promise<Partial<MatchAnalysisResult> & { insight: string }> {
  try {
    const prompt = `
      You are a world-class hackathon mentor and AI scout.
      Analyze the match between the following user and hackathon.

      USER:
      - Nickname: ${user.nickname}
      - Primary Roles: ${user.primaryRoles?.join(', ')}
      - Interest Domains: ${user.interestDomains?.join(', ')}
      - Tech Stacks: ${user.techStacks?.join(', ')}
      - Collaboration Strengths: ${user.collaborationStrengths?.join(', ')}

      HACKATHON:
      - Title: ${hackathon.title}
      - Type: ${hackathon.type}
      - Tags: ${hackathon.tags.join(', ')}

      TASK:
      1. Calculate a semantic match rate (0-100).
      2. Suggest the best role for this user in this specific hackathon.
      3. Write a 1-sentence personalized "Insight" (in Korean) explaining why they are a good fit.
      4. List 2-3 "Needed Team Roles" (in Korean) they should look for to complement their skills.

      RESPONSE FORMAT (JSON ONLY):
      {
        "matchRate": number,
        "suggestedRole": "string",
        "insight": "string (Korean, 1 sentence, encouraging, professional)",
        "neededTeamRoles": ["string", "string"]
      }
    `;

    const response = await ai.generate({
      prompt,
      output: {
        schema: MatchSchema
      }
    });

    const output = response.output;

    if (!output) {
      throw new Error('AI failed to generate output');
    }

    return output;
  } catch (error) {
    console.error('AI Match Analysis Error:', error);
    // Fallback if AI fails
    return {
      matchRate: 70,
      suggestedRole: user.primaryRoles?.[0] || '참가자',
      insight: '당신의 뛰어난 역량은 이 해커톤의 성공에 큰 기여를 할 것입니다.',
      neededTeamRoles: ['개발자', '디자이너']
    };
  }
}

