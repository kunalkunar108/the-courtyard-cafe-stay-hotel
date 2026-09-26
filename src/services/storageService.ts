import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";

const allowed = new Set(["image/jpeg","image/png","image/webp","image/avif"]);
const MAX = 5 * 1024 * 1024;

export async function uploadHotelImage(file: File, folder: "gallery"|"rooms"|"restaurant"|"events", id: string) {
  if (!storage) throw new Error("Firebase Storage is not configured.");
  if (!allowed.has(file.type)) throw new Error("Only JPEG, PNG, WebP or AVIF images are allowed.");
  if (file.size > MAX) throw new Error("Image must be smaller than 5 MB.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const objectRef = ref(storage, folder + "/" + id + "/" + Date.now() + "-" + safeName);
  await uploadBytes(objectRef, file, { contentType: file.type, cacheControl: "public,max-age=31536000,immutable" });
  return getDownloadURL(objectRef);
}
