import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysis } from '../services/firestore/analyses';
import type { AnalysisResult as AnalysisResultType } from '../types/database';
import { ChevronLeft, Info, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-tadra-wine border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-tadra-wine font-semibold animate-pulse">Carregando relatório...</span>
      </div>
    );
  }

  if (!result) {
    return <div className="min-h-screen flex items-center justify-center text-tadra-textSoft">Análise não encontrada.</div>;
  }

  const getColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-sky-700 bg-sky-50 border-sky-200';
    if (score >= 40) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-400 to-emerald-600';
    if (score >= 60) return 'from-sky-400 to-sky-600';
    if (score >= 40) return 'from-amber-400 to-amber-600';
    return 'from-rose-400 to-rose-600';
  };

  const scoreColorClass = getColor(result.compatibilityScore);
  const scoreGradient = getGradient(result.compatibilityScore);

  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto w-full pb-32">
      
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/app" className="w-10 h-10 rounded-full bg-white/60 shadow-sm border border-tadra-wine/10 flex items-center justify-center text-tadra-textStrong hover:bg-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-playfair font-semibold text-tadra-textStrong leading-none">
            Relatório de Pele
          </h2>
          <p className="text-xs text-tadra-textSoft uppercase tracking-widest mt-1">Inteligência Artificial</p>
        </div>
      </div>

      {/* Hero Result Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-tadra-wine/5 border border-white p-8 mb-8 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-tr ${scoreGradient} rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity`}></div>
            <div className={`w-40 h-40 rounded-full flex flex-col items-center justify-center shrink-0 border-4 relative bg-white ${scoreColorClass}`}>
              <span className="text-5xl font-bold font-playfair">{result.compatibilityScore}</span>
              <span className="text-xs font-geist font-bold uppercase tracking-widest opacity-60 mt-1">Score</span>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-tadra-goldLight/20 text-tadra-goldDark text-xs font-semibold tracking-widest uppercase mb-3">
              {result.brand || 'Marca não identificada'}
            </div>
            <h3 className="text-3xl font-playfair font-semibold text-tadra-textStrong mb-3 leading-tight">
              {result.productName || 'Produto'}
            </h3>
            
            <p className="text-tadra-textSoft text-sm leading-relaxed mb-4">
              {result.productDescription || 'Analisamos esta fórmula comparando com as características únicas da sua pele e seus objetivos.'}
            </p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 border border-gray-100">
              <Info className="w-4 h-4 text-gray-400" />
              Classificação: {result.classification}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="space-y-6">
        
        {/* Motivos Positivos */}
        {result.positiveReasons.length > 0 && (
          <div className="bg-emerald-50/50 backdrop-blur-md p-6 rounded-3xl border border-emerald-100/50">
            <h4 className="text-lg font-playfair font-semibold text-emerald-900 mb-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              Por que deu Match?
            </h4>
            <ul className="space-y-4">
              {result.positiveReasons.map((reason, i) => (
                <li key={i} className="text-sm text-emerald-900/80 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pontos de Atenção */}
        {result.attentionPoints.length > 0 && (
          <div className="bg-rose-50/50 backdrop-blur-md p-6 rounded-3xl border border-rose-100/50">
            <h4 className="text-lg font-playfair font-semibold text-rose-900 mb-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              Atenção e Cuidados
            </h4>
            <ul className="space-y-4">
              {result.attentionPoints.map((point, i) => (
                <li key={i} className="text-sm text-rose-900/80 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></div>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dicas de Uso (How to Use) */}
        {result.howToUse && (
          <div className="bg-sky-50/50 backdrop-blur-md p-6 rounded-3xl border border-sky-100/50">
            <h4 className="text-lg font-playfair font-semibold text-sky-900 mb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              Dica da Dermatologista IA
            </h4>
            <p className="text-sm text-sky-900/80 leading-relaxed ml-11">
              {result.howToUse}
            </p>
          </div>
        )}
        
        {/* Fórmula Lida */}
        <div className="bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-gray-200 mt-8">
          <h4 className="text-sm font-geist font-semibold text-gray-500 mb-3 uppercase tracking-widest">
            Fórmula Lida (INCI)
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            {result.originalInci || 'Nenhuma fórmula armazenada.'}
          </p>
        </div>

      </div>
    </div>
  );
}
