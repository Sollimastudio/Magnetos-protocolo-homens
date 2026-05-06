import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'Sol Lima <sol@seudominio.com>';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, question } = req.body;
  if (!email?.trim()) return res.status(400).json({ error: 'Email inválido.' });

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Você entrou no círculo. 🖤',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { background:#050505; color:#e5e5e5; font-family:Georgia,serif; margin:0; padding:0; }
    .container { max-width:560px; margin:0 auto; padding:48px 32px; }
    .logo { color:#D4AF37; font-size:28px; font-style:italic; margin-bottom:40px; }
    h1 { color:#D4AF37; font-size:22px; font-style:italic; line-height:1.4; margin-bottom:24px; }
    p { color:#aaa; font-size:15px; line-height:1.8; margin-bottom:16px; }
    .highlight { color:#e5e5e5; font-style:italic; }
    .cta { display:inline-block; margin-top:32px; padding:14px 36px; background:#D4AF37; color:#000; font-weight:bold; text-decoration:none; border-radius:100px; font-size:13px; letter-spacing:0.1em; text-transform:uppercase; }
    .footer { margin-top:48px; padding-top:24px; border-top:1px solid #222; font-size:11px; color:#444; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Magnetus III</div>
    <h1>Bem-vinda ao lugar onde mulheres param de pedir permissão para existir.</h1>
    <p>O seu email chegou. E isso não é pouco — porque a maioria das mulheres <span class="highlight">continua à espera</span> de que alguém as convide para entrar no próprio poder.</p>
    <p>Você deu o primeiro passo.</p>
    <p>Nas próximas horas, vou enviar-lhe algo que vai fazer sentido de formas que ainda não consegue nomear. Fique atenta.</p>
    <p style="color:#D4AF37; font-style:italic;">— Sol Lima</p>
    <a href="https://magnetus-landing-page.vercel.app/#oferta" class="cta">Ver o Protocolo Completo</a>
    <div class="footer">
      © 2026 Magnetus III · Sol Lima · Todos os direitos reservados<br>
      Para cancelar a subscrição, responda a este email com "cancelar".
    </div>
  </div>
</body>
</html>`,
    });

    if (question?.trim()) {
      const aiResponse = await anthropic.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 350,
        system: `Você é Sol Lima — autora do Magnetus III. Escreva uma resposta pessoal e calorosa para o email de follow-up de uma mulher que acabou de se inscrever no seu site.

CONTEXTO: ela fez uma pergunta ou partilhou uma situação no site. Agora, 30 minutos depois, você está a responder diretamente, como se tivesse ficado a pensar nela.

REGRAS:
- Acolha o contexto real que ela trouxe. Se falou de filho, família ou trabalho — responda sobre isso.
- NUNCA assuma que a ausência de alguém é de um parceiro romântico.
- Tom: pessoal, direto, como uma carta escrita à mão.
- Termine com uma pergunta que a faça refletir.
- Máximo: 3 parágrafos.
- Escreva em português.`,
        messages: [
          {
            role: 'user',
            content: `A mulher escreveu isso no site: "${question}"\n\nEscreva o corpo do email de resposta (só o texto, sem saudação nem assunto).`,
          },
        ],
      });

      const personalizedText =
        aiResponse.content[0].type === 'text'
          ? aiResponse.content[0].text
          : 'Fiquei a pensar em si depois de ler o que partilhou.';

      const scheduledAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Fiquei a pensar em si... 🖤',
        scheduledAt,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { background:#050505; color:#e5e5e5; font-family:Georgia,serif; margin:0; padding:0; }
    .container { max-width:560px; margin:0 auto; padding:48px 32px; }
    .logo { color:#D4AF37; font-size:24px; font-style:italic; margin-bottom:40px; }
    .quote { border-left:2px solid #D4AF37; padding-left:20px; margin:24px 0; color:#888; font-style:italic; font-size:14px; line-height:1.7; }
    p { color:#bbb; font-size:15px; line-height:1.9; margin-bottom:18px; }
    .signature { color:#D4AF37; font-style:italic; font-size:17px; margin-top:32px; }
    .cta { display:inline-block; margin-top:32px; padding:14px 36px; background:#D4AF37; color:#000; font-weight:bold; text-decoration:none; border-radius:100px; font-size:13px; letter-spacing:0.1em; text-transform:uppercase; }
    .footer { margin-top:48px; padding-top:24px; border-top:1px solid #222; font-size:11px; color:#444; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Sol Lima</div>
    <div class="quote">"${question}"</div>
    ${personalizedText
      .split('\n\n')
      .filter(Boolean)
      .map((p: string) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('')}
    <p class="signature">— Sol Lima</p>
    <a href="https://magnetus-landing-page.vercel.app/#oferta" class="cta">Quero o Protocolo Completo</a>
    <div class="footer">
      © 2026 Magnetus III · Sol Lima<br>
      Para cancelar, responda "cancelar".
    </div>
  </div>
</body>
</html>`,
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Erro ao processar inscrição.' });
  }
}
