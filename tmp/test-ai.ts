import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import * as dotenv from 'dotenv';
import path from 'path';

// .env.local 로드
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  model: 'googleai/gemini-2.5-flash',
});

async function main() {
  try {
    console.log('--- AI Connection Test ---');
    console.log('Using API Key (first 5 chars):', process.env.GEMINI_API_KEY?.substring(0, 5) + '...');
    console.log('Model: googleai/gemini-2.5-flash');
    
    const response = await ai.generate('Hello, are you Gemini 2.5 Flash?');
    console.log('Success! Response:', response.text);
  } catch (err: any) {
    console.error('--- ERROR ---');
    console.error(err.message || err);
    process.exit(1);
  }
}

main();
