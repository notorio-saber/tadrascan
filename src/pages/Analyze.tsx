import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSkinProfile } from '../services/firestore/skinProfiles';
import { getIngredients } from '../services/firestore/ingredients';
import { saveAnalysis } from '../services/firestore/analyses';
import { analyzeCompatibility } from '../services/engine/compatibility';
import type { SkinProfile, Ingredient } from '../types/database';

export default function Analyze() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [inciText, setInciText] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;
      const p = await getSkinProfile(currentUser.uid);
      if (!p) {
        navigate('/onboarding');
      } else {
        setProfile(p);
      }
      setLoading(false);
    };
    loadProfile();
  }, [currentUser, navigate]);

  const handleAnalyze = async () => {
    if (!profile || !currentUser) return;
    if (!inciText.trim()) return;

    setAnalyzing(true);
    try {
      // 1. Extrair os ingredientes do texto (separados por vírgula)
      const inputNames = inciText.split(',')
        .map(s => s.trim().toLowerCase())
        .filter(s => s.length > 0);

      // 2. Buscar ingredientes no banco
      // Para o MVP, buscamos todos e filtramos na memória. Em produção, usaríamos Algolia ou API dedicada.
      const allIngredients = await getIngredients();
      
      const matchedIngredients: Ingredient[] = [];
      const unknownIngredients: string[] = [];

      inputNames.forEach(input => {
        // Tenta achar match pelo nome exato ou sinônimo
        const match = allIngredients.find(ing => 
          ing.name.toLowerCase() === input || 
          (ing.synonyms && ing.synonyms.map(s => s.toLowerCase()).includes(input))
        );
        if (match) {
          matchedIngredients.push(match);
        } else {
          unknownIngredients.push(input);
        }
      });

      // 3. Rodar o motor de compatibilidade
      const result = analyzeCompatibility(profile, matchedIngredients);
      
      // Anexar não encontrados ao resultado
      result.unknownIngredients = unknownIngredients;
      result.userId = currentUser.uid;
      result.originalInci = inciText;

      // 4. Salvar histórico
      const analysisId = await saveAnalysis(result);

      // 5. Redirecionar para tela de resultado
      navigate(`/result/${analysisId}`);
      
    } catch (error) {
      console.error(error);
      alert('Erro ao analisar os ingredientes.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-2xl mx-auto w-full flex flex-col items-center mt-4 pb-24">
      <h2 className="text-3xl font-jakarta font-semibold text-white mb-2 text-center">
        Busca <span className="gradient-text bg-gradient-to-r from-primary-400 to-primary-600">Manual</span>
      </h2>
      <p className="text-white/60 mb-8 text-center text-sm">
        Cole abaixo a lista de ingredientes (INCI) do cosmético para cruzarmos com o seu perfil de pele.
      </p>

      <div className="w-full relative group">
        
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-primary-600/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

        <div className="w-full glass-effect bg-gradient-to-b from-white/10 to-white/5 p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 relative z-10">
          
          <label className="block text-sm font-jakarta text-white font-medium mb-3 uppercase tracking-widest opacity-90">
            Composição do Produto
          </label>
          
          <div className="relative mb-6">
            <textarea
              value={inciText}
              onChange={e => setInciText(e.target.value)}
              placeholder="Ex: Aqua, Niacinamide, Glycerin, Salicylic Acid..."
              className="w-full h-48 p-4 rounded-xl border border-white/10 bg-darkGray-100/50 text-white placeholder-white/30 focus:border-primary-500/50 outline-none font-inter text-sm resize-none shadow-inner"
            />
          </div>
          
          <button 
            onClick={handleAnalyze}
            disabled={analyzing || !inciText.trim()}
            className="w-full py-4 glass-button bg-primary-500/30 border border-primary-500/50 text-white rounded-xl font-medium hover:bg-primary-500/40 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_theme('colors.primary.500'/30%)] flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analisando Dados...
              </>
            ) : (
              'Analisar Compatibilidade'
            )}
          </button>

          <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-xs text-white/60 leading-relaxed font-inter">
              A Inteligência Artificial fará a varredura e o diagnóstico cruzando a fórmula com as <strong className="text-white">queixas do seu perfil</strong>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
