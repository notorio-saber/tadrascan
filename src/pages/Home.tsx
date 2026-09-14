import { Link } from 'react-router-dom';
import { Camera, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center mt-12">
      
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-semibold tracking-widest uppercase mb-8 shadow-sm backdrop-blur-md text-white/80">
        <Sparkles className="w-3 h-3 text-primary-400" />
        Sua Pele, Nossa Inteligência
      </div>

      <h2 className="text-4xl md:text-5xl font-jakarta font-semibold text-white mb-6 leading-tight tracking-tight">
        Análise profunda para<br/><span className="gradient-text bg-gradient-to-r from-primary-400 to-primary-600">sua pele.</span>
      </h2>
      <p className="text-white/60 mb-12 max-w-md text-base leading-relaxed font-inter">
        Escaneie seus produtos e descubra instantaneamente o grau de compatibilidade com os seus objetivos reais usando Inteligência Artificial.
      </p>
      
      <div className="w-full max-w-md relative group">
        
        {/* Glow effect behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/30 via-primary-500/10 to-primary-600/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

        <div className="glass-effect rounded-[1.5em] relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white/10 to-white/5 border border-white/20 overflow-hidden p-8">
          
          <h3 className="text-sm font-jakarta text-white font-semibold mb-6 uppercase tracking-widest opacity-90">
            Nova Análise
          </h3>
          
          <Link to="/scan" className="w-full flex items-center justify-center gap-3 px-6 py-5 glass-button bg-primary-500/30 border border-primary-500/50 text-white rounded-xl font-medium hover:bg-primary-500/40 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-[0.98] mb-4">
            <Camera className="w-5 h-5" />
            Escanear Embalagem
          </Link>

        </div>
      </div>
    </div>
  );
}
