# SnapCut AI — Production-Ready AI Background Removal SaaS

A high-performance commercial web application and API platform for automated AI image background removal, transparent RGBA previews, credit accounting, Razorpay subscriptions, and n8n backend automation.

## Core Features

- **Sub-Pixel Edge Matting:** Remove backgrounds with clean hair and organic borders in hundreds of milliseconds.
- **Interactive Before-After Slider:** Compare original photography side-by-side against authentic checkerboard transparency.
- **Strict Ephemeral Privacy:** All uploaded images automatically expire and are purged from temporary Cloudinary storage within 24 hours. Zero model training.
- **ACID Credit Accounting:** Atomic PostgreSQL credit reservations, daily quota enforcement (Free: 5/day; Pro: 200/day), and automatic release on failure.
- **Razorpay Payments (INR):** Pro Monthly subscriptions (₹499/mo) and non-expiring credit packs (25: ₹99, 100: ₹299, 500: ₹999) with webhook signature verification.
- **Developer REST API:** High-entropy API keys with single-exposure secret generation, rate limits, and live telemetry.
- **Admin Fleet Console:** Role-protected dashboards for job queue monitoring, revenue analytics, n8n workflow health, and audited credit adjustments.

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run automated logic test suite
npx --yes tsx --test tests/credit_accounting.test.ts

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with SnapCut AI.

## Project Structure

```
├── docs/                     # Architecture, Deployment Checklist, API Docs
├── n8n/workflows/            # 5 Importable n8n Cloud Automation Workflows
├── supabase/
│   ├── migrations/           # 11 PostgreSQL Tables, Functions, and RLS Policies
│   └── tests/                # SQL Schema Test Suite
├── tests/                    # Unit tests for credit rules & validation
├── src/
│   ├── components/layout/    # Navbar, Footer, AppLayout, AdminLayout
│   ├── components/ui/        # BeforeAfterSlider, Toasts, Modals
│   ├── lib/                  # State Store, Supabase Client, Quota Engine
│   ├── pages/
│   │   ├── admin/            # Fleet Overview, Users, Jobs, Payments, Workflows
│   │   ├── app/              # Dashboard, Workspace, Result, History, Billing, API Keys
│   │   ├── auth/             # Login, Register, Password Recovery, Verification
│   │   └── public/           # Landing, Features, Pricing, Docs, Blog, Legal
│   ├── services/             # AI Provider Adapters (Remove.bg, Clipdrop, Edge)
│   └── types/                # Domain Model Types
```
