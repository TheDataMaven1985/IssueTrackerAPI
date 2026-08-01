# Issue Tracker API

A full-featured REST API for tracking projects, issues, and comments — built as a learning project modeled on real-world tools like GitHub Issues, Jira, and Linear. It covers the core concerns of a professional backend: JWT authentication with refresh tokens, resource-level and role-based authorization, filtering and search, and centralized error handling.

**Live API:** https://issuetrackerapi-fqbr.onrender.com

> Hosted on Render's free tier — the first request after ~15 minutes of inactivity may take 30–60 seconds while the instance spins back up. Subsequent requests are fast.

## Tech Stack

- **Node.js** / **Express.js** — server and routing
- **MongoDB** / **Mongoose** — database and ODM
- **JWT** (access + refresh tokens) — authentication
- **bcrypt** — password hashing
- **cookie-parser** — httpOnly refresh token cookies
- **dotenv** — environment configuration
- **Morgan** — request logging
- **CORS** — cross-origin support

## Architecture

The project follows an MVC + service-layer pattern:

```
src/
├── config/        # DB connection setup
├── controllers/    # Handle req/res, call services, no business logic
├── middleware/     # authMiddleware (JWT verification), roleMiddleware (RBAC), error handlers
├── models/         # Mongoose schemas
├── routes/         # URL → controller mapping only
├── services/        # Business logic and database queries — no req/res
├── utils/          # ApiError class, shared helpers
├── app.js          # Express app + middleware chain (no listen)
└── server.js       # Connects to DB, starts the server
```

**Why this structure?** Controllers stay thin and only translate HTTP ↔ application logic. All business logic and database access lives in the service layer, which makes it reusable and independent of Express — the same functions could be called from a script, a test, or a future CLI tool without modification.

## Authentication

- Registration hashes passwords with bcrypt before storage.
- Login issues two JWTs:
  - **Access token** (short-lived, ~15 min) — returned in the JSON response body, sent by the client as `Authorization: Bearer <token>` on every request.
  - **Refresh token** (long-lived, ~7 days) — stored as an `httpOnly`, `secure`, `sameSite=strict` cookie, and persisted on the user's document in MongoDB.
- `POST /auth/refresh` verifies the refresh token's signature **and** checks it against the value stored in the database — this is what makes logout a real, enforceable revocation rather than just clearing a cookie. A refresh token that's valid cryptographically but no longer matches the database (e.g. after logout) is rejected.

## Authorization

Two independent layers are used together:

1. **Resource-level (ownership/membership)** — checked per-request inside the relevant service function. For example, an issue's parent project determines who can view or update it (owner or member); deleting an issue is restricted to the project owner **or** the issue's original reporter.
2. **Role-based (RBAC)** — a system-wide property (`Admin`, `Manager`, `Developer`) enforced independently of resource ownership:

   | Action | Admin | Manager | Developer |
   |---|---|---|---|
   | Create Project | ✅ | ✅ | ❌ |
   | Delete Project | ✅ | ❌ | ❌ |
   | Create Issue | ✅ | ✅ | ✅ |
   | Assign Issue | ✅ | ✅ | ❌ |
   | Delete Issue | ✅ | ✅ | ❌ |

   Coarse-grained rules (Create/Delete Project) are enforced via reusable `requireRole(...roles)` middleware on the route. Field-specific rules (e.g. only Admin/Manager can set `assignee` during an otherwise-unrestricted issue update) are enforced inside the service layer, since middleware alone can't inspect which fields a request is trying to change.

## API Reference

All protected routes require `Authorization: Bearer <accessToken>`.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new user |
| POST | `/auth/login` | Authenticate, receive access token + refresh cookie |
| POST | `/auth/refresh` | Exchange a valid refresh token for a new access token |
| POST | `/auth/logout` | Revoke the refresh token |
| GET | `/users/profile` | Get the current user's profile *(protected)* |

### Projects
| Method | Endpoint | Description | Restriction |
|---|---|---|---|
| POST | `/projects` | Create a project | Admin, Manager |
| GET | `/projects` | List projects you own or belong to | — |
| GET | `/projects/:id` | Get a single project | Owner or member |
| PATCH | `/projects/:id` | Update a project | Owner or member |
| DELETE | `/projects/:id` | Delete a project | Owner, Admin only |

### Issues
| Method | Endpoint | Description | Restriction |
|---|---|---|---|
| POST | `/issues` | Create an issue in a project | Project owner or member |
| GET | `/issues` | List issues across your projects | Supports filters below |
| GET | `/issues/:id` | Get a single issue | Project owner or member |
| PATCH | `/issues/:id` | Update an issue | Project owner or member; setting `assignee` requires Admin/Manager |
| DELETE | `/issues/:id` | Delete an issue | Project owner or the issue's reporter; Admin/Manager |

**Query filters on `GET /issues`:**
- `?status=Todo` — exact match
- `?priority=High` — exact match
- `?assignee=<userId>` — exact match
- `?project=<projectId>` — narrow to one project (must be one you have access to)
- `?search=login` — case-insensitive partial match against title/description

### Comments
| Method | Endpoint | Description | Restriction |
|---|---|---|---|
| POST | `/:id/comments` | Add a comment to an issue | Project owner or member |
| GET | `/:id/comments` | List comments on an issue | Project owner or member |
| DELETE | `/comments/:id` | Delete a comment | Comment author or project owner |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Aggregate stats: total projects, total issues, completed, pending, high priority |

## Postman Collection

A full Postman collection covering every endpoint is included in this repo, with a login test script that automatically captures the access token into a collection variable — run Login once and every subsequent request is authenticated.

## Getting Started Locally

```bash
git clone https://github.com/TheDataMaven1985/IssueTrackerAPI
cd IssueTrackerAPI
npm install
```

Create a `.env` file in the project root:

```
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

Run it:

```bash
npm run dev
```

The server starts on `http://localhost:5000` (or your configured `PORT`).
