import { addIngredient } from '../services/firestore/ingredients';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
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
  },
  {
    name: 'Glycerin',
    popularNames: ['Glicerina'],
    functions: ['Umectante', 'Hidratante'],
    categories: ['Hidratantes'],
    descriptionSimple: 'Um dos hidratantes mais eficazes e seguros, puxa água para a pele.',
    skinTypesBenefited: ['Todos os tipos', 'Seca', 'Sensível'],
    status: 'published',
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Zinc PCA',
    popularNames: ['Zinco'],
    functions: ['Seborregulador', 'Antimicrobiano'],
    categories: ['Minerais'],
    descriptionSimple: 'Controla o brilho e a oleosidade excessiva.',
    skinTypesBenefited: ['Oleosa', 'Acneica'],
    status: 'published',
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_PRODUCTS = [
  {
    brand: 'Principia',
    name: 'Sérum Niacinamida',
    slug: 'principia-serum-niacinamida',
    category: 'Sérum',
    originalInci: 'Aqua, Niacinamide, Glycerin, Zinc PCA, Salicylic Acid',
    normalizedIngredients: ['Aqua', 'Niacinamide', 'Glycerin', 'Zinc PCA', 'Salicylic Acid'],
    status: 'published',
    updatedAt: new Date().toISOString()
  }
];

export async function seedInitialIngredients() {
  for (const ing of INITIAL_INGREDIENTS) {
    await addIngredient(ing);
  }
  
  for (const prod of INITIAL_PRODUCTS) {
    const newRef = doc(collection(db, 'products'));
    await setDoc(newRef, { ...prod, id: newRef.id });
  }
}
