import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveSkinProfile } from '../services/firestore/skinProfiles';
import type { SkinProfile } from '../types/database';

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
      if (!currentUser) return;
      setLoading(true);
      try {
        await saveSkinProfile(currentUser.uid, answers as Omit<SkinProfile, 'id' | 'userId' | 'updatedAt'>);
        navigate('/app');
      } catch (error) {
        console.error(error);
        alert('Erro ao salvar perfil.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-tadra-bg flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur p-8 md:p-12 rounded-3xl shadow-sm border border-tadra-wine/5">
        
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm font-geist font-medium text-tadra-textSoft">Etapa {step + 1} de {questions.length}</p>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full ${i <= step ? 'bg-tadra-wine' : 'bg-tadra-wine/10'}`} />
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-playfair font-semibold text-tadra-textStrong mb-6">
          {currentQ.title}
        </h2>

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
                onClick={() => handleSelect(opt.val)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected 
                    ? 'border-tadra-wine bg-tadra-wine/5 text-tadra-wine font-medium shadow-sm' 
                    : 'border-gray-200 bg-white text-tadra-textStrong hover:border-tadra-wine/30'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        <button 
          onClick={handleNext}
          disabled={loading}
          className="w-full py-4 bg-tadra-wine text-white rounded-xl font-medium hover:bg-tadra-wine/90 transition-all disabled:opacity-50"
        >
          {step === questions.length - 1 ? (loading ? 'Salvando...' : 'Finalizar Perfil') : 'Continuar'}
        </button>

      </div>
    </div>
  );
}
