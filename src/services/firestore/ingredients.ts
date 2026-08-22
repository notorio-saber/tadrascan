import { collection, doc, setDoc, getDocs, getDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Ingredient } from '../../types/database';

const COLLECTION_NAME = 'ingredients';

export async function addIngredient(ingredient: Omit<Ingredient, 'id'>) {
  const newRef = doc(collection(db, COLLECTION_NAME));
  await setDoc(newRef, { ...ingredient, id: newRef.id });
  return newRef.id;
}

export async function getIngredients(): Promise<Ingredient[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Ingredient);
}

export async function updateIngredient(id: string, data: Partial<Ingredient>) {
  const ref = doc(db, COLLECTION_NAME, id);
  await updateDoc(ref, data);
}
