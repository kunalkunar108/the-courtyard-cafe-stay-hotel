import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";

const email=process.argv[2];
if(!email) throw new Error("Usage: node scripts/make-staff.mjs user@email.com");
initializeApp();
const user=await getAuth().getUserByEmail(email);
const current=user.customClaims||{};
await getAuth().setCustomUserClaims(user.uid,{...current,staff:true,admin:false});
console.log("Staff claim applied to",email);
