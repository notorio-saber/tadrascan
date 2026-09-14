import { 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import type { AffiliateProduct } from '../../types/database';

const COLLECTION_NAME = 'affiliate_products';

export async function saveProduct(product: AffiliateProduct): Promise<string> {
  let docRef;
  if (product.id) {
    docRef = doc(db, COLLECTION_NAME, product.id);
  } else {
    docRef = doc(collection(db, COLLECTION_NAME));
    product.id = docRef.id;
  }
  
  await setDoc(docRef, product);
  return docRef.id;
}

export async function getProducts(): Promise<AffiliateProduct[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  const products: AffiliateProduct[] = [];
  snapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as AffiliateProduct);
  });
  
  return products;
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
