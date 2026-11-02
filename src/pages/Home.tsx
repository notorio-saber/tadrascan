import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Sparkles, UserCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getSkinProfile } from '../services/firestore/skinProfiles';
import type { SkinProfile } from '../types/database';

export default function Home() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      if (currentUser) {
        try {
          const userProf = await getSkinProfile(currentUser.uid);
          setProfile(userProf);
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }
    checkProfile();
  }, [currentUser]);

  return (
    <div className="p-4 sm:p-6 md:p-12 max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center mt-4">
      
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-semibold tracking-widest uppercase mb-6 shadow-sm backdrop-blur-md text-white/80">
        <Sparkles className="w-3 h-3 text-primary-400" />
        Sua Pele, Nossa Inteligência
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-jakarta font-semibold text-white mb-4 leading-tight tracking-tight">
        Análise profunda para<br/><span className="gradient-text bg-gradient-to-r from-primary-400 to-primary-600">sua pele.</span>
      </h2>
      <p className="text-white/60 mb-8 max-w-md text-sm sm:text-base leading-relaxed font-inter">
        Escaneie seus produtos e descubra instantaneamente o grau de compatibilidade com os seus objetivos reais usando Inteligência Artificial.
      </p>

      {/* Alerta de Quiz de Perfil de Pele */}
      {!loading && !profile && (
        <div className="w-full max-w-md mb-6">
          <Link 
            to="/onboarding" 
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-600/10 border border-primary-500/40 text-left hover:border-primary-400 transition-all shadow-[0_0_20px_theme(colors.primary.500/15%)] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/30">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white font-jakarta">Complete seu Perfil de Pele</h4>
                <p className="text-xs text-white/60 font-inter">Faça o teste rápido para a IA calibrar as análises</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
      
      <div className="w-full max-w-md relative group">
        
        {/* Glow effect behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/30 via-primary-500/10 to-primary-600/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

        <div className="glass-effect rounded-[1.5em] relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white/10 to-white/5 border border-white/20 overflow-hidden p-6 sm:p-8">
          
          <h3 className="text-sm font-jakarta text-white font-semibold mb-6 uppercase tracking-widest opacity-90">
            Nova Análise
          </h3>
          
          <div className="flex flex-col gap-3">
            <Link to="/scan" className="w-full flex items-center justify-center gap-3 px-6 py-4 glass-button bg-primary-500/30 border border-primary-500/50 text-white rounded-xl font-medium hover:bg-primary-500/40 transition-all shadow-[0_0_20px_theme(colors.primary.500/25%)] active:scale-[0.98]">
              <Camera className="w-5 h-5" />
              Escanear Embalagem
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
