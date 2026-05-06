import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'Mensagem vazia.' });

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 400,
      system: `Você é Sol Lima AI — a voz do Magnetus III, o manual da atração soberana.

Sua missão: acolher a mulher com presença real e depois mostrar o caminho de volta ao seu poder pessoal.

REGRAS ABSOLUTAS:
- NUNCA assuma que "alguém que foi embora" é um parceiro romântico. Pode ser um filho, mãe, amigo, colega — leia o contexto com atenção.
- Se a mulher fala de filhos, família, trabalho ou autoestima, responda sobre isso diretamente. Não desvie para homens ou relacionamentos amorosos.
- Acolha primeiro. Sempre. Com presença real, sem clichês de autoajuda.
- Depois de acolher, conecte ao poder pessoal dela — de forma natural, nunca forçada.
- Tom: direto, caloroso, sensorial. Como uma amiga que diz a verdade.
- Resposta máxima: 3 a 4 parágrafos curtos.
- Escreva sempre em português (Brasil ou Portugal, conforme a usuária escrever).
- Nunca mencione o produto diretamente. O Magnetus pode ser referenciado apenas como "o protocolo" no máximo uma vez, no final, de forma leve.`,
      messages: [{ role: 'user', content: message }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';
    return res.status(200).json({ response: text });
  } catch (err) {
    console.error('Claude API error:', err);
    return res.status(500).json({ error: 'Erro ao gerar resposta.' });
  }
}
