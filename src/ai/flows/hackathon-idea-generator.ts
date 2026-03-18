'use server';
/**
 * @fileOverview A Genkit flow for generating hackathon project ideas.
 *
 * - generateHackathonIdeas - A function that handles the hackathon idea generation process.
 * - HackathonIdeaGeneratorInput - The input type for the generateHackathonIdeas function.
 * - HackathonIdeaGeneratorOutput - The return type for the generateHackathonIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HackathonIdeaGeneratorInputSchema = z.object({
  theme: z.string().describe("The central theme or topic of the hackathon."),
  constraints: z.string().optional().describe("Any specific rules, technologies, or limitations for the hackathon."),
  duration: z.string().optional().describe("The duration of the hackathon (e.g., '24 hours', '1 week')."),
  teamSize: z.string().optional().describe("The typical team size for the hackathon (e.g., 'solo', 'up to 5 people')."),
  tags: z.array(z.string()).optional().describe("Relevant technologies or topics associated with the hackathon."),
});
export type HackathonIdeaGeneratorInput = z.infer<typeof HackathonIdeaGeneratorInputSchema>;

const HackathonIdeaGeneratorOutputSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string().describe("A concise title for the project idea."),
      summary: z.string().describe("A brief description of the project idea."),
      technologies: z.array(z.string()).describe("Suggested technologies or frameworks to use."),
      relevanceToTheme: z.string().describe("How the idea connects to the hackathon's theme."),
      feasibilityConsiderations: z.string().describe("Potential challenges, requirements, or things to consider for implementation."),
    })
  ).describe("A list of brainstormed hackathon project ideas."),
});
export type HackathonIdeaGeneratorOutput = z.infer<typeof HackathonIdeaGeneratorOutputSchema>;

export async function generateHackathonIdeas(input: HackathonIdeaGeneratorInput): Promise<HackathonIdeaGeneratorOutput> {
  return hackathonIdeaGeneratorFlow(input);
}

const hackathonIdeaGeneratorPrompt = ai.definePrompt({
  name: 'hackathonIdeaGeneratorPrompt',
  input: {schema: HackathonIdeaGeneratorInputSchema},
  output: {schema: HackathonIdeaGeneratorOutputSchema},
  prompt: `You are an AI assistant specialized in generating creative and feasible hackathon project ideas. Your task is to brainstorm unique project concepts based on a given hackathon theme and constraints.

Generate 3 distinct project ideas. For each idea, provide a concise title, a brief summary, suggested technologies, how it connects to the hackathon's theme, and potential feasibility considerations.

Hackathon Details:
Theme: {{{theme}}}
{{#if constraints}}Constraints: {{{constraints}}}
{{/if}}{{#if duration}}Duration: {{{duration}}}
{{/if}}{{#if teamSize}}Team Size: {{{teamSize}}}
{{/if}}{{#if tags}}Keywords/Tags: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

Please ensure the ideas are:
- Creative and innovative.
- Directly relevant to the hackathon's theme and constraints.
- Practical enough to be implemented within a hackathon timeframe, considering team size.
- Clearly structured as per the output schema.`,
});

const hackathonIdeaGeneratorFlow = ai.defineFlow(
  {
    name: 'hackathonIdeaGeneratorFlow',
    inputSchema: HackathonIdeaGeneratorInputSchema,
    outputSchema: HackathonIdeaGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await hackathonIdeaGeneratorPrompt(input);
    return output!;
  }
);
