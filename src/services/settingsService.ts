import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function getHotelSettings<T>(fallback: T): Promise<T> {
  if (!db) return fallback;
  const snap = await getDoc(doc(db, "hotelSettings", "public"));
  return snap.exists() ? ({ ...fallback, ...snap.data() } as T) : fallback;
}

export async function saveHotelSettings<T extends object>(settings: T) {
  if (!db) throw new Error("Firebase Firestore is not configured.");
  await setDoc(doc(db, "hotelSettings", "public"), { ...settings, updatedAt: serverTimestamp() }, { merge: true });
}
