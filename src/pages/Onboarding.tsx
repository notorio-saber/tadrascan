import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveSkinProfile } from '../services/firestore/skinProfiles';
import type { SkinProfile } from '../types/database';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

export default function Onboarding() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  
  const [answers, setAnswers] = useState<Partial<SkinProfile>>({
    skinType: 'normal',
    phototype: 3,
    sensitivity: 'no',
    concerns: [],
    redFlags: false
  });

  const [loading, setLoading] = useState(false);

  const questions = [
    {
      title: 'Como sua pele reage ao sol?',
      options: [
        { label: 'Sempre queima intensamente', val: 1 },
        { label: 'Queima com facilidade', val: 2 },
        { label: 'Às vezes queima (bronzeia gradual)', val: 3 },
        { label: 'Raramente queima (bronzeia fácil)', val: 4 },
        { label: 'Quase nunca queima', val: 5 },
        { label: 'Não costuma queimar (pele escura)', val: 6 },
      ],
      field: 'phototype'
    },
    {
      title: 'Como sua pele fica após a limpeza?',
      options: [
        { label: 'Repuxada ou desconfortável', val: 'dry' },
        { label: 'Confortável e equilibrada', val: 'normal' },
        { label: 'Oleosa apenas na zona T', val: 'combo' },
        { label: 'Oleosa rapidamente no rosto todo', val: 'oily' },
      ],
      field: 'skinType'
    },
    {
      title: 'Sua pele costuma reagir a produtos?',
      options: [
        { label: 'Raramente', val: 'no' },
        { label: 'Às vezes', val: 'sometimes' },
        { label: 'Sim, com frequência (ardência, vermelhidão)', val: 'yes' },
      ],
      field: 'sensitivity'
    },
    {
      title: 'Qual é o seu principal objetivo com a pele?',
      options: [
        { label: 'Oleosidade e acne', val: 'acne' },
        { label: 'Manchas ou tom irregular', val: 'spots' },
        { label: 'Prevenção e linhas finas', val: 'aging' },
        { label: 'Textura e poros', val: 'texture' },
        { label: 'Ressecamento e viço', val: 'hydration' },
        { label: 'Sensibilidade e vermelhidão', val: 'sensitive' },
      ],
      field: 'concerns',
      multiple: true
    }
  ];

  const currentQ = questions[step];

  const handleSelect = (val: any) => {
    if (currentQ.multiple) {
      const currentConcerns = answers.concerns || [];
      if (currentConcerns.includes(val)) {
        setAnswers({ ...answers, concerns: currentConcerns.filter(c => c !== val) });
      } else {
        setAnswers({ ...answers, concerns: [...currentConcerns, val] });
      }
    } else {
      setAnswers({ ...answers, [currentQ.field]: val });
    }
  };

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const userId = currentUser ? currentUser.uid : 'anon_user';
        await saveSkinProfile(userId, answers as Omit<SkinProfile, 'id' | 'userId' | 'updatedAt'>);
        navigate('/app');
      } catch (error: any) {
        console.error("Erro ao salvar perfil:", error);
        alert(`Erro ao salvar perfil: ${error?.message || 'Tente novamente.'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 pb-28">
      <div className="w-full max-w-xl relative group">
        
        {/* Glow de fundo */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/30 via-primary-500/10 to-primary-600/30 rounded-[2.5rem] blur-xl opacity-60"></div>

        <div className="glass-effect rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-white/10 to-white/5 border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative z-10 flex flex-col">
          
          {/* Header da etapa com indicador */}
          <div className="flex justify-between items-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-medium text-white/70">
              <Sparkles className="w-3 h-3 text-primary-400" />
              Etapa {step + 1} de {questions.length}
            </div>
            
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step 
                      ? 'w-6 bg-primary-400 shadow-[0_0_8px_theme(colors.primary.400)]' 
                      : i < step 
                        ? 'w-3 bg-primary-500/50' 
                        : 'w-2 bg-white/10'
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Título da pergunta */}
          <h2 className="text-xl sm:text-2xl font-jakarta font-semibold text-white mb-6 leading-snug">
            {currentQ.title}
          </h2>

          {/* Opções elegantes no Dark Glass */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((opt, i) => {
              let isSelected = false;
              if (currentQ.multiple) {
                isSelected = (answers.concerns || []).includes(opt.val as string);
              } else {
                isSelected = (answers as any)[currentQ.field] === opt.val;
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(opt.val)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'border-primary-400 bg-primary-500/20 text-white font-medium shadow-[0_0_20px_theme(colors.primary.500/20%)]' 
                      : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-sm sm:text-base font-inter">{opt.label}</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected 
                      ? 'border-primary-400 bg-primary-500 text-white' 
                      : 'border-white/20 bg-white/5'
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Botão de Próximo / Salvar */}
          <button 
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="w-full py-4 glass-button bg-primary-500/30 border border-primary-500/50 hover:bg-primary-500/40 text-white font-medium rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_25px_theme(colors.primary.500/30%)] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <span className="font-semibold text-sm">
              {step === questions.length - 1 ? (loading ? 'Salvando perfil...' : 'Finalizar e Ativar IA') : 'Continuar'}
            </span>
            <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
          </button>

        </div>
      </div>
    </div>
  );
}
