import { EnrichmentMode, LLMProvider, ContextType } from '@/stores/appStore';
import type { Language } from '@/lib/i18n';

// Aktuelle Modelle (Stand Oktober 2026)
export const MODELS = {
  openaiTranscribe: 'gpt-transcribe',
  openaiChat: 'gpt-6-luna',
  anthropic: 'claude-sonnet-5-5',
  gemini: 'gemini-3.1-flash-lite',
} as const;

// Ausgabe immer in der Sprache des gesprochenen Textes, egal in welcher Sprache die Anweisung steht
const SAME_LANGUAGE = '\n\nWichtig: Antworte in derselben Sprache, in der der Eingabetext geschrieben ist (z. B. Englisch bei englischem Text).';

const ENRICHMENT_PROMPTS: Record<Exclude<EnrichmentMode, 'original' | 'context'>, string> = {
  structured: `Du bist ein Assistent, der Spracheingaben in strukturierte Notizen umwandelt.
Erstelle aus dem folgenden Text eine gut strukturierte Notiz mit:
- Einem prägnanten Titel (als # Überschrift)
- Bullet-Points für die wichtigsten Punkte
- Relevante Tags am Ende (z.B. #meeting, #todo, #idee)

Formatiere die Ausgabe übersichtlich und professionell. Antworte nur mit der formatierten Notiz, ohne Erklärungen.`,
  
  summary: `Du bist ein Assistent, der Texte präzise zusammenfasst.
Extrahiere die Kernaussage(n) aus dem folgenden Text:
- Fasse den Inhalt in 2-3 Sätzen zusammen
- Fokussiere auf das Wesentliche
- Verwende klare, präzise Sprache

Sei knapp aber vollständig. Antworte nur mit der Zusammenfassung, ohne Erklärungen.`,
};

const CONTEXT_PROMPTS: Record<ContextType, string> = {
  email_formal: `Formatiere den folgenden Text als förmliche, professionelle E-Mail.
Struktur:
- Angemessene Anrede (z.B. "Sehr geehrte Damen und Herren,")
- Professioneller Textkörper
- Höfliche Grußformel (z.B. "Mit freundlichen Grüßen")

Behalte den Inhalt bei, verbessere Ton und Struktur. Antworte nur mit der E-Mail.`,

  email_casual: `Formatiere den folgenden Text als lockere, freundliche E-Mail.
Struktur:
- Persönliche Anrede (z.B. "Hallo [Name],", "Hi,")
- Natürlicher, freundlicher Textkörper
- Lockere Grußformel (z.B. "Viele Grüße", "Liebe Grüße")

Behalte den Inhalt bei, mache den Ton persönlicher. Antworte nur mit der E-Mail.`,

  newsletter: `Formatiere den folgenden Text als ansprechenden Newsletter-Abschnitt.
Struktur:
- Aufmerksamkeitsstarke Überschrift
- Einleitender Absatz der neugierig macht
- Gut strukturierter Hauptteil mit Absätzen
- Call-to-Action am Ende (falls passend)

Mache den Text engaging und leicht lesbar. Antworte nur mit dem Newsletter-Text.`,

  social_media: `Formatiere den folgenden Text als Social Media Post.
Anforderungen:
- Kurz und prägnant (max. 280 Zeichen wenn möglich)
- Aufmerksamkeitsstark
- Passende Emojis einbauen
- Relevante Hashtags am Ende

Mache den Post engaging und teilbar. Antworte nur mit dem Post.`,

  meeting_notes: `Formatiere den folgenden Text als strukturierte Meeting-Notizen.
Struktur:
- **Datum/Thema:** (falls erkennbar)
- **Teilnehmer:** (falls erwähnt)
- **Besprochene Punkte:** (als Bullet-Liste)
- **Entscheidungen:** (falls vorhanden)
- **Nächste Schritte / Action Items:** (als Checkliste mit [ ])

Antworte nur mit den Meeting-Notizen.`,

  todo_list: `Formatiere den folgenden Text als klare TODO-Liste.
Struktur:
- Jede Aufgabe als Checkbox: [ ] Aufgabe
- Gruppiere nach Priorität oder Kategorie falls sinnvoll
- Füge Deadlines hinzu falls erwähnt
- Halte die Aufgaben kurz und actionable

Antworte nur mit der TODO-Liste.`,

  blog_post: `Formatiere den folgenden Text als Blog-Artikel.
Struktur:
- Einprägsamer Titel (als # Überschrift)
- Interessante Einleitung
- Gut strukturierter Hauptteil mit Zwischenüberschriften
- Fazit oder Schlussgedanke

Mache den Text informativ und leicht lesbar. Antworte nur mit dem Blog-Artikel.`,

  report: `Formatiere den folgenden Text als professionellen Bericht.
Struktur:
- Titel und ggf. Untertitel
- Executive Summary (kurze Zusammenfassung)
- Hauptteil mit nummerierten Abschnitten
- Schlussfolgerungen/Empfehlungen

Halte den Ton sachlich und professionell. Antworte nur mit dem Bericht.`,
};

