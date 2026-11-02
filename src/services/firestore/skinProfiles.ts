import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { SkinProfile } from '../../types/database';

const COLLECTION_NAME = 'skinProfiles';
const GLOBAL_LOCAL_KEY = 'tadra_active_skin_profile';

export async function saveSkinProfile(userId: string, profile: Omit<SkinProfile, 'id' | 'userId' | 'updatedAt'>): Promise<void> {
  const profileData: SkinProfile = {
    userId,
    ...profile,
    updatedAt: new Date().toISOString()
  };

  // 1. Sempre salva no localStorage (chave global e chave com userId)
  try {
    const serialized = JSON.stringify(profileData);
    localStorage.setItem(GLOBAL_LOCAL_KEY, serialized);
    if (userId) {
      localStorage.setItem(`${GLOBAL_LOCAL_KEY}_${userId}`, serialized);
    }
  } catch (e) {
    console.warn("Não foi possível salvar localmente:", e);
  }

  // 2. Tenta persistir no Firestore
  if (userId && userId !== 'anon_user') {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      await setDoc(docRef, profileData);
    } catch (firestoreError) {
      console.warn("Firestore saveSkinProfile falhou (usando persistência local):", firestoreError);
    }
  }
}

export async function getSkinProfile(userId?: string): Promise<SkinProfile | null> {
  // 1. Tenta recuperar do cache local imediato
  try {
    if (userId && userId !== 'anon_user') {
      const localWithId = localStorage.getItem(`${GLOBAL_LOCAL_KEY}_${userId}`);
      if (localWithId) return JSON.parse(localWithId) as SkinProfile;
    }
    const globalLocal = localStorage.getItem(GLOBAL_LOCAL_KEY);
    if (globalLocal) return JSON.parse(globalLocal) as SkinProfile;
  } catch (e) {
    console.error("Erro ao ler perfil do localStorage:", e);
  }

  // 2. Se não achou local, tenta buscar do Firestore
  if (userId && userId !== 'anon_user') {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as SkinProfile;
        try {
          localStorage.setItem(GLOBAL_LOCAL_KEY, JSON.stringify(data));
          localStorage.setItem(`${GLOBAL_LOCAL_KEY}_${userId}`, JSON.stringify(data));
        } catch (e) {}
        return data;
      }
    } catch (firestoreError) {
      console.warn("Erro ao buscar do Firestore:", firestoreError);
    }
  }

  return null;
}
