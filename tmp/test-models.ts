import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
});

async function main() {
  try {
    // Genkit doesn't have a direct 'listModels' helper that's easy to use here,
    // so we just try 2.0-flash which is widely available.
    console.log('Testing gemini-2.0-flash...');
    const res = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: 'Is this 2.0?'
    });
    console.log('Success with 2.0-flash!');
  } catch (err: any) {
    console.error('Failed with 2.0-flash:', err.message);
    try {
        console.log('Testing gemini-1.5-flash...');
        const res15 = await ai.generate({
          model: 'googleai/gemini-1.5-flash',
          prompt: 'Is this 1.5?'
        });
        console.log('Success with 1.5-flash!');
    } catch (err15: any) {
        console.error('Failed with 1.5-flash:', err15.message);
    }
  }
}

main();
