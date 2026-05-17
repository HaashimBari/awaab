import Constants from 'expo-constants';
import type { DhikrItem } from '../constants/dhikr';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

interface ScoreResult {
  score: number;       // 0–100
  feedback: string;    // one short encouraging tip
}

export async function scorePronunciation(
  dhikr: DhikrItem,
  transcript: string,
): Promise<ScoreResult> {
  const apiKey = Constants.expoConfig?.extra?.groqApiKey as string | undefined;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const prompt = `You are an Arabic pronunciation coach helping a Muslim learner recite dhikr correctly.

Dhikr: ${dhikr.transliteration}
Correct Arabic: ${dhikr.arabic}
Learner's speech-to-text transcript: "${transcript}"

Score the pronunciation accuracy from 0 to 100, where:
- 90–100: Excellent, nearly perfect
- 70–89: Good, minor errors
- 50–69: Developing, some noticeable errors
- Below 50: Needs significant practice

Respond with ONLY valid JSON in this exact format, nothing else:
{"score": <number>, "feedback": "<one short encouraging sentence with the most important tip>"}`;

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Groq API error ${response.status}: ${body}`);
  }

  const data = await response.json() as {
    choices: { message: { content: string } }[];
  };

  const content = data.choices[0]?.message?.content ?? '';
  try {
    const parsed = JSON.parse(content) as { score: number; feedback: string };
    return {
      score: Math.min(100, Math.max(0, Math.round(parsed.score))),
      feedback: parsed.feedback ?? 'Keep practising — you are doing great!',
    };
  } catch {
    return { score: 50, feedback: 'Keep practising — you are doing great!' };
  }
}
