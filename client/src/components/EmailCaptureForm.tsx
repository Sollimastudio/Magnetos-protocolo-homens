import { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

interface EmailCaptureFormProps {
  onSubmit?: (email: string) => void;
  lastQuestion?: string;
}

export default function EmailCaptureForm({ onSubmit, lastQuestion }: EmailCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Por favor, insira seu email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email inválido. Tente novamente.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), question: lastQuestion?.trim() || '' }),
      });
      if (!res.ok) throw new Error('Erro no servidor');
      setIsSubmitted(true);
      if (onSubmit) onSubmit(email);
      setTimeout(() => { setEmail(''); setIsSubmitted(false); }, 4000);
    } catch {
      setError('Algo correu mal. Tenta novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gold to-gold/50 rounded-full blur-2xl opacity-30 animate-pulse" />
          <div className="relative bg-gradient-to-br from-gold/20 to-burgundy/20 backdrop-blur-xl border border-gold/30 rounded-full p-4">
            <Check className="w-8 h-8 text-gold animate-bounce" />
          </div>
        </div>
        <p className="text-center text-gold mt-6 font-serif italic text-lg">Email confirmado! 🎯</p>
        <p className="text-center text-gray-400 mt-2 text-sm max-w-xs">
          {lastQuestion?.trim() ? 'Vou responder pessoalmente ao que partilhou. Fique atenta à sua caixa de entrada. 🖤' : 'Prepare-se para mensagens que mudarão o seu jogo.'}
        </p>
      </div>
    );
  }

  return (
    <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-b from-black via-burgundy/5 to-black">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl opacity-20" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block uppercase tracking-[0.3em] text-[10px] text-gold/80 mb-4 reveal animate-fade-in">
            Acesso Exclusivo
          </span>
          <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-6 reveal" style={{ transitionDelay: '100ms' }}>
            Receba o Diagnóstico Secreto
          </h2>
          <p className="text-lg text-gray-300 font-light italic reveal" style={{ transitionDelay: '200ms' }}>
            Inscreva-se para receber insights provocadores sobre seu poder pessoal.<br />
            Sem spam. Sem filtros. Apenas verdade.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/30 via-burgundy/20 to-gold/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <form
            onSubmit={handleSubmit}
            className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl hover:border-gold/30 transition-all duration-500"
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-3">
              <div className="flex-1 relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gold/60 group-focus-within/input:text-gold transition-colors" />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="seu.email@exemplo.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all duration-300 text-base"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative px-8 py-4 bg-gradient-to-r from-gold via-gold/90 to-gold text-black font-bold rounded-lg hover:shadow-2xl hover:shadow-gold/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap group/btn"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Ativar</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {error && <div className="mt-4 text-red-400 text-sm text-center animate-pulse">{error}</div>}

            {lastQuestion?.trim() && (
              <div className="mt-5 p-4 rounded-xl border border-gold/20 bg-gold/5 text-center">
                <p className="text-xs text-gold/80 italic">✨ Vou responder pessoalmente ao que você partilhou — direto no seu email.</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 font-light">✓ Sua privacidade é sagrada. Nenhum spam. Cancelar é fácil.</p>
            </div>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400 mb-4">Junte-se a 12.000+ mulheres que já ativaram seu poder</p>
          <div className="flex justify-center gap-2">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/30 to-burgundy/30 border border-gold/20 flex items-center justify-center text-xs text-gold font-bold">★</div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
