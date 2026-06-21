# PropSpace

A full-stack property listing platform built with React, Node.js/Express, and MongoDB. Users can browse property listings across Cameroon, create accounts, manage their own listings, and update their profiles.

---

## Features

- **Browse & Filter** — public property feed filterable by city, price range, and type
- **Authentication** — JWT-based register/login with bcrypt password hashing
- **Property CRUD** — create, view, edit, and delete listings (owners only)
- **Dashboard** — private "My Listings" view with portfolio stats
- **Profile Management** — update username, phone number, avatar URL, and password
- **Protected Routes** — route guards on all authenticated pages (frontend + backend)
- **Responsive UI** — glassmorphism dark theme with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v3, React Router v7 |
| Backend | Node.js, Express v4 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| HTTP Client | Axios (with global auth interceptor) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas connection string (or local MongoDB)

### 1. Clone and install

```bash
git clone <repo-url>
cd PropSpace

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Seed the database

```bash
cd server
npm run seed
```

This populates 16 sample properties across Cameroonian cities (Douala, Yaoundé, Kribi, Limbe, Buea, Bamenda, Bafoussam, Garoua, Ngaoundéré) with two demo accounts.

**Demo credentials:**

| Email | Password |
|---|---|
| amara@propspace.cm | Test1234! |
| njike@propspace.cm | Test1234! |

### 4. Run the app

Open two terminals:

```bash
# Terminal 1 — backend (port 5000)
cd server && npm run dev

# Terminal 2 — frontend (port 5173)
cd client && npm run dev
```

Visit `http://localhost:5173`.

---

## API Routes

### Auth — `/api/auth`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a new account |
| POST | `/login` | Public | Login and receive JWT |
| PUT | `/profile` | Protected | Update username, phone, avatar |
| PUT | `/password` | Protected | Change password (verifies old) |

### Properties — `/api/properties`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all properties (filterable) |
| GET | `/:id` | Public | Get a single property |
| GET | `/my` | Protected | Get the authenticated user's listings |
| POST | `/` | Protected | Create a new listing |
| PUT | `/:id` | Protected (owner) | Update a listing |
| DELETE | `/:id` | Protected (owner) | Delete a listing |

**Filter query params for `GET /`:** `city`, `minPrice`, `maxPrice`, `type`

---

## Project Structure

```
PropSpace/
├── client/                  # React frontend
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── components/
│       │   ├── common/      # Navbar, Spinner, ProtectedRoute
│       │   └── properties/  # PropertyCard, FilterSidebar, PropertyGrid
│       ├── context/         # AuthContext (JWT state)
│       ├── hooks/           # useAuth
│       ├── pages/           # HomePage, LoginPage, RegisterPage, Dashboard, etc.
│       ├── services/        # Axios instance with auth interceptor
│       └── routes.jsx       # React Router config
│
└── server/                  # Express backend
    ├── controllers/         # authController, propertyController
    ├── middleware/          # protect (JWT guard)
    ├── models/              # User, Property (Mongoose schemas)
    ├── routes/              # authRoutes, propertyRoutes
    ├── seed.js              # Database seeder
    └── server.js            # Entry point
```

---

## Deploying to Vercel

The app is configured for a single Vercel deployment — the frontend and Express API are hosted together under one URL.

### 1. Push to GitHub

Make sure all changes are committed and pushed to your GitHub repository.

### 2. Import the project in Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. **Leave the root directory as `/`** (do not change it — the `vercel.json` at the root handles everything)
4. Framework preset: **Other**
5. Click **Deploy**

### 3. Add environment variables

After the first deploy (it will fail without these), go to **Project Settings → Environment Variables** and add:

| Name | Value |
|---|---|
| `MONGO_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | your JWT secret (any long random string) |
| `NODE_ENV` | `production` |

Then go to **Deployments** and click **Redeploy**.

### MongoDB Atlas network access

In the Atlas dashboard, go to **Network Access** and add `0.0.0.0/0` (allow from anywhere) so Vercel's dynamic IP addresses can connect.

---

## Currency

All property prices are in **XAF (Central African CFA franc)**, displayed as **FCFA** throughout the app.

---

## License

Academic project: Therese-Claire · 2026
