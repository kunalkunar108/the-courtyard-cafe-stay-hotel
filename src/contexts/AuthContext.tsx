import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "../lib/firebase";
import type { Role, UserProfile } from "../types";

type SessionUser = { uid: string; email: string | null; displayName: string | null; photoURL: string | null };
type Ctx = { user: SessionUser | null; profile: UserProfile | null; loading: boolean; signIn:(e:string,p:string)=>Promise<void>; signUp:(n:string,e:string,p:string)=>Promise<void>; google:()=>Promise<void>; logout:()=>Promise<void> };
const Auth = createContext<Ctx | null>(null);

export function AuthProvider({children}:{children:React.ReactNode}){
  const [user,setUser]=useState<SessionUser|null>(null);
  const [profile,setProfile]=useState<UserProfile|null>(null);
  const [loading,setLoading]=useState(firebaseConfigured);
  useEffect(()=>{
    if(!auth||!db){setLoading(false);return}
    return onAuthStateChanged(auth,async u=>{
      if(!u){setUser(null);setProfile(null);setLoading(false);return}
      setUser({uid:u.uid,email:u.email,displayName:u.displayName,photoURL:u.photoURL});
      const snap=await getDoc(doc(db,"users",u.uid));
      setProfile(snap.exists()?snap.data() as UserProfile:null);
      setLoading(false);
    });
  },[]);
  async function signIn(email:string,password:string){if(!auth)throw new Error("Firebase Authentication is not configured.");await signInWithEmailAndPassword(auth,email,password)}
  async function signUp(name:string,email:string,password:string){
    if(!auth||!db)throw new Error("Firebase Authentication is not configured.");
    const cred=await createUserWithEmailAndPassword(auth,email,password);
    await updateProfile(cred.user,{displayName:name});
    await setDoc(doc(db,"users",cred.user.uid),{uid:cred.user.uid,name,email,role:"customer" as Role,createdAt:serverTimestamp()});
    await sendEmailVerification(cred.user);
  }
  async function google(){if(!auth)throw new Error("Firebase Authentication is not configured.");await signInWithPopup(auth,new GoogleAuthProvider())}
  async function logout(){if(auth)await signOut(auth)}
  const value=useMemo(()=>({user,profile,loading,signIn,signUp,google,logout}),[user,profile,loading]);
  return <Auth.Provider value={value}>{children}</Auth.Provider>
}
export function useAuth(){const c=useContext(Auth);if(!c)throw new Error("useAuth must be used inside AuthProvider");return c}