# Testing Guide - Order Flow

## Overview
This guide covers testing the complete order flow: checkout → Firestore → Admin Panel → Emails.

## Issues Fixed

### 1. Orders Not Appearing in Admin Panel
**Root Cause:** Firestore `addDoc` to `orders` collection was failing silently.

**Fix:** 
- Added explicit success/failure tracking in `CheckoutModal.tsx`
- Added console logging for debugging
- Added toast notifications to inform user of backend sync status

### 2. Admin Not Receiving Order Emails
**Root Cause:** `/api/order-created` Vercel function might not be deployed or accessible.

**Fix:**
- Added response status checking in email API call
- Added fallback for local development using `VITE_API_BASE_URL`
- Added detailed error logging

### 3. Customer Not Receiving Confirmation Email
**Root Cause:** Same as #2 - email API not being called or failing silently.

**Fix:**
- Same fixes as #2
- Added validation that customerEmail exists before sending

### 4. Orders Not Showing in User Portal
**Root Cause:** Guest checkout orders only saved to localStorage, not synced to user's Firestore document.

**Fix:**
- Added logic to save order to `users/{uid}` document when user is authenticated
- Orders now sync to both `orders` collection (admin) and user document (user portal)

## Testing Steps

### 1. Local Development Setup
```bash
# 1. Start Vercel dev server (for API functions)
npx vercel dev

# 2. In another terminal, start Vite dev server
npm run dev

# 3. Set VITE_API_BASE_URL in .env.local
echo "VITE_API_BASE_URL=http://localhost:3000" > .env.local
```

### 2. Test COD (Cash on Delivery) Order
1. Add items to cart
2. Go to checkout
3. Fill in all required fields
4. Select "Cash on Delivery" payment method
5. Accept terms and place order
6. Verify:
   - Order confirmation modal appears
   - Toast shows "Order confirmed! Confirmation email sent." or appropriate status
   - Check Firestore console: `orders` collection has new document
   - Check Firestore console: `users/{uid}` has orders array (if logged in)
   - Check admin panel → Orders tab shows the order
   - Check email inbox for customer confirmation
   - Check admin email for new order notification

### 3. Test Online Payment (Razorpay)
1. Add items to cart
2. Go to checkout
3. Fill in all required fields
4. Select "UPI" or "CARD" payment method
4. Complete Razorpay payment
5. Verify same as COD test

### 4. Test Guest Checkout (Not Logged In)
1. Open incognito/private browser window
2. Add items to cart
3. Go to checkout (will redirect to login)
4. Use "Continue as Guest" if available, or complete without logging in
5. Verify:
   - Order appears in `orders` collection in Firestore
   - Order appears in admin panel
   - Emails are sent
   - Order stored in localStorage (visible if user later logs in)

### 5. Test Admin Panel Order Status Update
1. Open admin panel (CMS)
2. Go to Orders tab
3. Click "Refresh" if needed
4. Click status button (e.g., "Shipped") on an order
5. Verify:
   - Status updates in Firestore
   - Status update email sent to customer
   - Toast shows success message

## Environment Variables

### Frontend (.env.local for local dev)
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_API_BASE_URL=http://localhost:3000
```

### Vercel Dashboard (Project Settings → Environment Variables)
```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
BREVO_API_KEY=xkeysib-xxxxx
OWNER_EMAIL=admin@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Your Brand
```