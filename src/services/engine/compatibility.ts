import type { SkinProfile, Ingredient, AnalysisResult } from '../../types/database';

export function analyzeCompatibility(profile: SkinProfile, ingredients: Ingredient[]): AnalysisResult {
  let score = 50; // Começa neutro
  const positiveReasons: string[] = [];
  const attentionPoints: string[] = [];
  
  if (ingredients.length === 0) {
    return {
      compatibilityScore: 0,
      classification: 'Dados Insuficientes',
      positiveReasons: [],
      attentionPoints: ['Nenhum ingrediente válido encontrado para análise.'],
      unknownIngredients: [],
      createdAt: new Date().toISOString()
    };
  }

  // Regras Simplificadas MVP
  ingredients.forEach(ing => {
    // 1. Benefícios cruzados com objetivos
    if (ing.relatedGoals && ing.relatedGoals.some(goal => profile.concerns.includes(goal))) {
      score += 15;
      positiveReasons.push(`O ingrediente ${ing.name} é excelente para seus objetivos de pele.`);
    }

    // 2. Adequação ao tipo de pele
    if (ing.skinTypesBenefited && ing.skinTypesBenefited.includes(profile.skinType)) {
      score += 10;
      positiveReasons.push(`${ing.name} é muito bem tolerado por peles do tipo ${profile.skinType}.`);
    }

    // 3. Sensibilidade
    if (profile.sensitivity === 'yes' && ing.isAllergen) {
      score -= 25;
      attentionPoints.push(`${ing.name} tem potencial alergênico e sua pele é sensível.`);
    }

    // 4. Atenção geral
    if (ing.attentionContexts && ing.attentionContexts.length > 0) {
      // Se for um ácido forte (ex: Salicílico) e a pessoa tem pele seca
      if (profile.skinType === 'dry' && ing.attentionContexts.includes('ressecamento')) {
        score -= 15;
        attentionPoints.push(`${ing.name} pode agravar o ressecamento da sua pele.`);
      }
    }
  });

  // Limitar score
  score = Math.max(0, Math.min(100, score));

  // Classificação
  let classification: AnalysisResult['classification'] = 'Moderada';
  if (score >= 80) classification = 'Excelente';
  else if (score >= 60) classification = 'Boa';
  else if (score >= 40) classification = 'Moderada';
  else classification = 'Atenção';

  // Remover duplicatas das mensagens
  const uniquePositives = [...new Set(positiveReasons)];
  const uniqueAttentions = [...new Set(attentionPoints)];

  if (uniquePositives.length === 0) {
    uniquePositives.push('O produto parece neutro e não possui ativos de destaque para os seus objetivos principais.');
  }

  return {
    compatibilityScore: score,
    classification,
    positiveReasons: uniquePositives,
    attentionPoints: uniqueAttentions,
    unknownIngredients: [],
    createdAt: new Date().toISOString()
  };
}
