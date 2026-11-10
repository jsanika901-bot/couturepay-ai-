# COUTUREPAY AI

> **From Creative Vision to Paid Project**  
> An AI-powered business platform tailored for freelance fashion designers and couture sketch artists. It converts client fashion briefs into professional quotations, manages bespoke projects, and accepts verified PayPal Sandbox payments.

---

## Key Features

1. **Atelier Dashboard**
   - Live revenue metrics in Sandbox payment volume, pending quotations, paid projects, and total pipeline value.
   - Recent activity feed tracking brief submissions, quotation approvals, verified captures, and deliverable handoffs.
   - Quick action shortcuts for instant brief logging or quotation review.

2. **Client Fashion Brief**
   - Detailed couture questionnaire: Garment category (Haute Couture Gown, Bespoke Bridal, Red Carpet Gala, Tailored Tuxedo, Avant-Garde Runway, Editorial Corsetry, Ready-to-Wear Capsule).
   - Occasion, inspiration moodboard, color harmony, fabric & embellishment preferences (French Chantilly lace, silk dupioni, hand beading, Swarovski crystal work), budget tier, target deadline, and silhouette specifications.

3. **AI Quotation Generator**
   - Powered by **Google Gemini 3.8 Flash** (`@google/genai`) on the server.
   - Generates bespoke project title, executive summary, 3-phase scope of work, itemized couture deliverables, pricing breakdown, currency, revision policy (e.g., silhouette & muslin toile rounds), and delivery schedule.
   - Automatic fallback clearly marked with a `DEMO` badge when AI keys are not yet configured.

4. **Project Lifecycle Management**
   - Full status pipeline:
     1. `Brief Received`
     2. `Quotation Prepared`
     3. `Awaiting Payment`
     4. `Payment Confirmed`
     5. `In Progress`
     6. `Delivered`
   - Filter, search, edit, and delete projects with persistent database storage.

5. **Official PayPal Sandbox Integration**
   - Secure server-side Orders API integration:
     - `POST /api/paypal/create-order` retrieves OAuth 2.0 access tokens and creates an intent order.
     - `POST /api/paypal/capture-order` captures funds directly via PayPal backend and verifies the capture response (`COMPLETED`).
     - Never exposes PayPal Secret to client code.
     - Never trusts client-only confirmation; verification is strictly executed on the server.
     - Stores PayPal Transaction ID, capture amount, currency, payer email, and timestamp.
     - Fully tagged with `[TEST PAYMENT / SANDBOX]` watermark.
     - Gracefully displays "Sandbox Not Connected" if credentials are not configured, with built-in test sandbox simulation mode.

6. **Haute Couture Receipts**
   - Generates official designer invoice receipts upon payment capture with unique invoice number, project scope, client details, transaction reference, date, and `TEST PAYMENT` disclaimer.
   - Printable and downloadable directly.

7. **Client Portal Mode**
   - Instant toggle to preview the project as the client: review quotation, approve project terms, pay securely via PayPal Sandbox, and track delivery progress.

8. **Settings & Atelier Profile**
   - Real-time connection status check for Gemini AI and PayPal Sandbox.
   - Customizable designer atelier brand name, contact email, default currency, and bespoke revision policy.
   - Seed data reset button.

---

## Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```env
# Gemini AI API Key (auto-injected in Google AI Studio)
GEMINI_API_KEY="your-gemini-api-key"

# App URL
APP_URL="http://localhost:3000"

# PayPal Sandbox Credentials (from developer.paypal.com)
PAYPAL_CLIENT_ID="your-paypal-sandbox-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-sandbox-client-secret"
PAYPAL_BASE_URL="https://api-m.sandbox.paypal.com"
```

---

## Setup & Running Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000` with the Express API and Vite frontend unified.

3. **Build for Production**
   ```bash
   npm run build
   ```

---

## License

This project is licensed under the [MIT License](LICENSE).
