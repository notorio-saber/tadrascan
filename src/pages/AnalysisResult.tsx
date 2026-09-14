import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysis } from '../services/firestore/analyses';
import type { AnalysisResult as AnalysisResultType } from '../types/database';
import { ChevronLeft, Info, CheckCircle2, AlertTriangle, HelpCircle, ShoppingCart } from 'lucide-react';

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
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
        <span className="text-primary-400 font-semibold animate-pulse font-inter">Carregando relatório...</span>
      </div>
    );
  }

  if (!result) {
    return <div className="min-h-screen flex items-center justify-center text-white/50">Análise não encontrada.</div>;
  }

  const getColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.3)]';
    if (score >= 60) return 'text-sky-400 bg-sky-500/10 border-sky-500/30 shadow-[0_0_20px_rgba(56,189,248,0.3)]';
    if (score >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.3)]';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
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
    <div className="p-6 md:p-12 max-w-3xl mx-auto w-full pb-32 mt-4">
      
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/app" className="w-10 h-10 rounded-full glass-effect bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-jakarta font-semibold text-white leading-none">
            Relatório de Pele
          </h2>
          <p className="text-xs text-primary-400 uppercase tracking-widest mt-1 font-inter">Inteligência Artificial</p>
        </div>
      </div>

      {/* Hero Result Card */}
      <div className="glass-effect bg-gradient-to-b from-white/10 to-white/5 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 p-8 mb-8 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-tr ${scoreGradient} rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
            <div className={`w-40 h-40 rounded-full flex flex-col items-center justify-center shrink-0 border border-white/20 relative backdrop-blur-md ${scoreColorClass}`}>
              <span className="text-5xl font-bold font-jakarta">{result.compatibilityScore}</span>
              <span className="text-xs font-inter font-bold uppercase tracking-widest opacity-70 mt-1">Score</span>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold tracking-widest uppercase mb-3 border border-white/10">
              {result.brand || 'Marca não identificada'}
            </div>
            <h3 className="text-3xl font-jakarta font-semibold text-white mb-3 leading-tight">
              {result.productName || 'Produto'}
            </h3>
            
            <p className="text-white/60 text-sm leading-relaxed mb-6 font-inter">
              {result.productDescription || 'Analisamos esta fórmula comparando com as características únicas da sua pele e seus objetivos.'}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-xs font-medium text-white/70 border border-white/10 backdrop-blur-sm">
                <Info className="w-4 h-4 text-white/50" />
                Classificação: {result.classification}
              </div>
              
              <Link to="/store" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 rounded-lg text-xs font-medium text-primary-300 border border-primary-500/30 backdrop-blur-sm transition-colors">
                <ShoppingCart className="w-4 h-4" />
                Ver na Loja
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="space-y-6">
        
        {/* Motivos Positivos */}
        {result.positiveReasons.length > 0 && (
          <div className="glass-effect bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20">
            <h4 className="text-lg font-jakarta font-semibold text-emerald-400 mb-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              Por que deu Match?
            </h4>
            <ul className="space-y-4">
              {result.positiveReasons.map((reason, i) => (
                <li key={i} className="text-sm text-white/80 flex items-start gap-3 font-inter">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-[0_0_5px_rgba(52,211,153,0.5)]"></div>
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pontos de Atenção */}
        {result.attentionPoints.length > 0 && (
          <div className="glass-effect bg-rose-500/5 p-6 rounded-3xl border border-rose-500/20">
            <h4 className="text-lg font-jakarta font-semibold text-rose-400 mb-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              Atenção e Cuidados
            </h4>
            <ul className="space-y-4">
              {result.attentionPoints.map((point, i) => (
                <li key={i} className="text-sm text-white/80 flex items-start gap-3 font-inter">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0 shadow-[0_0_5px_rgba(244,63,94,0.5)]"></div>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dicas de Uso (How to Use) */}
        {result.howToUse && (
          <div className="glass-effect bg-sky-500/5 p-6 rounded-3xl border border-sky-500/20">
            <h4 className="text-lg font-jakarta font-semibold text-sky-400 mb-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <HelpCircle className="w-5 h-5" />
              </div>
              Dica da Dermatologista IA
            </h4>
            <p className="text-sm text-white/80 leading-relaxed ml-11 font-inter">
              {result.howToUse}
            </p>
          </div>
        )}
        
        {/* Fórmula Lida */}
        <div className="glass-effect bg-white/5 p-6 rounded-3xl border border-white/10 mt-8">
          <h4 className="text-sm font-inter font-semibold text-white/40 mb-3 uppercase tracking-widest">
            Fórmula Lida (INCI)
          </h4>
          <p className="text-xs text-white/30 leading-relaxed font-inter">
            {result.originalInci || 'Nenhuma fórmula armazenada.'}
          </p>
        </div>

      </div>
    </div>
  );
}