// Get file extension based on mime type
function getFileExtension(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/webm;codecs=opus': 'webm',
    'audio/mp4': 'm4a',
    'audio/ogg': 'ogg',
    'audio/ogg;codecs=opus': 'ogg',
    'audio/wav': 'wav',
    'audio/mpeg': 'mp3',
  };
  return mimeToExt[mimeType] || 'webm';
}

function getSystemPrompt(mode: EnrichmentMode, contextType?: ContextType): string {
  const base = mode === 'context' && contextType
    ? CONTEXT_PROMPTS[contextType]
    : ENRICHMENT_PROMPTS[mode as keyof typeof ENRICHMENT_PROMPTS];
  return base + SAME_LANGUAGE;
}

async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// ---------- Transkription ----------

export async function transcribeWithOpenAI(audioBlob: Blob, apiKey: string, language: Language): Promise<string> {
  const extension = getFileExtension(audioBlob.type);
  const filename = `audio.${extension}`;

  const formData = new FormData();
  formData.append('file', audioBlob, filename);
  formData.append('model', MODELS.openaiTranscribe);
  formData.append('language', language);
  formData.append('response_format', 'text');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage = error.error?.message || `Transkription fehlgeschlagen (${response.status})`;

    if (response.status === 401) {
      throw new Error('Ungültiger OpenAI API Key.');
    } else if (response.status === 429) {
      throw new Error('API Rate Limit erreicht. Bitte warte einen Moment.');
    } else if (response.status === 400) {
      throw new Error('Audio konnte nicht verarbeitet werden. Versuche es erneut.');
    }

    throw new Error(errorMessage);
  }

  const text = await response.text();
  return text.trim();
}

async function callGemini(apiKey: string, parts: object[], systemPrompt?: string): Promise<string> {
  const body: Record<string, unknown> = { contents: [{ role: 'user', parts }] };
  if (systemPrompt) body.systemInstruction = { parts: [{ text: systemPrompt }] };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage = error.error?.message || `Gemini Anfrage fehlgeschlagen (${response.status})`;

    if (response.status === 401 || response.status === 403 || /API key/i.test(errorMessage)) {
      throw new Error('Ungültiger Gemini API Key.');
    } else if (response.status === 429) {
      throw new Error('API Rate Limit erreicht. Bitte warte einen Moment.');
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  const out = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p: { text?: string }) => p.text ?? '')
    .join('')
    .trim();
  if (!out && data.promptFeedback?.blockReason) {
    throw new Error(`Gemini hat die Anfrage blockiert (${data.promptFeedback.blockReason}).`);
  }
  return out;
}

export async function transcribeWithGemini(audioBlob: Blob, apiKey: string, language: Language): Promise<string> {
  // Gemini erwartet den reinen MIME-Typ ohne Codec-Angabe
  const mimeType = (audioBlob.type || 'audio/webm').split(';')[0];
  const data = await blobToBase64(audioBlob);
  const instruction = language === 'de'
    ? 'Transkribiere diese Sprachaufnahme wortgetreu. Antworte NUR mit dem Transkript, ohne Einleitung.'
    : 'Transcribe this voice recording verbatim. Reply ONLY with the transcript, no preamble.';
  return callGemini(apiKey, [
    { text: instruction },
    { inline_data: { mime_type: mimeType, data } },
  ]);
}

