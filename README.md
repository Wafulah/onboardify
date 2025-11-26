# Customer Verification and Onboarding Platform

**Documentation Version:** 1.0.0  
**Prepared by:** Victor Wafula Simiyu

This document provides a technical overview of the **NCBA Customer Verification and Onboarding Platform**, detailing its architecture, core functionalities, and data flow mechanisms.  
This application uses modern security practices, including **Next.js Server Actions** for authenticated mutations and **Role-Based Access Control (RBAC)** to segment user data access.

---

## 1. System Architecture Overview

This platform is built on a robust, full-stack, type-safe architecture.

| Layer              | Technology                        | Purpose                                                                 |
|--------------------|-----------------------------------|-------------------------------------------------------------------------|
| Frontend/Framework | Next.js (App Router), React       | Server-side rendering (SSR), Routing, UI management                     |
| Styling            | Tailwind CSS, Shadcn UI           | Utility-first styling for a responsive, accessible interface            |
| Authentication     | NextAuth.js                       | Secure session management, handling OAuth, Credentials, and Email flows |
| Database           | Prisma ORM, PostgreSQL (Implied)  | Type-safe database access and schema management                         |
| Data Flow          | Next.js Server Actions, API Routes| Secure, authenticated data mutations and complex backend logic          |

The application leverages the **Next.js App Router paradigm**, separating client components (interactivity) from server components (data fetching, security, and complex logic).

---

## 2. Core Authentication and Security Flow

Authentication is managed via **NextAuth.js**, utilizing dedicated Server Actions for all sign-in and sign-out operations.

### 2.1 Server Actions (`actions/auth.ts`)

| Function          | Endpoint/Flow                     | Description                                                                 |
|-------------------|-----------------------------------|-----------------------------------------------------------------------------|
| `serverSignIn(provider, options)` | POST request (handled by NextAuth) | Wraps NextAuth `signIn`. Handles Credentials, Nodemailer (magic link), and OAuth flows. Always redirects upon success. |
| `serverSignOut()` | POST request (handled by NextAuth) | Wraps NextAuth `signOut`. Redirects user to `/` upon session destruction.   |

**Security Principle:**  
All authentication logic is executed securely on the server, keeping API secrets and credential processing isolated from the client.

### 2.2 Role-Based Access Control (RBAC)

- **URL:** Any protected route (e.g., `/customers`)  
- **Logic:**  
  - If the user is not authenticated or lacks the required role (ADMIN or SALES), they are redirected to `/login` or `/unauthorized`.

---

## 3. Data Layer and Schema

The application relies on several core **Prisma models**: `User`, `Customer`, and `Image`.

| Model    | Key Fields / Relations                                                                 | Purpose                                      |
|----------|-----------------------------------------------------------------------------------------|----------------------------------------------|
| User     | `role` (ADMIN, SALES, etc.), `dsaCode`                                                 | Manages user credentials and authorization   |
| Customer | `id`, `nationalId`, `status` (PENDING, VERIFIED, REJECTED, FLAGGED), `createdBy` (1:M) | Core record for customer onboarding          |
| Image    | `url`, `customer` (M:1)                                                                | Stores uploaded verification documents       |

---

## 4. Platform Modules and Functionality

### A. Customer Accounts Dashboard (List View)

- **URL:** `/customers`  
- **Purpose:** Provides a real-time, filtered list of all customer applications.  

**RBAC Enforcement:**  
- **ADMIN:** Views all customer records.  
- **SALES:** Views only records where `createdById` matches their own user ID.  

**Key Functions:**  
- Data Aggregation: Joins `Customer` with `createdBy` to display agent’s name.  
- Filtering & Sorting: Client-side `DataTable` supports searching and sorting.  

---

### B. Customer Detail and Verification (Review View)

- **URL:** `/customers/[customerId]`  
- **Purpose:** Allows authorized personnel to review submissions and update verification status.  

**Key Components:**  
- `page.tsx`: Fetches customer data, including nested images and `createdBy`.  
- `customer-form.tsx`: Primary client component.  
- Toggle Edit Mode: Protects status updates with explicit `isEditing`.  
- Document Review: Displays previews of Profile Photo, ID Front, and ID Back.  

**Key Functions/URLs:**

| Function     | URL                                | Description                                                        |
|--------------|------------------------------------|--------------------------------------------------------------------|
| `onSubmit(data)` | `PATCH /api/admin/customers/[id]` | Updates customer status and `flagReason` in database               |
| `onDelete()`     | `DELETE /api/admin/customers/[id]`| Permanently removes customer record after confirmation via modal   |

---

### C. Onboarding Utility Function (Placeholder)

- **Conceptual Function:** `sendOtp(email: string)`  
- **Flow:** Triggered implicitly by `serverSignIn("nodemailer", { email })`.  
- Actual email delivery handled by secure external service configured in NextAuth.

---

## 5. Setup and Installation

### Prerequisites
- Node.js (v18+)  
- PostgreSQL Database  
- Prisma CLI  

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/Wafulah/onboardify.git
cd onboardify

# Install dependencies
npm install

## Configure Environment

Create a `.env` file:

```bash
# Database URL
DATABASE_URL="postgresql://user:pass@host:port/database"

# NextAuth configuration
NEXTAUTH_SECRET="[generate-a-strong-secret]"
NEXTAUTH_URL="http://localhost:3000"

# Email provider (Nodemailer/OTP flow)
EMAIL_SERVER_HOST=...
EMAIL_SERVER_PORT=...
EMAIL_SERVER_USER=...
EMAIL_SERVER_PASSWORD=...
EMAIL_FROM=...

## Database Migration and Seeding

```bash
npx prisma migrate dev --name init
# Optional seeding
npx prisma db seed

## Start Development Server

```bash
npm run dev

## Application Access

The application will be accessible at:  
👉 [http://localhost:3000](http://localhost:3000)
