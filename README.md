
---
# PlateShare – Server API

Backend REST API for PlateShare food sharing platform.

🌐 Live API: https://plateshare-server.onrender.com

## Features
- CRUD operations for foods
- Food request management system
- MongoDB database integration
- Firebase JWT protected routes
- Role-based access for food owner

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Firebase Admin SDK
- JWT
- dotenv
- CORS

## Collections
- `foods`
- `foodRequests`

## API Endpoints
### Foods
- `POST /foods` (Private)
- `GET /foods`
- `GET /foods/:id` (Private)
- `PATCH /foods/:id` (Private)
- `DELETE /foods/:id` (Private)

### Food Requests
- `POST /requests`
- `GET /requests?foodId=`
- `PATCH /requests/:id` (accept / reject)

## Request Logic
- Default request status: `pending`
- Accept → request: `accepted`, food: `donated`
- Reject → request: `rejected`

## Setup
```bash
git clone https://github.com/Avishek02/ph-assignment10-plateshare-server.git
cd server
npm install
npm run dev
