# The Grand Courtyard Hotel

Production-oriented hotel booking platform for The Grand Courtyard Hotel, Muzaffarpur, Bihar.

## Included

- Premium responsive React + TypeScript + Vite frontend
- Tailwind design system
- Room listing and dynamic room details
- Availability search and checkout flow
- Firebase email/password + Google authentication architecture
- Firestore data layer
- Customer dashboard and booking history
- Secure admin entry point
- Firestore and Storage security rules
- Cloud Functions for server-side availability, pricing and Razorpay verification
- Vercel SPA deployment configuration
- Environment variable template

## Setup

1. Create a Firebase project.
2. Enable Email/Password and Google sign-in.
3. Create Firestore and Storage.
4. Copy .env.example to .env.local and add Firebase values.
5. Run npm install.
6. Run npm run dev.
7. Deploy rules and indexes with the Firebase CLI.
8. Deploy Functions and add Razorpay secrets before accepting real payments.

## Admin

Never grant admin from public signup. After the account exists, use the trusted admin script:

npm run make-admin user@email.com

The script expects Firebase Admin credentials in the trusted execution environment.

## Production payment flow

The browser calls createBooking. The Cloud Function re-checks availability, recalculates the trusted price, creates booking/payment records and creates a Razorpay order. A booking is not marked paid merely because the browser says payment succeeded. verifyRazorpayPayment checks the Razorpay HMAC signature before confirming the booking.

## Vercel

Set the VITE_FIREBASE_* variables in Vercel project settings. The included vercel.json rewrites SPA routes to index.html.

## Security

Frontend role checks control UI only. Firestore and Storage rules use Firebase custom claims for privileged access. Do not commit .env, service-account JSON, private keys or payment secrets.

## Next modules

Admin CRUD screens, gallery upload UI, invoices, room-service operations, coupon workflows, notifications, analytics and automated refund policy are the next implementation layer.