// ---------- Anreicherung ----------

export async function enrichWithOpenAI(
  text: string,
  mode: EnrichmentMode,
  apiKey: string,
  contextType?: ContextType
): Promise<string> {
  // For original mode, just return the text as-is
  if (mode === 'original') {
    return text;
  }

  // Neue Modelle lehnen temperature und max_tokens ab, daher nur die Pflichtfelder
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODELS.openaiChat,
      messages: [
        { role: 'system', content: getSystemPrompt(mode, contextType) },
        { role: 'user', content: text },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage = error.error?.message || `OpenAI Anfrage fehlgeschlagen (${response.status})`;

    if (response.status === 401) {
      throw new Error('Ungültiger OpenAI API Key.');
    } else if (response.status === 429) {
      throw new Error('API Rate Limit erreicht. Bitte warte einen Moment.');
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || '';
}

export async function enrichWithAnthropic(
  text: string,
  mode: EnrichmentMode,
  apiKey: string,
  contextType?: ContextType
): Promise<string> {
  // For original mode, just return the text as-is
  if (mode === 'original') {
    return text;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODELS.anthropic,
      max_tokens: 2000,
      system: getSystemPrompt(mode, contextType),
      messages: [
        { role: 'user', content: text },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage = error.error?.message || `Anthropic Anfrage fehlgeschlagen (${response.status})`;

    if (response.status === 401) {
      throw new Error('Ungültiger Anthropic API Key.');
    } else if (response.status === 429) {
      throw new Error('API Rate Limit erreicht. Bitte warte einen Moment.');
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.content[0]?.text?.trim() || '';
}

export async function enrichWithGemini(
  text: string,
  mode: EnrichmentMode,
  apiKey: string,
  contextType?: ContextType
): Promise<string> {
  if (mode === 'original') {
    return text;
  }
  return callGemini(apiKey, [{ text }], getSystemPrompt(mode, contextType));
}

export interface ApiKeys {
  openai: string;
  anthropic: string;
  gemini: string;
}

/**
 * Wer transkribiert: der gewählte Anbieter, falls er Audio kann.
 * Claude kann kein Audio, dann springt OpenAI oder Gemini ein.
 */
export function getTranscriptionProvider(provider: LLMProvider, keys: ApiKeys): 'gemini' | 'openai' | null {
  if (provider === 'gemini' && keys.gemini) return 'gemini';
  if (provider === 'openai' && keys.openai) return 'openai';
  if (keys.openai) return 'openai';
  if (keys.gemini) return 'gemini';
  return null;
}

export function isReady(provider: LLMProvider, keys: ApiKeys): boolean {
  return Boolean(keys[provider]) && getTranscriptionProvider(provider, keys) !== null;
}

export async function transcribeAudio(
  audioBlob: Blob,
  provider: LLMProvider,
  keys: ApiKeys,
  language: Language
): Promise<string> {
  const via = getTranscriptionProvider(provider, keys);
  if (via === 'gemini') return transcribeWithGemini(audioBlob, keys.gemini, language);
  if (via === 'openai') return transcribeWithOpenAI(audioBlob, keys.openai, language);
  throw new Error(language === 'de'
    ? 'Für die Transkription wird ein Gemini- oder OpenAI-Schlüssel gebraucht.'
    : 'Transcription needs a Gemini or OpenAI key.');
}

export async function enrichText(
  text: string,
  mode: EnrichmentMode,
  provider: LLMProvider,
  keys: ApiKeys,
  contextType?: ContextType
): Promise<string> {
  // For original mode, no API call needed
  if (mode === 'original') {
    return text;
  }

  if (provider === 'gemini') {
    if (!keys.gemini) throw new Error('Gemini API Key fehlt');
    return enrichWithGemini(text, mode, keys.gemini, contextType);
  } else if (provider === 'openai') {
    if (!keys.openai) throw new Error('OpenAI API Key fehlt');
    return enrichWithOpenAI(text, mode, keys.openai, contextType);
  } else {
    if (!keys.anthropic) throw new Error('Anthropic API Key fehlt');
    return enrichWithAnthropic(text, mode, keys.anthropic, contextType);
  }
}
