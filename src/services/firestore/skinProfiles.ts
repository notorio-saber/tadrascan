import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { SkinProfile } from '../../types/database';

const COLLECTION_NAME = 'skinProfiles';
const LOCAL_STORAGE_KEY = 'tadra_local_skin_profile';

export async function saveSkinProfile(userId: string, profile: Omit<SkinProfile, 'id' | 'userId' | 'updatedAt'>): Promise<void> {
  const profileData: SkinProfile = {
    userId,
    ...profile,
    updatedAt: new Date().toISOString()
  };

  // 1. Sempre salva no localStorage como fallback imediato e à prova de falhas de conexão/regras
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify(profileData));
  } catch (e) {
    console.warn("Não foi possível salvar localmente:", e);
  }

  // 2. Tenta persistir no Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    await setDoc(docRef, profileData);
  } catch (firestoreError) {
    console.error("Erro ao salvar no Firestore (mantendo cópia local segura):", firestoreError);
  }
}

export async function getSkinProfile(userId: string): Promise<SkinProfile | null> {
  // 1. Tenta buscar do Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() } as SkinProfile;
      // Atualiza o cache local
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify(data));
      } catch (e) {}
      return data;
    }
  } catch (firestoreError) {
    console.warn("Erro ao buscar do Firestore, tentando fallback local:", firestoreError);
  }

  // 2. Se falhar ou não encontrar no Firestore, recupera do localStorage
  try {
    const localData = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${userId}`);
    if (localData) {
      return JSON.parse(localData) as SkinProfile;
    }
  } catch (e) {
    console.error("Erro ao ler do localStorage:", e);
  }

  return null;
}
