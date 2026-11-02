import { useState, useEffect } from 'react';
import { getProducts } from '../services/firestore/store';
import type { AffiliateProduct } from '../types/database';
import { ShoppingBag, ExternalLink, Sparkles } from 'lucide-react';

export default function Store() {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        // 1. Busca primeiro os produtos sincronizados da Vitrine TADRA (gerenciados pelo painel)
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
          console.warn("Fallback para produtos locais da vitrine");
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

        // 2. Busca também do Firestore (para produtos customizados)
        const firestoreProducts = await getProducts();
        
        // Mescla sem duplicados
        const allProducts = [...vitrineProducts, ...firestoreProducts];
        const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.name.toLowerCase().trim(), p])).values());
        
        setProducts(uniqueProducts);
      } catch (error) {
        console.error("Erro ao carregar loja", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="p-4 sm:p-6 md:p-12 max-w-6xl mx-auto w-full pb-36 mt-4">
      
      <div className="text-center mb-8">
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
          <p className="text-white/50 font-inter">Nenhum produto encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative group flex flex-col h-full">
              {/* Background Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-600/30 to-blue-600/30 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500 z-0"></div>
              
              <div className="glass-effect bg-white/5 border border-white/10 rounded-3xl p-6 relative z-10 flex flex-col h-full hover:bg-white/10 transition-colors">
                
                <div className="w-full aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-5 relative flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent"></div>
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-contain relative z-10 filter drop-shadow-xl transition-transform group-hover:scale-105 duration-300" 
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-white/20 relative z-10" />
                  )}
                  {product.category && (
                    <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-semibold tracking-wider uppercase text-white/80 z-20">
                      {product.category}
                    </div>
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

                <div className="pt-4 border-t border-white/10 mt-auto flex items-center justify-between gap-3">
                  <div>
                    {product.price && (
                      <p className="text-base font-jakarta font-bold text-white">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </p>
                    )}
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
          ))}
        </div>
      )}
    </div>
  );
}
