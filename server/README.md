# Portfolio Server (Node + Express + MySQL)

This is a minimal auth API for the portfolio app.

## Features
- Sign up (`POST /api/auth/signup`)
- Login (`POST /api/auth/login`)
- JWT-based auth tokens
- Password hashing with bcrypt
- MySQL database (via mysql2)

## Setup
1. Create a `.env` file in `server/` (see keys below):
```
PORT=4000
JWT_SECRET=replace-with-a-long-random-string
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=portfolio_app
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_ID=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_SUCCESS_URL=http://localhost:5173/?upgrade=success&session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=http://localhost:5173/?upgrade=cancelled
```

2. Create the database and tables:
```
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS portfolio_app;"
mysql -u root -p portfolio_app < sql/schema.sql
```

3. Install dependencies and run:
```
cd server
npm install
npm run dev
```

## Endpoints
- `POST /api/auth/signup`
  - Body: `{ "email": string, "password": string }`
  - On success: `{ "token": string, "user": { "id": number, "email": string, "plan": "free" | "pro" } }`
  - 409 if email already exists

- `POST /api/auth/login`
  - Body: `{ "email": string, "password": string }`
  - On success: `{ "token": string, "user": { "id": number, "email": string, "plan": "free" | "pro" } }`
  - 401 on invalid credentials

- `GET /api/auth/me`
  - Requires `Authorization: Bearer <token>`
  - Returns the authenticated user

- `POST /api/payments/create-checkout-session`
  - Requires auth
  - Returns `{ url }` for Stripe Checkout
- `POST /api/payments/confirm-session`
  - Requires auth
  - Body: `{ "sessionId": string }`
  - Verifies payment with Stripe and upgrades the user to Pro (useful if webhooks aren’t configured locally)

- `POST /api/payments/webhook`
  - Stripe webhook endpoint (set the signing secret in env). On successful payment, upgrades the user to Pro.


