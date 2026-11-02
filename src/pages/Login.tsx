import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ScanLine, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/app');
    } catch (error) {
      console.error('Erro ao logar com Google', error);
      alert('Erro ao realizar login. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden bg-transparent">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-20 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Top Brand Tag */}
      <div className="flex flex-col items-center text-center mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-semibold tracking-widest uppercase mb-4 shadow-sm backdrop-blur-md text-white/80">
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          Instituto TADRA • Ecossistema
        </div>
        <h1 className="text-3xl sm:text-5xl font-jakarta font-semibold text-white tracking-tight leading-tight max-w-xl">
          Seu scanner de IA para <br className="hidden sm:inline" />
          <span className="gradient-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600">
            compatibilidade de pele.
          </span>
        </h1>
        <p className="text-white/60 font-inter text-sm sm:text-base max-w-md mt-3">
          Descubra se qualquer cosmético ou dermocosmético realmente funciona para o seu objetivo e tipo de pele antes de usar.
        </p>
      </div>

      {/* Main Interactive Login / Benefits Box */}
      <div className="w-full max-w-md mx-auto my-8 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/30 via-primary-500/10 to-primary-600/30 rounded-[2.2rem] blur-xl opacity-60"></div>

        <div className="glass-effect rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-white/10 to-white/5 border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative z-10 flex flex-col">
          
          {/* Quick value props */}
          <div className="space-y-3.5 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/30 shrink-0">
                <ScanLine className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-white/80 font-inter">
                <strong className="text-white font-medium">Scanner Instantâneo:</strong> Aponte a câmera para a embalagem e ingredientes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/30 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-white/80 font-inter">
                <strong className="text-white font-medium">Diagnóstico de Risco:</strong> Alertas de comedogenicidade, irritação e alergênicos.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/30 shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-white/80 font-inter">
                <strong className="text-white font-medium">Loja Curada:</strong> Recomendações dos protocolos clínicos da TADRA.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 glass-button bg-primary-500/30 border border-primary-500/50 hover:bg-primary-500/40 text-white font-medium rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_25px_theme(colors.primary.500/30%)] transition-all active:scale-[0.98] group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="font-semibold text-sm">Entrar com Google</span>
            <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[11px] text-center text-white/40 mt-4 font-inter">
            Acesso seguro e sem senhas com sua conta Google.
          </p>
        </div>
      </div>

      {/* Footer link to TADRA Clinic ecosystem */}
      <div className="text-center pb-2">
        <a 
          href="https://tadraclinic.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-white/40 hover:text-primary-400 transition-colors font-inter inline-flex items-center gap-1.5"
        >
          <span>Conheça a clínica Instituto TADRA</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
