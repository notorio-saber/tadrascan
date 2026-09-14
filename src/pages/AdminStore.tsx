import { useState, useEffect } from 'react';
import { getProducts, saveProduct, deleteProduct } from '../services/firestore/store';
import type { AffiliateProduct } from '../types/database';
import { Plus, Trash2, Save, ShoppingBag } from 'lucide-react';

export default function AdminStore() {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Formulário
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !affiliateUrl) return;

    setIsSaving(true);
    try {
      const newProduct: AffiliateProduct = {
        name,
        brand,
        category,
        imageUrl,
        affiliateUrl,
        price: price ? parseFloat(price) : undefined,
        description,
        createdAt: new Date().toISOString()
      };
      
      await saveProduct(newProduct);
      
      // Limpar form
      setName(''); setBrand(''); setCategory(''); setImageUrl('');
      setAffiliateUrl(''); setPrice(''); setDescription('');
      
      loadProducts();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar produto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir este produto da loja?')) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto w-full pb-32 mt-4">
      <h2 className="text-3xl font-jakarta font-semibold text-white mb-2">
        Admin <span className="text-primary-400">Store</span>
      </h2>
      <p className="text-white/50 mb-8 font-inter">Gerencie os produtos afiliados da loja.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulário de Cadastro */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSave} className="glass-effect bg-white/5 border border-white/10 rounded-3xl p-6 sticky top-24">
            <h3 className="text-lg font-jakarta text-white font-semibold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-400" /> Adicionar Produto
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-inter text-white/60 mb-1">Nome do Produto *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-inter text-sm outline-none focus:border-primary-500/50" />
              </div>
              <div>
                <label className="block text-xs font-inter text-white/60 mb-1">Marca</label>
                <input type="text" value={brand} onChange={e => setBrand(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-inter text-sm outline-none focus:border-primary-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-inter text-white/60 mb-1">Categoria</label>
                  <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex: Sérum"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-inter text-sm outline-none focus:border-primary-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-inter text-white/60 mb-1">Preço (R$)</label>
                  <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="199.90"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-inter text-sm outline-none focus:border-primary-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-inter text-white/60 mb-1">URL da Imagem</label>
                <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-inter text-sm outline-none focus:border-primary-500/50" />
              </div>
              <div>
                <label className="block text-xs font-inter text-white/60 mb-1">Link de Afiliado *</label>
                <input required type="url" value={affiliateUrl} onChange={e => setAffiliateUrl(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-inter text-sm outline-none focus:border-primary-500/50" />
              </div>
              <div>
                <label className="block text-xs font-inter text-white/60 mb-1">Descrição Curta</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white font-inter text-sm outline-none focus:border-primary-500/50 resize-none" />
              </div>

              <button disabled={isSaving} type="submit" className="w-full py-3 mt-4 glass-button bg-primary-500 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-50 flex items-center justify-center gap-2">
                {isSaving ? 'Salvando...' : <><Save className="w-4 h-4" /> Cadastrar</>}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Produtos */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
          ) : products.length === 0 ? (
             <div className="text-center py-12 glass-effect bg-white/5 border border-white/10 rounded-3xl">
              <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50 font-inter">Nenhum produto cadastrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="glass-effect bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 relative group">
                  <div className="w-20 h-20 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-2" /> : <ShoppingBag className="w-8 h-8 text-white/20" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-primary-400 font-inter uppercase tracking-widest">{p.category || 'Geral'}</p>
                    <h4 className="text-sm font-jakarta font-semibold text-white truncate">{p.name}</h4>
                    <p className="text-xs text-white/50 truncate mb-2">{p.brand}</p>
                    {p.price && <p className="text-sm text-white font-bold">R$ {p.price.toFixed(2)}</p>}
                  </div>
                  
                  <button onClick={() => handleDelete(p.id!)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/20 border border-rose-500/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
