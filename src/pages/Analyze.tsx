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
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto w-full">
      <h2 className="text-3xl font-playfair font-semibold text-tadra-textStrong mb-2">
        Nova Análise
      </h2>
      <p className="text-tadra-textSoft mb-8">
        Cole abaixo a lista de ingredientes (INCI) do cosmético para cruzarmos com o seu perfil de pele.
      </p>

      <div className="bg-white/60 p-6 rounded-2xl shadow-sm border border-tadra-wine/5">
        <label className="block text-sm font-geist text-tadra-textStrong font-medium mb-3">
          Composição do Produto (Ingredientes)
        </label>
        <textarea
          value={inciText}
          onChange={e => setInciText(e.target.value)}
          placeholder="Ex: Aqua, Niacinamide, Glycerin, Salicylic Acid..."
          className="w-full h-40 p-4 rounded-xl border border-gray-200 focus:border-tadra-wine outline-none bg-white font-geist text-sm resize-none mb-4"
        />
        
        <button 
          onClick={handleAnalyze}
          disabled={analyzing || !inciText.trim()}
          className="w-full px-6 py-4 bg-tadra-wine text-white rounded-xl font-medium hover:bg-tadra-wine/90 transition-colors disabled:opacity-50"
        >
          {analyzing ? 'Analisando e Cruzando Dados...' : 'Analisar Compatibilidade'}
        </button>

        <p className="text-xs text-tadra-textSoft text-center mt-4">
          O aplicativo usará as {profile?.concerns.length} queixas do seu perfil para gerar o diagnóstico.
        </p>
      </div>
    </div>
  );
}
