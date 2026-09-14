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
    setStatusText('Conectando à Inteligência Artificial...');

    try {
      const profile = await getSkinProfile(currentUser.uid);
      if (!profile) {
        navigate('/onboarding');
        return;
      }

      setStatusText('Analisando composição e seu perfil...');

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
        unknownIngredients: [], 
        createdAt: new Date().toISOString()
      };

      const analysisId = await saveAnalysis(result);
      navigate(`/result/${analysisId}`);

    } catch (error: any) {
      console.error(error);
      alert(`Erro: ${error.message || 'Erro durante a análise da imagem.'}`);
      setScanning(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-xl mx-auto w-full flex flex-col items-center pb-24 mt-4">
      <h2 className="text-3xl font-jakarta font-semibold text-white mb-2 text-center">
        Scanner <span className="gradient-text bg-gradient-to-r from-primary-400 to-primary-600">IA</span>
      </h2>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 text-center text-sm text-white/70 shadow-sm backdrop-blur-md">
        <p className="font-medium text-primary-400 mb-1">Precisão Máxima:</p>
        <p>Fotografe a <b>lista de ingredientes</b> no verso da embalagem. Ou a frente clara do frasco para a IA buscar na web.</p>
      </div>

      <div className="w-full relative group">
        
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-primary-600/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

        <div className="w-full glass-effect bg-gradient-to-b from-white/10 to-white/5 p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col items-center relative overflow-hidden z-10">
          
          {/* Preview da Câmera / Imagem */}
          <div 
            className="w-full aspect-[3/4] bg-darkGray-100/50 rounded-2xl border-2 border-dashed border-primary-500/30 flex flex-col items-center justify-center overflow-hidden relative mb-6"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-white/50 flex flex-col items-center opacity-60">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Nenhuma foto selecionada</span>
              </div>
            )}

            {/* Efeito de Scanner Animado (Overlay) */}
            {scanning && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden bg-primary-500/10">
                {/* Nuvem de pontos "IA Viva" */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  
                  {/* Núcleo Pulsante */}
                  <div className="absolute w-16 h-16 bg-primary-500/20 rounded-full animate-pulseGlow shadow-[0_0_30px_theme('colors.primary.500'/80%)] border border-primary-400/50"></div>
                  <div className="absolute w-8 h-8 bg-primary-400 rounded-full animate-pulse shadow-[0_0_20px_theme('colors.primary.400')]"></div>
                  
                  {/* Órbitas (Nuvem de Pontos) */}
                  <div className="absolute w-full h-full animate-orbit">
                    <div className="absolute top-0 left-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                    <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-primary-300 rounded-full shadow-[0_0_8px_theme('colors.primary.300')]"></div>
                  </div>
                  
                  <div className="absolute w-3/4 h-3/4 animate-orbitReverse" style={{ animationDuration: '5s' }}>
                    <div className="absolute top-1/4 left-0 w-2 h-2 bg-primary-200 rounded-full shadow-[0_0_10px_theme('colors.primary.200')]"></div>
                    <div className="absolute bottom-1/4 right-0 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                  </div>
                  
                  <div className="absolute w-full h-full animate-orbit" style={{ animationDuration: '7s' }}>
                    <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-primary-100 rounded-full shadow-[0_0_5px_theme('colors.primary.100')]"></div>
                    <div className="absolute bottom-1/2 left-0 w-2.5 h-2.5 bg-primary-400 rounded-full shadow-[0_0_8px_theme('colors.primary.400')]"></div>
                  </div>

                  {/* Ondas de Escaneamento (Anéis de radar) */}
                  <div className="absolute inset-0 border border-primary-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-4 border border-primary-400/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                </div>
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
              className="w-full py-4 glass-button bg-primary-500/30 text-white border border-primary-500/50 rounded-xl font-medium hover:bg-primary-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_theme('colors.primary.500'/20%)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Abrir Câmera
            </button>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              {!scanning && (
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setImagePreview(null)}
                    disabled={scanning}
                    className="flex-1 py-4 glass-button bg-white/5 border border-white/20 text-white/90 rounded-xl font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    Refazer
                  </button>
                  <button 
                    onClick={startAnalysis}
                    disabled={scanning}
                    className="flex-[2] py-4 glass-button bg-primary-500/30 border border-primary-500/50 text-white rounded-xl font-medium hover:bg-primary-500/40 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_theme('colors.primary.500'/30%)]"
                  >
                    Descobrir Produto
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Status Text animado - Moved below to avoid blocking the image */}
          {scanning && (
            <div className="w-full mt-4 bg-darkGray-100/50 border border-primary-500/20 backdrop-blur-md flex flex-col items-center justify-center p-4 rounded-2xl animate-pulse">
              <p className="text-sm font-inter text-primary-400 font-medium text-center">
                {statusText}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
