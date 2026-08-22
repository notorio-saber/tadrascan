import { addIngredient } from '../services/firestore/ingredients';
import type { Ingredient } from '../types/database';

const INITIAL_INGREDIENTS: Omit<Ingredient, 'id'>[] = [
  {
    name: 'Niacinamide',
    popularNames: ['Vitamina B3'],
    functions: ['Clareador', 'Antioxidante', 'Seborregulador'],
    categories: ['Vitaminas'],
    descriptionSimple: 'Ajuda a clarear manchas e controlar a oleosidade.',
    skinTypesBenefited: ['Oleosa', 'Mista', 'Com Manchas'],
    status: 'published',
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Salicylic Acid',
    popularNames: ['Ácido Salicílico'],
    functions: ['Esfoliante Químico', 'Antiacne'],
    categories: ['Ácidos (BHA)'],
    descriptionSimple: 'Penetra nos poros para desobstruí-los, sendo ótimo para acne.',
    skinTypesBenefited: ['Oleosa', 'Acneica'],
    status: 'published',
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Hyaluronic Acid',
    popularNames: ['Ácido Hialurônico'],
    functions: ['Umectante', 'Hidratante'],
    categories: ['Hidratantes'],
    descriptionSimple: 'Atrai água para a pele, mantendo-a hidratada e preenchida.',
    skinTypesBenefited: ['Seca', 'Todos os tipos'],
    status: 'published',
    updatedAt: new Date().toISOString()
  }
];

export async function seedInitialIngredients() {
  for (const ing of INITIAL_INGREDIENTS) {
    await addIngredient(ing);
  }
}
