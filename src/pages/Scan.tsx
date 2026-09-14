import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSkinProfile } from '../services/firestore/skinProfiles';
import { saveAnalysis } from '../services/firestore/analyses';
import { useAuth } from '../contexts/AuthContext';
import type { AnalysisResult } from '../types/database';

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
    setStatusText('Conectando ao Dermatologista IA...');

    try {
      // 1. Pegar perfil do usuário
      const profile = await getSkinProfile(currentUser.uid);
      if (!profile) {
        navigate('/onboarding');
        return;
      }

      setStatusText('Analisando composição e seu perfil...');

      // 2. Chamar a função do Netlify (backend) passando a imagem e o perfil
      const response = await fetch('/.netlify/functions/scan-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageBase64: imagePreview,
          userProfile: profile
        })
      });
      
      if (!response.ok) {
        let errMessage = 'Falha ao se comunicar com a IA';
        try {
          const errData = await response.json();
          if (errData.error) errMessage = errData.error;
        } catch(e) {}
        throw new Error(errMessage);
      }

      const iaResponse = await response.json();
      
      if (!iaResponse.ingredients || iaResponse.ingredients.length === 0) {
        throw new Error('A Inteligência Artificial não conseguiu identificar a fórmula exata deste produto. Tente fotografar a lista de ingredientes (o verso).');
      }

      setStatusText(`Produto detectado! Salvando diagnóstico...`);

      let classification: AnalysisResult['classification'] = 'Moderada';
      const score = iaResponse.compatibilityScore || 50;
      if (score >= 80) classification = 'Excelente';
      else if (score >= 60) classification = 'Boa';
      else if (score >= 40) classification = 'Moderada';
      else classification = 'Atenção';

      // 3. Montar o resultado rico retornado pela IA
      const result: AnalysisResult = {
        userId: currentUser.uid,
        productName: iaResponse.name,
        brand: iaResponse.brand,
        originalInci: iaResponse.ingredients.join(', '),
        compatibilityScore: score,
        classification,
        productDescription: iaResponse.productDescription,
        positiveReasons: iaResponse.positiveReasons || [],
        attentionPoints: iaResponse.attentionPoints || [],
        howToUse: iaResponse.howToUse,
        unknownIngredients: [], // IA consolida tudo agora
        createdAt: new Date().toISOString()
      };

      // 4. Salvar e redirecionar
      const analysisId = await saveAnalysis(result);
      navigate(\`/result/\${analysisId}\`);

    } catch (error: any) {
      console.error(error);
      alert(\`Erro: \${error.message || 'Erro durante a análise da imagem.'}\`);
      setScanning(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-xl mx-auto w-full flex flex-col items-center pb-24">
      <h2 className="text-3xl font-playfair font-semibold text-tadra-textStrong mb-2 text-center">
        Escanear Produto
      </h2>
      <div className="bg-tadra-bgSoft border border-tadra-goldLight/30 rounded-xl p-4 mb-8 text-center text-sm text-tadra-textSoft shadow-sm">
        <p className="font-medium text-tadra-wine mb-1">Dica para precisão máxima:</p>
        <p>Fotografe a <b>lista de ingredientes</b> no verso da embalagem. Se não puder, fotografe a frente clara do frasco para a IA buscar na web.</p>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-tadra-wine/5 border border-white flex flex-col items-center relative overflow-hidden">
        
        {/* Preview da Câmera / Imagem */}
        <div 
          className="w-full aspect-[3/4] bg-tadra-bgDeep/50 rounded-2xl border-2 border-dashed border-tadra-goldLight/50 flex flex-col items-center justify-center overflow-hidden relative mb-6"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-tadra-textSoft flex flex-col items-center opacity-60">
              <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Nenhuma foto selecionada</span>
            </div>
          )}

          {/* Efeito de Scanner Animado (Overlay) */}
          {scanning && (
            <div className="absolute inset-0 bg-tadra-wine/5 z-10 flex flex-col items-center justify-center backdrop-blur-[2px]">
              <div className="w-full h-[2px] bg-tadra-wine shadow-[0_0_20px_rgba(93,42,42,0.8)] animate-scan" />
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
            className="w-full py-4 bg-tadra-wine text-white rounded-xl font-medium hover:bg-tadra-wine/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-tadra-wine/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Abrir Câmera
          </button>
        ) : (
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setImagePreview(null)}
              disabled={scanning}
              className="flex-1 py-4 bg-tadra-bgDeep text-tadra-textStrong rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Refazer
            </button>
            <button 
              onClick={startAnalysis}
              disabled={scanning}
              className="flex-[2] py-4 bg-tadra-wine text-white rounded-xl font-medium hover:bg-tadra-wine/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-tadra-wine/20"
            >
              {scanning ? 'Analisando...' : 'Descobrir Produto'}
            </button>
          </div>
        )}

        {/* Status Text animado */}
        {scanning && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 rounded-3xl">
            <div className="w-12 h-12 border-4 border-tadra-wine border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-geist text-tadra-wine font-semibold text-center animate-pulse">
              {statusText}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
