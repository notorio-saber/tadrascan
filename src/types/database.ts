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
