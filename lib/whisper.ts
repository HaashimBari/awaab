import Constants from 'expo-constants';

const WHISPER_ENDPOINT = 'https://api.openai.com/v1/audio/transcriptions';

export async function transcribeAudio(audioUri: string): Promise<string> {
  const apiKey = Constants.expoConfig?.extra?.openaiApiKey as string | undefined;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const formData = new FormData();
  // React Native supports appending a file via URI in FormData
  formData.append('file', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  } as unknown as Blob);
  formData.append('model', 'whisper-1');
  formData.append('language', 'ar');
  formData.append('response_format', 'text');

  const response = await fetch(WHISPER_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Whisper API error ${response.status}: ${body}`);
  }

  return (await response.text()).trim();
}
