import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface InstagramPost {
  id: string;
  url: string;
}

export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  const snap = await getDocs(collection(db, 'instagramPosts'));
  return snap.docs.map(d => ({ id: d.id, url: d.data().url as string }));
}

export async function addInstagramPost(url: string): Promise<InstagramPost> {
  const docRef = await addDoc(collection(db, 'instagramPosts'), { url });
  return { id: docRef.id, url };
}

export async function deleteInstagramPost(id: string): Promise<void> {
  await deleteDoc(doc(db, 'instagramPosts', id));
}
