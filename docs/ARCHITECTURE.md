# SnapCut AI — Production System Architecture & Data Flow

## 1. System Topology

```
+----------------------------------------------------------------------------+
|                               Client Tier                                  |
|   React (Vite) SPA + Tailwind CSS + Lucide Icons + TanStack Query          |
+----------------------------------------------------------------------------+
       |                                                    |
       | Bearer Auth Token                                  | Upload Asset
       v                                                    v
+--------------------------------------+      +------------------------------+
|     Supabase Authentication & RLS    |      | Temporary Cloudinary Storage |
|  - auth.users                        |      |  - Signed Delivery URLs      |
|  - PostgreSQL with RLS Policies      |      |  - 24-Hour Auto-Purge Queue  |
+--------------------------------------+      +------------------------------+
       |                                                    ^
       | Trigger Workflow                                   | Clean / Download
       v                                                    |
+----------------------------------------------------------------------------+
|                     Automation & Backend Orchestration                      |
|                                (n8n Cloud)                                 |
|  - Workflow A: Image Processing & Atomic Credit Reservation                |
|  - Workflow B: Razorpay Order Creation                                     |
|  - Workflow C: Razorpay Webhook & Ledger Credit Grant                      |
|  - Workflow D: Scheduled Ephemeral Asset Auto-Purge (Hourly)               |
|  - Workflow E: Operational Alert & SLA Health Monitor                      |
+----------------------------------------------------------------------------+
       |                                                    ^
       | HTTP Post with Image                               | Webhook Event
       v                                                    |
+--------------------------------------+      +------------------------------+
|   AI Background Removal Provider     |      |  Razorpay Payment Gateway    |
|  - Remove.bg API (Primary)           |      |  - Subscriptions (₹499/mo)   |
|  - Clipdrop API (Configurable)       |      |  - Credit Packs (₹99-₹999)   |
|  - Edge Alpha Matting (Fallback)     |      |  - Raw Body HMAC Validation  |
+--------------------------------------+      +------------------------------+
```

## 2. End-to-End Image Processing Lifecycle

1. **User Upload:** File validation (JPEG, PNG, WEBP, <=10 MB, <=5000px).
2. **Atomic Quota Reservation:** Backend checks remaining daily allowance (Free: 5/day; Pro: 200/day). If daily exhausted, checks purchased credits. Atomically calls `reserve_processing_credit()`.
3. **Storage Ingestion:** Original asset uploaded to private temporary Cloudinary storage with a random non-guessable object ID.
4. **AI Inference:** Adapter routes request to Remove.bg or Clipdrop.
5. **Quality Check & Alpha Extraction:** Verifies true transparent RGBA PNG output.
6. **Persistence & Commit:** Records job metadata in `processing_jobs` and commits the credit reservation.
7. **Client Preview:** Displayed with an interactive before-after slider over an authentic transparency checkerboard.
8. **Auto-Purge:** Within 24 hours, Workflow D cryptographically deletes the assets from storage.

## 3. Security Boundaries

- **Zero Client Secrets:** Service role keys, Razorpay secrets, Cloudinary secrets, and AI keys are never bundled in frontend code.
- **Idempotency:** All payment webhooks and credit transactions enforce unique database idempotency keys.
- **Role Elevation Guard:** PostgreSQL RLS strictly prevents users from modifying their own roles or balances.
