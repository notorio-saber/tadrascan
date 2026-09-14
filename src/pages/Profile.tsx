import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { AnalysisResult } from '../types/database';
import { History, LogOut, ChevronRight } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Profile() {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser) return;
      
      try {
        const q = query(
          collection(db, 'analyses'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        
        const results: AnalysisResult[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as AnalysisResult);
        });
        
        setHistory(results);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-sky-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto w-full pb-32 mt-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-jakarta font-semibold text-white">Meu Perfil</h2>
          <p className="text-white/50 text-sm font-inter mt-1">{currentUser?.email}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-10 h-10 rounded-full glass-effect bg-white/5 border border-white/10 flex items-center justify-center text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <History className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-jakarta font-semibold text-white">Diário de Pele</h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="glass-effect bg-white/5 border border-white/10 rounded-3xl p-10 text-center flex flex-col items-center">
          <History className="w-12 h-12 text-white/20 mb-4" />
          <p className="text-white/60 font-inter mb-6">Você ainda não analisou nenhum produto.</p>
          <Link to="/scan" className="px-6 py-3 glass-button bg-primary-500/30 text-white rounded-xl font-medium border border-primary-500/50">
            Fazer primeira análise
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Link 
              key={item.id} 
              to={`/result/${item.id}`}
              className="block glass-effect bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors group"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-[10px] text-white/40 font-inter tracking-widest uppercase mb-1">
                    {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <h4 className="text-base font-jakarta font-medium text-white truncate">
                    {item.productName || 'Produto Desconhecido'}
                  </h4>
                  <p className="text-xs text-white/60 truncate mt-1">
                    {item.brand || 'Marca não identificada'}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`text-2xl font-jakarta font-bold ${getScoreColor(item.compatibilityScore)}`}>
                      {item.compatibilityScore}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-white/40">Score</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
