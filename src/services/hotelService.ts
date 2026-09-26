import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, firebaseConfigured, functions } from "../lib/firebase";
import { demoMenu, demoReviews, demoRooms } from "../data/demo";
import { nights } from "../lib/utils";
import type { Booking, MenuItem, Review, Room } from "../types";

export async function getRooms():Promise<Room[]>{
  if(!db)return demoRooms;
  const snap=await getDocs(query(collection(db,"rooms"),where("status","==","available")));
  return snap.docs.map(d=>({id:d.id,...d.data()})) as Room[];
}
export async function getRoom(id:string):Promise<Room|null>{
  if(!db)return demoRooms.find(r=>r.id===id)||null;
  const snap=await getDoc(doc(db,"rooms",id));
  return snap.exists()?({id:snap.id,...snap.data()} as Room):null;
}
export async function getApprovedReviews():Promise<Review[]>{
  if(!db)return demoReviews;
  const snap=await getDocs(query(collection(db,"reviews"),where("status","==","approved"),orderBy("createdAt","desc")));
  return snap.docs.map(d=>({id:d.id,...d.data()})) as Review[];
}
export async function getMenuItems():Promise<MenuItem[]>{
  if(!db)return demoMenu;
  const snap=await getDocs(query(collection(db,"menuItems"),where("available","==",true)));
  return snap.docs.map(d=>({id:d.id,...d.data()})) as MenuItem[];
}
export async function getUserBookings(userId:string):Promise<Booking[]>{
  if(!db)return [];
  const snap=await getDocs(query(collection(db,"bookings"),where("userId","==",userId),orderBy("createdAt","desc")));
  return snap.docs.map(d=>({id:d.id,...d.data()})) as Booking[];
}
export function calculateQuote(room:Room,a:string,b:string){
  const count=nights(a,b); const base=room.price*count; const tax=Math.round(base*.12); return {nights:count,base,tax,total:base+tax};
}
export async function createBooking(input:{
  roomId:string;guestName:string;guestEmail:string;guestPhone:string;checkIn:string;checkOut:string;adults:number;children:number;specialRequests?:string;couponCode?:string;
}){
  if(!firebaseConfigured||!functions)throw new Error("Connect Firebase before accepting real bookings.");
  const fn=httpsCallable(functions,"createBooking");
  const res=await fn(input);
  return res.data as {bookingId:string;paymentRequired:boolean;razorpayOrderId?:string;amount:number;currency:string;keyId?:string};
}
export async function verifyPayment(input:{bookingId:string;razorpayOrderId:string;razorpayPaymentId:string;razorpaySignature:string}){
  if(!functions)throw new Error("Firebase Functions are not configured.");
  const fn=httpsCallable(functions,"verifyRazorpayPayment"); const res=await fn(input); return res.data as {verified:boolean};
}
export async function createContactMessage(input:{name:string;email:string;phone:string;message:string}){
  if(!db)throw new Error("Connect Firebase before sending enquiries.");
  await addDoc(collection(db,"contactMessages"),{...input,status:"new",createdAt:serverTimestamp()});
}
export async function createReview(input:{userId:string;bookingId:string;rating:number;title:string;comment:string}){
  if(!db)throw new Error("Firebase is required for reviews.");
  await addDoc(collection(db,"reviews"),{...input,status:"pending",createdAt:serverTimestamp()});
}
export async function cancelBooking(id:string){if(!db)throw new Error("Firebase is required.");await updateDoc(doc(db,"bookings",id),{bookingStatus:"cancelled",cancellationReason:"Customer requested cancellation",cancelledAt:serverTimestamp(),updatedAt:serverTimestamp()})}