import { describe, it, expect } from 'vitest';
import { analyzeCompatibility } from './compatibility';
import type { SkinProfile, Ingredient } from '../../types/database';

describe('Engine de Compatibilidade', () => {
  const baseProfile: SkinProfile = {
    userId: '123',
    skinType: 'normal',
    sensitivity: 'no',
    concerns: [],
    redFlags: false,
    updatedAt: new Date().toISOString()
  };

  const goodIngredient: Ingredient = {
    name: 'Niacinamide',
    descriptionSimple: 'Vitamina B3',
    status: 'published',
    updatedAt: '',
    skinTypesBenefited: ['normal', 'oily'],
    relatedGoals: ['acne', 'spots'],
  };

  const badIngredient: Ingredient = {
    name: 'Ácido Salicílico',
    descriptionSimple: 'BHA',
    status: 'published',
    updatedAt: '',
    attentionContexts: ['ressecamento'],
    isAllergen: true
  };

  it('deve retornar Dados Insuficientes se não houver ingredientes', () => {
    const result = analyzeCompatibility(baseProfile, []);
    expect(result.classification).toBe('Dados Insuficientes');
    expect(result.compatibilityScore).toBe(0);
  });

  it('deve aumentar a nota se o ingrediente bater com os objetivos', () => {
    const profile = { ...baseProfile, concerns: ['acne'] };
    const result = analyzeCompatibility(profile, [goodIngredient]);
    expect(result.compatibilityScore).toBe(50 + 15 + 10); // 15 de objetivo + 10 de skin type
    expect(result.classification).toBe('Boa');
  });

  it('deve penalizar se a pele for seca e o ingrediente agravar ressecamento', () => {
    const profile = { ...baseProfile, skinType: 'dry' as const };
    const result = analyzeCompatibility(profile, [badIngredient]);
    expect(result.compatibilityScore).toBe(50 - 15);
    expect(result.attentionPoints).toContain('Ácido Salicílico pode agravar o ressecamento da sua pele.');
  });

  it('deve penalizar alergenos em peles sensíveis', () => {
    const profile = { ...baseProfile, sensitivity: 'yes' as const };
    const result = analyzeCompatibility(profile, [badIngredient]);
    expect(result.compatibilityScore).toBe(50 - 25);
    expect(result.attentionPoints).toContain('Ácido Salicílico tem potencial alergênico e sua pele é sensível.');
  });
});
