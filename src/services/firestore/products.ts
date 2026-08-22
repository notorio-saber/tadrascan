import { collection, doc, setDoc, getDocs, getDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../../types/database';

const COLLECTION_NAME = 'products';

export async function addProduct(product: Omit<Product, 'id'>) {
  const newRef = doc(collection(db, COLLECTION_NAME));
  await setDoc(newRef, { ...product, id: newRef.id });
  return newRef.id;
}

export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('brand'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Product);
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const ref = doc(db, COLLECTION_NAME, id);
  await updateDoc(ref, data);
}
