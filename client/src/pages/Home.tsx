import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import EmailCaptureForm from '@/components/EmailCaptureForm';

export default function Home() {
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const lastQuestionRef = useRef<string>('');

  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
          el.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAIReframe = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    lastQuestionRef.current = aiInput.trim();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: aiInput }),
      });
      if (!res.ok) throw new Error('Erro na resposta');
      const data = await res.json();
      setAiResult(data.response);
    } catch {
      setAiError('Algo correu mal. Tenta novamente.');
    } finally {
      setAiLoading(false);
    }
  };

  const faqItems = [
    {
      question: 'O acesso é imediato?',
      answer: 'Sim! Após a confirmação do pagamento, você recebe acesso instantâneo ao protocolo completo de 15 dias. Sem esperas, sem burocracia.'
    },
    {
      question: 'Serve para quem quer reconquistar o ex?',
      answer: 'Magnetus III não é sobre reconquistar. É sobre ressignificar sua identidade para que você nunca mais precise de migalhas. Se ele voltar, será porque você se tornou inegável.'
    },
    {
      question: 'Tenho vergonha, o nome aparece na fatura?',
      answer: 'Sua privacidade é sagrada. O nome que aparece na fatura é genérico e discreto. Ninguém saberá o que você comprou.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden">
      {/* HERO SECTION - IMAGEM ORIGINAL LIMPA */}
      <header className="relative w-full bg-black">
        <a href="#oferta" className="block w-full transition-opacity hover:opacity-95">
          <img 
            src="/images/herooo.png" 
            alt="Ensinaram-te a esperar. Vim ensinar-te a governar." 
            className="w-full h-auto max-w-2xl mx-auto md:max-w-4xl lg:max-w-full"
          />
        </a>
      </header>

      <EmailCaptureForm lastQuestion={lastQuestionRef.current} />

      {/* AI MIRROR SECTION - CENTRALIZADO */}
      <section className="py-32 bg-zinc-950 px-6 border-y border-gold/10 relative text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-16 reveal">
            <h2 className="text-4xl md:text-5xl gold-text mb-4 italic font-serif">O Espelho da Soberania ✨</h2>
            <p className="text-gray-400 font-light uppercase tracking-widest text-xs">Diagnóstico Instantâneo de Governo</p>
          </div>

          <div className="glass-card p-8 md:p-12 reveal">
            <p className="text-gray-300 mb-8 text-center italic">
              "Onde é que a tua coroa caiu? Descreve uma situação onde te sentiste invisível, trocada ou sem poder. Deixa-me mostrar-te o código para retomar o trono."
            </p>
            
            <div className="space-y-6">
              <textarea 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ex: Ele visualizou e não respondeu... Sinto que ninguém me valoriza no trabalho... Sinto que sou sempre a segunda opção..." 
                className="w-full bg-black/50 border border-gold/20 rounded-2xl p-6 text-gray-200 focus:border-gold/50 focus:outline-none transition-colors min-h-[150px] italic text-center"
              />
              
              <button 
                onClick={handleAIReframe}
                disabled={aiLoading}
                className="btn-gold w-full py-5 rounded-2xl text-lg uppercase font-bold flex items-center justify-center gap-3 disabled:opacity-50 mx-auto"
              >
                <span>Ativar Diagnóstico Soberano ✨</span>
                {aiLoading && <div className="spinner border-t-black"></div>}
              </button>
            </div>

            {aiError && <p className="mt-6 text-red-400 text-sm text-center">{aiError}</p>}
            {aiResult && (
              <div className="mt-12 p-8 ai-response-box rounded-2xl reveal active animate-scale-up text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="text-gold font-bold text-xs uppercase tracking-widest">Resposta de Sol Lima AI</span>
                </div>
                <div className="text-gray-300 leading-relaxed italic text-lg space-y-4 whitespace-pre-wrap">{aiResult}</div>
                <div className="mt-8 flex justify-center">
                  <a href="#oferta" className="text-gold text-xs uppercase tracking-[0.3em] font-bold hover:opacity-70 transition-opacity border-b border-gold/30 pb-1">
                    Aprender o protocolo completo no Magnetus III
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TENSION SECTION - CENTRALIZADO */}
      <section className="py-32 bg-black px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="border-l-0 pl-0 space-y-12 reveal">
            <h2 className="text-3xl md:text-5xl mb-10 leading-snug italic font-serif">
              Sentes o aperto no peito?<br />
              <span className="text-gray-500 text-2xl md:text-3xl">Aquele silêncio que grita que, não importa o quanto faças... continuas a ser a</span> <span className="gold-text">segunda opção</span>.
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-gray-400 font-light leading-relaxed">
              <p>
                O feminicídio emocional não é um golpe seco. É uma erosão lenta. É o cansaço de ser a mulher que resolve tudo para todos, mas que habita um castelo onde as luzes estão sempre a piscar.
              </p>
              <p className="text-2xl md:text-3xl gold-text italic font-serif py-4">
                Quem te convenceu de que precisavas de aprovação para existir?
              </p>
              <p>
                Este não é um livro de dicas. É um inventário de guerra contra a invisibilidade. É sobre desinstalar o sistema de quem foi programada para ser escolhida e ativar o sistema de quem <span className="text-white font-semibold">decide ser o destino</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROTOCOL SECTION - 3 PILLARS - CENTRALIZADO */}
      <section className="py-32 bg-black px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 reveal">
            <h2 className="text-4xl md:text-6xl gold-text mb-6 uppercase tracking-tighter italic font-serif">Protocolo de Ativação</h2>
            <p className="text-gray-500 tracking-[0.3em] text-xs uppercase">A tríade do governo pessoal</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* A1: Atrair */}
            <div className="glass-card p-12 group hover:bg-gold/5 transition-colors reveal text-center overflow-hidden rounded-3xl">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663374998284/WD4iXKUYMQAx6qrV7pXDRN/a1-atrair-magnetismo-m8h8xyMNu5sDusSD47me9p.webp"
                alt="A1 - Atrair"
                className="w-full h-48 object-cover rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="w-14 h-14 border border-gold/30 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform mx-auto">
                <span className="gold-text text-xl font-bold font-serif italic text-2xl">A1</span>
              </div>
              <h3 className="text-2xl mb-6 font-serif italic text-white">Atrair</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Não pela carência, mas pela presença soberana. Aprende a parar de caçar e torna-te o eixo onde tudo converge. Magnetismo não se pede, emite-se.
              </p>
            </div>

            {/* A2: Ativar - CENTRAL & HIGHLIGHTED */}
            <div className="glass-card p-12 border-gold/40 scale-105 shadow-2xl relative z-10 bg-white/5 reveal text-center overflow-hidden rounded-3xl">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663374998284/WD4iXKUYMQAx6qrV7pXDRN/a2-ativar-poder-btkC5xNgMPxAkvXQXDFJtn.webp"
                alt="A2 - Ativar"
                className="w-full h-48 object-cover rounded-2xl mb-8"
              />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-tighter">Essencial</div>
              <div className="w-14 h-14 bg-gold rounded-2xl flex items-center justify-center mb-8 mx-auto">
                <span className="text-black text-xl font-bold font-serif italic text-2xl">A2</span>
              </div>
              <h3 className="text-2xl mb-6 font-serif italic text-white">Ativar</h3>
              <p className="text-gray-200 text-sm leading-relaxed font-semibold">
                O protocolo de 15 dias baseado em neurociência que ressignifica a tua identidade celular. É o fim da "menina boazinha" e o nascimento da mulher que governa.
              </p>
            </div>

            {/* A3: Agrupar */}
            <div className="glass-card p-12 group hover:bg-gold/5 transition-colors reveal text-center overflow-hidden rounded-3xl">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663374998284/WD4iXKUYMQAx6qrV7pXDRN/a3-agrupar-imperio-jTq5ZGN4SZo29XSEBtSkfv.webp"
                alt="A3 - Agrupar"
                className="w-full h-48 object-cover rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="w-14 h-14 border border-gold/30 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform mx-auto">
                <span className="gold-text text-xl font-bold font-serif italic text-2xl">A3</span>
              </div>
              <h3 className="text-2xl mb-6 font-serif italic text-white">Agrupar</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Governar o teu ecossistema. Relações, finanças e legado alinhados à tua nova frequência de poder. Onde o caos termina, o teu império começa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ANTES VS DEPOIS SECTION - TRANSFORMAÇÃO IMPACTANTE */}
      <section className="py-32 bg-black px-6 border-b border-gold/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 reveal">
            <h2 className="text-4xl md:text-6xl gold-text mb-6 uppercase tracking-tighter italic font-serif">Antes vs Depois</h2>
            <p className="text-gray-400 text-xl italic">O que muda quando você ativa seu magnetismo</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16">
            {/* ANTES */}
            <div className="glass-card p-12 bg-red-950/20 border border-red-900/30 rounded-3xl reveal">
              <h3 className="text-3xl font-serif italic text-red-400 mb-8 text-center">ANTES DO PROTOCOLO</h3>
              <ul className="space-y-6 text-gray-300">
                <li className="flex items-start gap-4">
                  <span className="text-red-400 text-2xl font-bold mt-1">✗</span>
                  <span className="text-lg">Você explica, justifica e negocia cada decisão sua</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-red-400 text-2xl font-bold mt-1">✗</span>
                  <span className="text-lg">Sente-se invisível mesmo quando está visível</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-red-400 text-2xl font-bold mt-1">✗</span>
                  <span className="text-lg">Resolve tudo para todos, mas ninguém te valoriza</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-red-400 text-2xl font-bold mt-1">✗</span>
                  <span className="text-lg">Espera aprovação para existir plenamente</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-red-400 text-2xl font-bold mt-1">✗</span>
                  <span className="text-lg">Relacionamentos rasos que te deixam vazia</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-red-400 text-2xl font-bold mt-1">✗</span>
                  <span className="text-lg">Medo de ser "egoísta" por colocar você em primeiro lugar</span>
                </li>
              </ul>
            </div>

            {/* DEPOIS */}
            <div className="glass-card p-12 bg-gold/10 border border-gold/40 rounded-3xl reveal">
              <h3 className="text-3xl font-serif italic text-gold mb-8 text-center">DEPOIS DO PROTOCOLO</h3>
              <ul className="space-y-6 text-gray-200">
                <li className="flex items-start gap-4">
                  <span className="text-gold text-2xl font-bold mt-1">✓</span>
                  <span className="text-lg font-semibold">Você decide. Ponto. Sem explicações.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-gold text-2xl font-bold mt-1">✓</span>
                  <span className="text-lg font-semibold">Torna-se o eixo onde tudo converge</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-gold text-2xl font-bold mt-1">✓</span>
                  <span className="text-lg font-semibold">Exige mais. Recebe mais. Governa mais.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-gold text-2xl font-bold mt-1">✓</span>
                  <span className="text-lg font-semibold">Sua presença é magnetismo puro</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-gold text-2xl font-bold mt-1">✓</span>
                  <span className="text-lg font-semibold">Relacionamentos profundos e significativos</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-gold text-2xl font-bold mt-1">✓</span>
                  <span className="text-lg font-semibold">Você é a prioridade. Sempre.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MATERIAIS SECTION */}
      <section className="py-32 bg-zinc-950 px-6 border-b border-gold/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 reveal">
            <h2 className="text-4xl md:text-6xl gold-text mb-6 uppercase tracking-tighter italic font-serif">O Acervo Soberano</h2>
            <p className="text-gray-400 text-xl italic">O conhecimento exato para retomar o seu trono</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-stretch">
            {/* EBOOK PRINCIPAL */}
            <div className="glass-card p-10 flex flex-col items-center text-center reveal border border-gold/20 rounded-3xl relative">
              <div className="absolute -top-4 bg-gold text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-tighter">Material Principal</div>
              <img 
                src="/images/ebook magnetus.jpeg" 
                alt="Magnetus Feminino" 
                className="w-64 h-auto object-cover rounded-xl mb-8 shadow-2xl glow-gold"
              />
              <h3 className="text-3xl font-serif italic text-white mb-6">Magnetus Feminino</h3>
              <div className="text-gray-300 text-base leading-relaxed space-y-4">
                <p>
                  Um guia direto para despertar sua presença magnética, elevar seu valor percebido e ativar a energia feminina que atrai naturalmente amor, respeito e desejo.
                </p>
                <p>
                  Aprenda a se posicionar com confiança e se tornar inesquecível sem correr atrás de ninguém.
                </p>
              </div>
            </div>

            {/* EBOOK BONUS */}
            <div className="glass-card p-10 flex flex-col items-center text-center reveal border border-white/10 rounded-3xl relative">
              <div className="absolute -top-4 bg-white/20 text-white border border-white/30 text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-tighter">Bônus Exclusivo</div>
              <img 
                src="/images/ebook ANTIDITI FEMININO-capa .png" 
                alt="Antídoto do Antivalor" 
                className="w-64 h-auto object-cover rounded-xl mb-8 shadow-2xl"
              />
              <h3 className="text-3xl font-serif italic text-white mb-6">Antídoto do Antivalor</h3>
              <h4 className="text-gold text-sm uppercase tracking-widest mb-6 font-bold">Manual de Autocirurgia</h4>
              <div className="text-gray-300 text-base leading-relaxed space-y-4">
                <p>
                  Descubra os padrões, hábitos e defesas emocionais que sabotam sua imagem, afastam oportunidades e diminuem seu valor percebido.
                </p>
                <p>
                  Este guia mostra como eliminar o que te enfraquece, romper ciclos repetitivos e recuperar sua força natural.
                </p>
                <p className="text-gold italic font-serif mt-4 text-xl">
                  "Às vezes, o problema não é o que falta — é o que precisa sair."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER SECTION - FULL WIDTH IMAGE */}
      <section id="oferta" className="relative bg-black border-y border-gold/10">
        <img 
          src="/images/offer-section.png"
          alt="Magnetus III - Oferta Completa"
          className="w-full h-auto object-contain"
        />
        {/* Overlay Button for Mobile/Fallback */}
        <div className="absolute inset-0 flex items-end justify-center pb-12 pointer-events-none">
          <a 
            href="https://pay.kirvano.com/0ef2fba1-c83e-46bf-9632-51117043d8b5"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-12 py-4 rounded-full text-sm uppercase font-black tracking-widest hover:scale-110 transition-transform pointer-events-auto"
          >
            Ativar Magnetismo Agora
          </a>
        </div>
      </section>

      {/* GUARANTEE SECTION - CENTRALIZADO COM SELO */}
      <section className="py-20 bg-black px-6 border-b border-gold/10">
        <div className="max-w-4xl mx-auto text-center reveal">
          <div className="inline-block mb-6">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663374998284/WD4iXKUYMQAx6qrV7pXDRN/seal-guarantee-premium-Dbwk3BSeHpCJWRjyTzFXPh.webp"
              alt="Garantia Premium 7 Dias"
              className="w-32 h-32 object-contain"
            />
          </div>
          <h3 className="text-3xl md:text-4xl font-serif italic text-white mb-6">GARANTIA PREMIUM</h3>
          <p className="text-gray-400 text-lg leading-relaxed">
            Se em uma semana você não sentir seu poder voltando, eu devolvo cada centavo. Sem perguntas, sem burocracia. O risco é todo meu.
          </p>
        </div>
      </section>

      <section className="py-32 bg-black px-6 border-b border-gold/10">
        <div className="max-w-4xl mx-auto text-center reveal">
          <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-12">Sobre a Autora</h2>
          <div className="flex flex-col items-center gap-12">
            <img src="/images/sol-lima.jpg" alt="Sol Lima - Autora de Magnetus III" className="w-64 h-80 object-cover rounded-2xl shadow-2xl glow-gold" />
            <div className="space-y-6">
              <h3 className="text-3xl font-serif italic gold-text">Sol Lima</h3>
              <p className="text-gray-400 text-lg leading-relaxed italic">Ela não ensina mulheres a agradar.<br />Ela ensina mulheres a pararem de se diminuir para caber.</p>
              <p className="text-gray-400 text-lg leading-relaxed italic">Sol Lima é uma estudiosa do comportamento humano feminino na prática — não no discurso bonito de internet, mas naquilo que acontece quando ninguém está olhando.</p>
              <p className="text-gold text-xl italic font-serif mb-6 leading-relaxed">Eles queriam que você fosse boazinha.<br />Eu vou te ensinar a ser inesquecível.<br />Reescreva as regras.</p>
              <p className="text-gold text-sm uppercase tracking-widest font-bold">12.000+ mulheres ativadas | Bestseller em 3 países | Especialista em Governo Pessoal</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION - CENTRALIZADO */}
      <section className="py-32 bg-black px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-4">Ainda tem dúvidas?</h2>
          </div>

          <div className="space-y-4 reveal">
            {faqItems.map((item, index) => (
              <div key={index} className="glass-card border border-gold/20 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gold/5 transition-colors"
                >
                  <h3 className="text-lg md:text-xl font-serif italic text-white text-center flex-1">{item.question}</h3>
                  <div className={`text-gold transition-transform ml-4 flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </button>
                
                {expandedFaq === index && (
                  <div className="px-6 pb-6 border-t border-gold/10 animate-scale-up text-center">
                    <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 bg-black border-t border-gold/5 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <div className="gold-text text-3xl font-serif italic mb-10">Magnetus III</div>
          <p className="text-[9px] md:text-[11px] text-gray-600 tracking-[0.5em] uppercase mb-8">
            © 2026 Magnetus III • Sol Lima • Todos os Direitos Reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
