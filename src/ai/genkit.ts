import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export { z };

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  model: 'googleai/gemini-2.5-flash', // 안정적인 버전으로 복구
});

