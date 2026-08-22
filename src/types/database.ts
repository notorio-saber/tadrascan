export type ItemStatus = 'draft' | 'pending_review' | 'published' | 'archived';

export interface Ingredient {
  id?: string;
  name: string; // Nome INCI principal
  popularNames?: string[];
  synonyms?: string[];
  functions?: string[];
  categories?: string[];
  descriptionSimple: string;
  descriptionTechnical?: string;
  skinTypesBenefited?: string[];
  relatedGoals?: string[];
  attentionContexts?: string[];
  isAllergen?: boolean;
  isPhotosensitive?: boolean;
  status: ItemStatus;
  updatedAt: string;
  authorId?: string;
}

export interface Product {
  id?: string;
  brand: string;
  name: string;
  slug: string;
  categories?: string[];
  images?: string[];
  barcode?: string;
  volume?: string;
  originalInci?: string;
  normalizedIngredients?: string[];
  status: ItemStatus;
  updatedAt: string;
  authorId?: string;
}

export interface SkinProfile {
  id?: string;
  userId: string;
  // Baseado no Quiz Tadra
  skinType: 'dry' | 'normal' | 'combo' | 'oily';
  phototype?: number;
  sensitivity: 'yes' | 'sometimes' | 'no';
  concerns: string[];
  redFlags: boolean;
  updatedAt: string;
}

export interface AnalysisResult {
  id?: string;
  userId?: string;
  productId?: string; // Se foi um produto salvo
  productName?: string;
  originalInci?: string;
  
  compatibilityScore: number; // 0 - 100
  classification: 'Excelente' | 'Boa' | 'Moderada' | 'Atenção' | 'Dados Insuficientes';
  
  positiveReasons: string[];
  attentionPoints: string[];
  unknownIngredients: string[];
  
  createdAt: string;
}
