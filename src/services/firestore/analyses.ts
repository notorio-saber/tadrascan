import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { AnalysisResult } from '../../types/database';

const COLLECTION_NAME = 'analyses';
const LOCAL_ANALYSES_KEY = 'tadra_local_analyses_history';

export async function saveAnalysis(analysis: Omit<AnalysisResult, 'id' | 'createdAt'>): Promise<string> {
  const analysisId = 'scan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const fullAnalysis: AnalysisResult = {
    id: analysisId,
    ...analysis,
    createdAt: new Date().toISOString()
  };

  // 1. Persistência imediata no localStorage
  try {
    const existing = localStorage.getItem(LOCAL_ANALYSES_KEY);
    const list: AnalysisResult[] = existing ? JSON.parse(existing) : [];
    list.unshift(fullAnalysis);
    localStorage.setItem(LOCAL_ANALYSES_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Erro ao salvar análise localmente:", e);
  }

  // 2. Persistência no Firestore
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...analysis,
      createdAt: fullAnalysis.createdAt
    });
    return docRef.id;
  } catch (err) {
    console.warn("Firestore saveAnalysis falhou (usando ID local):", err);
    return analysisId;
  }
}

export async function getUserAnalyses(userId?: string): Promise<AnalysisResult[]> {
  const localList: AnalysisResult[] = [];
  try {
    const existing = localStorage.getItem(LOCAL_ANALYSES_KEY);
    if (existing) {
      const parsed: AnalysisResult[] = JSON.parse(existing);
      localList.push(...parsed);
    }
  } catch (e) {}

  if (!userId || userId === 'anon_user') {
    return localList;
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const firestoreResults: AnalysisResult[] = querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }) as AnalysisResult);

    // Mescla itens locais com itens do firestore sem duplicar IDs
    const merged = [...localList, ...firestoreResults];
    const unique = Array.from(new Map(merged.map(a => [a.id || a.createdAt, a])).values());
    unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return unique;
  } catch (err) {
    console.warn("Erro ao buscar análises do Firestore:", err);
    return localList;
  }
}

export async function getAnalysis(id: string): Promise<AnalysisResult | null> {
  // 1. Tenta achar no cache local
  try {
    const existing = localStorage.getItem(LOCAL_ANALYSES_KEY);
    if (existing) {
      const list: AnalysisResult[] = JSON.parse(existing);
      const found = list.find(a => a.id === id);
      if (found) return found;
    }
  } catch (e) {}

  // 2. Tenta no Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as AnalysisResult;
    }
  } catch (e) {}

  return null;
}
