import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/firestore/store';
import { getSkinProfile } from '../services/firestore/skinProfiles';
import { useAuth } from '../contexts/AuthContext';
import type { AffiliateProduct, SkinProfile } from '../types/database';
import { ShoppingBag, ExternalLink, Sparkles, Search, UserCheck } from 'lucide-react';

export default function Store() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreAndProfile = async () => {
      try {
        const [profile] = await Promise.all([
          getSkinProfile(currentUser?.uid)
        ]);
        setSkinProfile(profile);

        let vitrineProducts: AffiliateProduct[] = [];
        try {
          const res = await fetch('https://tadraclinic.com/vitrine/produtos.json');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              vitrineProducts = data.map((item: any) => ({
                id: item.slug || item.id,
                name: item.name,
                brand: item.brand || 'Instituto Tadra',
                category: item.category || 'Geral',
                imageUrl: item.image ? (item.image.startsWith('http') ? item.image : `https://tadraclinic.com/${item.image.replace(/^\.\.\//, '')}`) : '',
                affiliateUrl: item.link || '#',
                description: item.description || item.recommendation || '',
                createdAt: item.created_at || new Date().toISOString()
              }));
            }
          }
        } catch (e) {
          const localRes = await fetch('/produtos.json');
          if (localRes.ok) {
            const data = await localRes.json();
            if (Array.isArray(data)) {
              vitrineProducts = data.map((item: any) => ({
                id: item.slug || item.id,
                name: item.name,
                brand: item.brand || 'Instituto Tadra',
                category: item.category || 'Geral',
                imageUrl: item.image ? (item.image.startsWith('http') ? item.image : `https://tadraclinic.com/${item.image.replace(/^\.\.\//, '')}`) : '',
                affiliateUrl: item.link || '#',
                description: item.description || item.recommendation || '',
                createdAt: item.created_at || new Date().toISOString()
              }));
            }
          }
        }

        const firestoreProducts = await getProducts();
        const allProducts = [...vitrineProducts, ...firestoreProducts];
        const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.name.toLowerCase().trim(), p])).values());
        
        setProducts(uniqueProducts);
      } catch (error) {
        console.error("Erro ao carregar loja", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreAndProfile();
  }, [currentUser]);

  // Algoritmo de cálculo de match baseado no perfil da usuária
  const calculateMatchScore = (product: AffiliateProduct): number | null => {
    if (!skinProfile) return null;

    let score = 75; // Base neutra
    const text = (product.name + ' ' + (product.description || '') + ' ' + product.category).toLowerCase();

    // 1. Tipo de Pele
    if (skinProfile.skinType === 'oily') {
      if (text.includes('oleosidade') || text.includes('acne') || text.includes('matte') || text.includes('seco') || text.includes('gl-') || text.includes('salic')) score += 15;
      if (text.includes('óleo') || text.includes('nutritivo intenso') || text.includes('karite') || text.includes('manteiga')) score -= 25;
    } else if (skinProfile.skinType === 'dry') {
      if (text.includes('hidratante') || text.includes('nutri') || text.includes('karite') || text.includes('b5') || text.includes('cicaplast') || text.includes('baume')) score += 20;
      if (text.includes('antioleosidade') || text.includes('seborregulador')) score -= 15;
    } else if (skinProfile.skinType === 'combo') {
      if (text.includes('equilibrado') || text.includes('fluido') || text.includes('gel')) score += 15;
    }

    // 2. Sensibilidade
    if (skinProfile.sensitivity === 'yes') {
      if (text.includes('sensivel') || text.includes('calmante') || text.includes('centella') || text.includes('b5') || text.includes('reparador')) score += 15;
      if (text.includes('peeling') || text.includes('ácido') || text.includes('retinal') || text.includes('glicólico')) score -= 20;
    }

    // 3. Objetivos
    if (skinProfile.concerns && skinProfile.concerns.length > 0) {
      if (skinProfile.concerns.includes('spots') && (text.includes('clareador') || text.includes('melasma') || text.includes('pigment') || text.includes('mancha') || text.includes('fps 70') || text.includes('fps70'))) {
        score += 15;
      }
      if (skinProfile.concerns.includes('aging') && (text.includes('antirrugas') || text.includes('retinal') || text.includes('booster') || text.includes('colágeno'))) {
        score += 15;
      }
      if (skinProfile.concerns.includes('acne') && (text.includes('acne') || text.includes('cravos') || text.includes('curetas') || text.includes('limpeza'))) {
        score += 15;
      }
    }

    return Math.min(99, Math.max(35, score));
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || 
      p.name.toLowerCase().includes(term) || 
      p.brand.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 md:p-12 max-w-6xl mx-auto w-full pb-36 mt-4">
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-semibold tracking-widest uppercase mb-4 shadow-sm backdrop-blur-md text-white/80">
          <Sparkles className="w-3 h-3 text-primary-400" />
          Vitrine Integrada • Instituto TADRA
        </div>
        <h2 className="text-3xl md:text-5xl font-jakarta font-semibold text-white mb-3">
          Skin<span className="gradient-text bg-gradient-to-r from-primary-400 to-primary-600">Store</span>
        </h2>
        <p className="text-white/60 font-inter max-w-md mx-auto text-sm sm:text-base">
          Produtos e protocolos selecionados pela nossa equipe clínica para potencializar sua rotina.
        </p>
      </div>

      {/* Alerta caso não tenha feito o teste de pele */}
      {!skinProfile && !loading && (
        <div className="w-full max-w-md mx-auto mb-6">
          <Link 
            to="/onboarding" 
            className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-600/10 border border-primary-500/40 text-left hover:border-primary-400 transition-all shadow-[0_0_20px_theme(colors.primary.500/15%)] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/30 shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white font-jakarta">Descubra sua compatibilidade</h4>
                <p className="text-[11px] text-white/60 font-inter">Faça o teste de pele para ver o % de Match dos produtos</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-primary-400 group-hover:translate-x-0.5 transition-transform">Fazer teste →</span>
          </Link>
        </div>
      )}

      {/* Barra de Pesquisa */}
      <div className="w-full max-w-md mx-auto mb-6 relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-white/40 absolute left-4 pointer-events-none" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produto, marca ou benefício..."
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary-400/60 focus:bg-white/10 transition-all font-inter shadow-inner"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 text-xs text-white/40 hover:text-white/80 bg-white/10 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filtro de Categorias */}
      {categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollable-content justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                  ? 'bg-primary-500 text-white border-primary-400 shadow-[0_0_15px_theme(colors.primary.500/40%)]' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Todos os Produtos' : cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 font-inter">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const matchScore = calculateMatchScore(product);

            return (
              <div key={product.id} className="relative group flex flex-col h-full">
                {/* Background Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-600/30 to-blue-600/30 rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500 z-0"></div>
                
                <div className="glass-effect bg-white/5 border border-white/10 rounded-3xl p-6 relative z-10 flex flex-col h-full hover:bg-white/10 transition-colors">
                  
                  {/* Imagem do Produto com cantos arredondados elegantes */}
                  <div className="w-full aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-5 relative flex items-center justify-center p-3">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent"></div>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-contain rounded-xl relative z-10 filter drop-shadow-xl transition-transform group-hover:scale-105 duration-300" 
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <ShoppingBag className="w-12 h-12 text-white/20 relative z-10" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <p className="text-xs text-primary-400 font-semibold tracking-wider uppercase mb-1 font-inter">
                      {product.brand}
                    </p>
                    <h3 className="text-base sm:text-lg font-jakarta font-semibold text-white mb-2 leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs sm:text-sm text-white/50 line-clamp-3 font-inter mb-4">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Rodapé do Card com Badges à esquerda e Botão de Ação à direita */}
                  <div className="pt-4 border-t border-white/10 mt-auto flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      {/* Badge de Categoria */}
                      {product.category && (
                        <div className="w-fit bg-slate-950/85 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-primary-500/30 text-[9px] font-semibold tracking-wider uppercase text-primary-300 truncate shadow-sm">
                          {product.category}
                        </div>
                      )}

                      {/* Badge de Match com Perfil de Pele */}
                      <div>
                        {matchScore !== null ? (
                          <div className={`w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold font-jakarta tracking-wide backdrop-blur-md border shadow-sm flex items-center gap-1 ${
                            matchScore >= 80 
                              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
                              : matchScore >= 60
                                ? 'bg-sky-950/90 border-sky-500/50 text-sky-300'
                                : 'bg-amber-950/90 border-amber-500/50 text-amber-300'
                          }`}>
                            <Sparkles className="w-2.5 h-2.5" />
                            {matchScore}% Match
                          </div>
                        ) : (
                          <Link 
                            to="/onboarding" 
                            className="w-fit px-2 py-0.5 rounded-full text-[9px] font-medium font-inter backdrop-blur-md bg-white/5 border border-white/15 text-white/60 hover:text-primary-300 hover:border-primary-500/40 transition-colors shadow-sm flex items-center gap-1"
                          >
                            Sem teste • Fazer agora
                          </Link>
                        )}
                      </div>
                    </div>

                    <a 
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 glass-button bg-primary-500/30 text-white rounded-xl text-xs sm:text-sm font-semibold border border-primary-500/50 hover:bg-primary-500/50 transition-all shadow-[0_0_15px_theme(colors.primary.500/30%)] active:scale-[0.98] shrink-0"
                    >
                      Ver na Loja <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
