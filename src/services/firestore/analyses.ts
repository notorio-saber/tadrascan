import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { AnalysisResult } from '../../types/database';

const COLLECTION_NAME = 'analyses';

export async function saveAnalysis(analysis: Omit<AnalysisResult, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...analysis,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

export async function getUserAnalyses(userId: string): Promise<AnalysisResult[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  }) as AnalysisResult);
}

export async function getAnalysis(id: string): Promise<AnalysisResult | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as AnalysisResult;
  }
  return null;
}
