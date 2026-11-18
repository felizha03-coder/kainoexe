# Database & Persistence Setup (`DATABASE_SETUP.md`)

NIEL. uses **Firebase Firestore** (plus Firebase Authentication) for real-time portfolio content synchronization and a lightweight server store for AI quota counters and admin configuration.

---

## 1. Firebase Configuration

The client and server read Firebase project coordinates from `firebase-applet-config.json` at the workspace root, specifying:
- `projectId`
- `firestoreDatabaseId`
- `authDomain`
- `apiKey` (public Firebase web API key)

Ensure **Google Sign-In** is enabled in Firebase Authentication for `/admin` access.

---

## 2. Firestore Schema (`firebase-blueprint.json`)

| Collection | Document ID | Public Read | Admin Write | Purpose |
| --- | --- | --- | --- | --- |
| `projects` | `projectId` | Yes | Yes | Portfolio projects, descriptions, tech stacks, URLs, thumbnails |
| `blog_posts` | `postId` | Only `published == true` | Yes | Technical articles and drafts |
| `learning_resources` | `resourceId` | Yes | Yes | IT study modules and roadmap content |
| `site_settings` | `public_profile` | Yes | Yes | Niel's editable university info, courses, skills, and contact links |

---

## 3. Security Rules (`firestore.rules`)

Security rules enforce:
- Strict admin identity check (`request.auth.token.email_verified == true` and authorized admin email).
- Draft blog posts (`published == false`) are readable only by the authenticated admin.
- Public visitors can read published content cleanly without authentication.

To validate and deploy Firestore rules:
```bash
npx eslint firestore.rules
```
And deploy via the platform Firebase deployment flow whenever `firestore.rules` changes.

---

## 4. Environment Variables Reference

See `.env.example`:
- `GEMINI_API_KEY`: Required on the server for `/api/ai/stream`.
- `ADMIN_EMAIL_ALLOWLIST`: Authorized admin Google email(s).
- `AI_DAILY_LIMIT_PER_SESSION`: Daily request limit per anonymous session.
- `AI_MAX_INPUT_LENGTH`: Max characters per prompt.
