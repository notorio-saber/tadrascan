import { useState, useEffect } from 'react';
import { getProducts } from '../services/firestore/store';
import type { AffiliateProduct } from '../types/database';
import { ShoppingBag, ExternalLink, Sparkles } from 'lucide-react';

export default function Store() {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar loja", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto w-full pb-32 mt-4">
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-semibold tracking-widest uppercase mb-6 shadow-sm backdrop-blur-md text-white/80">
          <Sparkles className="w-3 h-3 text-primary-400" />
          Recomendações Premium
        </div>
        <h2 className="text-3xl md:text-5xl font-jakarta font-semibold text-white mb-4">
          Skin<span className="gradient-text bg-gradient-to-r from-primary-400 to-primary-600">Store</span>
        </h2>
        <p className="text-white/60 font-inter max-w-md mx-auto">
          Os melhores produtos do mercado, selecionados pela nossa inteligência artificial para maximizar seus resultados.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 font-inter">Nenhum produto cadastrado no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative group flex flex-col h-full">
              {/* Background Glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-600/30 to-blue-600/30 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500 z-0"></div>
              
              <div className="glass-effect bg-white/5 border border-white/10 rounded-3xl p-6 relative z-10 flex flex-col h-full hover:bg-white/10 transition-colors">
                
                <div className="w-full aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-5 relative flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent"></div>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-screen relative z-10 filter drop-shadow-2xl" />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-white/20 relative z-10" />
                  )}
                  <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-semibold tracking-wider uppercase text-white/80 z-20">
                    {product.category}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <p className="text-xs text-primary-400 font-semibold tracking-wider uppercase mb-1 font-inter">
                    {product.brand}
                  </p>
                  <h3 className="text-lg font-jakarta font-semibold text-white mb-2 leading-tight">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-white/50 line-clamp-2 font-inter mb-4">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 mt-auto flex items-center justify-between">
                  <div>
                    {product.price && (
                      <p className="text-lg font-jakarta font-bold text-white">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </p>
                    )}
                  </div>
                  <a 
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 glass-button bg-primary-500/30 text-white rounded-xl text-sm font-semibold border border-primary-500/50 hover:bg-primary-500/50 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  >
                    Comprar <ExternalLink className="w-4 h-4" />
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
