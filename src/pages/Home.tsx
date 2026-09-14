import { Link } from 'react-router-dom';
import { Camera, Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center mt-8">
      
      <div className="inline-block px-4 py-1.5 rounded-full bg-tadra-goldLight/20 text-tadra-goldDark text-xs font-semibold tracking-widest uppercase mb-6 shadow-sm border border-tadra-goldLight/30 backdrop-blur-sm">
        Sua Pele, Nossa Ciência
      </div>

      <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-tadra-textStrong mb-4 leading-tight">
        Inteligência para<br/><i className="text-tadra-wine">sua pele.</i>
      </h2>
      <p className="text-tadra-textSoft mb-12 max-w-sm text-base leading-relaxed">
        Escaneie seus produtos e descubra instantaneamente o grau de compatibilidade com os seus objetivos reais.
      </p>
      
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-tadra-wine/10 border border-white/80 relative overflow-hidden group">
        
        {/* Glow effect behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-tadra-wine/5 via-tadra-goldLight/10 to-tadra-wine/5 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

        <div className="relative">
          <h3 className="text-sm font-geist text-tadra-textStrong font-semibold mb-6 uppercase tracking-wider">
            Nova Análise
          </h3>
          
          <Link to="/scan" className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-tadra-wine text-white rounded-2xl font-medium hover:bg-tadra-wine/90 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-tadra-wine/30 active:scale-[0.98] mb-4">
            <Camera className="w-5 h-5" />
            Escanear Embalagem
          </Link>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-tadra-textSoft/10"></div>
            <span className="flex-shrink-0 mx-4 text-tadra-textSoft/40 text-xs uppercase tracking-widest">Ou</span>
            <div className="flex-grow border-t border-tadra-textSoft/10"></div>
          </div>

          <Link to="/analyze" className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-transparent text-tadra-textStrong border-2 border-tadra-wine/10 rounded-2xl font-medium hover:bg-tadra-wine/5 hover:border-tadra-wine/20 transition-all active:scale-[0.98]">
            <Search className="w-5 h-5 opacity-50" />
            Digitar ingredientes manualmente
          </Link>
        </div>
      </div>
    </div>
  );
}
