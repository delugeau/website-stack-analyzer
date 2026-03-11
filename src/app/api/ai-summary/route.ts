import { NextRequest, NextResponse } from 'next/server';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('AI summary: OPENAI_API_KEY is missing from environment variables.');
    return NextResponse.json({ error: 'OPENAI_API_KEY not configured', code: 'NO_KEY' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { flags, locale } = body as {
      flags: Array<{
        severity: string;
        message: string;
        detail: string;
      }>;
      locale: string;
    };

    if (!flags || flags.length === 0) {
      return NextResponse.json({ summary: '' });
    }

    const flagsSummary = flags
      .map((f) => `[${f.severity.toUpperCase()}] ${f.message} — ${f.detail}`)
      .join('\n');

    const lang = locale === 'fr' ? 'français' : 'English';

    const openaiRes = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en web analytics et conformité RGPD/ePrivacy. Tu génères des résumés structurés en ${lang}.

RÈGLES DE FORMATAGE OBLIGATOIRES :
- Commence par une ligne de verdict global avec un emoji (✅, ⚠️ ou 🚨) suivi d'une phrase de synthèse
- Puis liste chaque point clé sous forme de bullet points avec des emojis pertinents
- Utilise 🔴 pour les problèmes critiques, 🟠 pour les avertissements, 🟢 pour ce qui est OK, 💡 pour les recommandations
- Termine par une recommandation courte avec 💡
- Maximum 5 bullet points
- Langage simple, compréhensible par un non-technicien
- Pas de titre, pas de formatage markdown (pas de ** ou ##)`,
          },
          {
            role: 'user',
            content: `Voici les résultats d'un scan de conformité d'un site web. Fais-en un résumé structuré :\n\n${flagsSummary}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 400,
      }),
    });

    if (!openaiRes.ok) {
      const errBody = await openaiRes.text();
      console.error('OpenAI API error:', openaiRes.status, errBody);
      return NextResponse.json(
        { error: 'OpenAI API error', detail: errBody },
        { status: 502 }
      );
    }

    const data = await openaiRes.json();
    const summary = data?.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ summary });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('AI summary error:', errorMsg);
    return NextResponse.json(
      { error: 'Failed to generate AI summary', detail: errorMsg },
      { status: 500 }
    );
  }
}
