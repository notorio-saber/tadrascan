import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { SkinProfile } from '../../types/database';

const COLLECTION_NAME = 'skinProfiles';

export async function saveSkinProfile(userId: string, profile: Omit<SkinProfile, 'id' | 'userId' | 'updatedAt'>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, userId);
  await setDoc(docRef, {
    userId,
    ...profile,
    updatedAt: new Date().toISOString()
  });
}

export async function getSkinProfile(userId: string): Promise<SkinProfile | null> {
  const docRef = doc(db, COLLECTION_NAME, userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as SkinProfile;
  }
  return null;
}
