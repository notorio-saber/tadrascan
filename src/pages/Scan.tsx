import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/firestore/products';
import { analyzeCompatibility } from '../services/engine/compatibility';
import { getSkinProfile } from '../services/firestore/skinProfiles';
import { saveAnalysis } from '../services/firestore/analyses';
import { useAuth } from '../contexts/AuthContext';
import { getIngredients } from '../services/firestore/ingredients';
import type { Ingredient } from '../types/database';

export default function Scan() {
  const [scanning, setScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!imagePreview || !currentUser) return;
    setScanning(true);
    setStatusText('Analisando imagem com IA...');

    try {
      // 1. Chamar a função do Netlify (backend) passando a imagem em Base64
      const response = await fetch('/.netlify/functions/scan-product', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: imagePreview })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao se comunicar com a IA');
      }

      const iaResponse = await response.json();

      setStatusText(`Produto detectado: ${iaResponse.brand} ${iaResponse.name}... Cruzando dados!`);
      
      // 2. Buscar o produto no banco
      const allProducts = await getProducts();
      
      const product = allProducts.find(
        p => 
          p.brand?.toLowerCase().trim().includes(iaResponse.brand.toLowerCase().trim()) && 
          p.name?.toLowerCase().trim().includes(iaResponse.name.toLowerCase().trim())
      );

      // 3. Pegar perfil do usuário e ingredientes globais
      const profile = await getSkinProfile(currentUser.uid);
      if (!profile) {
        navigate('/onboarding');
        return;
      }

      const allIngredients = await getIngredients();
      const matchedIngredients: Ingredient[] = [];
      const unknownIngredients: string[] = [];

      let ingredientsToAnalyze: string[] = [];
      let originalInci = '';
      let productId = undefined;

      if (product) {
        // Usa o produto do banco
        ingredientsToAnalyze = product.normalizedIngredients || [];
        originalInci = product.originalInci || '';
        productId = product.id;
      } else {
        // Se não achou no banco, usa a IA!
        if (iaResponse.ingredients && iaResponse.ingredients.length > 0) {
          ingredientsToAnalyze = iaResponse.ingredients;
          originalInci = iaResponse.ingredients.join(', ');
          alert(`Produto novo! A IA analisou o rótulo do ${iaResponse.brand} ${iaResponse.name} em tempo real.`);
        } else {
          alert(`Produto reconhecido (${iaResponse.brand} - ${iaResponse.name}), mas a IA não conseguiu extrair os ingredientes.`);
          setScanning(false);
          return;
        }
      }

      // Cruze os ingredientes
      ingredientsToAnalyze.forEach(input => {
        const match = allIngredients.find(ing => 
          ing.name.toLowerCase() === input.toLowerCase() || 
          (ing.synonyms && ing.synonyms.map(s => s.toLowerCase()).includes(input.toLowerCase()))
        );
        if (match) {
          matchedIngredients.push(match);
        } else {
          unknownIngredients.push(input);
        }
      });

      // 4. Rodar Motor
      const result = analyzeCompatibility(profile, matchedIngredients);
      result.unknownIngredients = unknownIngredients;
      result.userId = currentUser.uid;
      result.originalInci = originalInci;
      result.productId = productId; 

      // 5. Salvar e redirecionar
      const analysisId = await saveAnalysis(result);
      navigate(`/result/${analysisId}`);

    } catch (error) {
      console.error(error);
      alert('Erro durante a análise da imagem.');
      setScanning(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-xl mx-auto w-full flex flex-col items-center">
      <h2 className="text-3xl font-playfair font-semibold text-tadra-textStrong mb-2 text-center">
        Escanear Produto
      </h2>
      <p className="text-tadra-textSoft mb-8 text-center text-sm">
        Tire uma foto clara da frente da embalagem para nossa Inteligência Artificial reconhecer o produto.
      </p>

      <div className="w-full bg-white/60 p-6 rounded-3xl shadow-sm border border-tadra-wine/5 flex flex-col items-center">
        
        {/* Preview da Câmera / Imagem */}
        <div 
          className="w-full aspect-[3/4] bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden relative mb-6"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Nenhuma foto selecionada</span>
            </div>
          )}

          {/* Efeito de Scanner Animado (Overlay) */}
          {scanning && (
            <div className="absolute inset-0 bg-tadra-wine/10 z-10 flex flex-col items-center justify-center backdrop-blur-[1px]">
              <div className="w-full h-1 bg-tadra-wine shadow-[0_0_15px_rgba(93,42,42,1)] animate-scan" />
            </div>
          )}
        </div>

        <input 
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleCapture}
          className="hidden"
        />

        {/* Botões de Ação */}
        {!imagePreview ? (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 bg-tadra-wine text-white rounded-xl font-medium hover:bg-tadra-wine/90 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Abrir Câmera
          </button>
        ) : (
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setImagePreview(null)}
              disabled={scanning}
              className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Refazer
            </button>
            <button 
              onClick={startAnalysis}
              disabled={scanning}
              className="flex-[2] py-4 bg-tadra-wine text-white rounded-xl font-medium hover:bg-tadra-wine/90 transition-colors disabled:opacity-50"
            >
              {scanning ? 'Analisando...' : 'Descobrir Produto'}
            </button>
          </div>
        )}

        {/* Status Text animado */}
        {scanning && (
          <p className="text-sm font-geist text-tadra-wine mt-4 font-medium animate-pulse text-center">
            {statusText}
          </p>
        )}

      </div>
    </div>
  );
}
