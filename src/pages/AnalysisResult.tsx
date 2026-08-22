import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysis } from '../services/firestore/analyses';
import type { AnalysisResult as AnalysisResultType } from '../types/database';

export default function AnalysisResult() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      if (!id) return;
      const data = await getAnalysis(id);
      setResult(data);
      setLoading(false);
    };
    loadResult();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Calculando Resultado...</div>;
  }

  if (!result) {
    return <div className="min-h-screen flex items-center justify-center">Análise não encontrada.</div>;
  }

  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getBorderColor = (score: number) => {
    if (score >= 80) return 'border-green-200';
    if (score >= 60) return 'border-blue-200';
    if (score >= 40) return 'border-yellow-200';
    return 'border-red-200';
  };

  const colorClass = getColor(result.compatibilityScore);
  const borderClass = getBorderColor(result.compatibilityScore);

  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto w-full">
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-playfair font-semibold text-tadra-textStrong">
          Diagnóstico
        </h2>
        <Link to="/analyze" className="text-sm font-geist font-medium text-tadra-wine hover:underline">
          Fazer nova análise
        </Link>
      </div>

      {/* Hero Result Card */}
      <div className={`p-8 rounded-3xl border ${borderClass} bg-white shadow-sm mb-6 flex flex-col md:flex-row items-center gap-8`}>
        <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center shrink-0 ${colorClass}`}>
          <span className="text-4xl font-bold font-playfair">{result.compatibilityScore}</span>
          <span className="text-xs font-geist font-medium uppercase tracking-wider opacity-80 mt-1">Score</span>
        </div>
        
        <div>
          <h3 className="text-2xl font-playfair font-semibold text-tadra-textStrong mb-2">
            Compatibilidade {result.classification}
          </h3>
          <p className="text-tadra-textSoft text-sm leading-relaxed">
            Cruzamos os ingredientes fornecidos com o seu perfil de pele. Baseado nos seus objetivos e no seu tipo de pele, aqui está o detalhamento:
          </p>
        </div>
      </div>

      {/* Accordions / Listas */}
      <div className="space-y-6">
        
        {result.positiveReasons.length > 0 && (
          <div className="bg-white/60 p-6 rounded-2xl border border-green-100">
            <h4 className="text-lg font-playfair font-semibold text-green-800 mb-4 flex items-center gap-2">
              <span className="text-xl">✨</span> Por que é bom para você?
            </h4>
            <ul className="space-y-3">
              {result.positiveReasons.map((reason, i) => (
                <li key={i} className="text-sm text-green-900/80 flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.attentionPoints.length > 0 && (
          <div className="bg-white/60 p-6 rounded-2xl border border-red-100">
            <h4 className="text-lg font-playfair font-semibold text-red-800 mb-4 flex items-center gap-2">
              <span className="text-xl">⚠️</span> Pontos de Atenção
            </h4>
            <ul className="space-y-3">
              {result.attentionPoints.map((point, i) => (
                <li key={i} className="text-sm text-red-900/80 flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.unknownIngredients.length > 0 && (
          <div className="bg-white/60 p-6 rounded-2xl border border-gray-200">
            <h4 className="text-lg font-playfair font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-xl">🔍</span> Ingredientes Não Reconhecidos
            </h4>
            <p className="text-sm text-gray-500 mb-2">Estes componentes não constam em nossa base e não puderam ser avaliados:</p>
            <div className="flex flex-wrap gap-2">
              {result.unknownIngredients.map((ing, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
