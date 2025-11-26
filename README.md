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
| Authentication     | Auth.js                       | Secure session management, handling OAuth, Credentials, and Email flows |
| Database           | Prisma ORM, PostgreSQL (neon)  | Type-safe database access and schema management                         |
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

### C. Onboarding Utility Function 

# Customer Onboarding and KYC Verification Module

This module handles the secure, multi-step registration of a new customer, including **Know Your Customer (KYC)** document uploads and mandatory email verification via a **One-Time Password (OTP)**.

---

## 1. Overview

The onboarding process is structured into two main phases:

- **Registration** (`/onboarding`): A client-side, 4-step form that collects personal, identity, document, and background data.  
- **Verification** (`/onboard/verify-customer/[id]`): A dedicated page where the customer inputs the 6-digit OTP sent to their email address to finalize account provisioning.  

---

## 2. Client-Side Components

The client side leverages **React Hook Form** and **Zod** for schema-based, step-by-step validation.

| File                     | Description                                | Key Responsibilities                                                                 |
|--------------------------|--------------------------------------------|-------------------------------------------------------------------------------------|
| `OnboardCustomerPage.ts` | Main route component (`/onboarding`).      | Sets up the page layout and renders the core form component.                        |
| `CreateCustomerForm.ts`  | Multi-step form logic.                     | Manages `currentStep` (1–4). Triggers validation for each step before proceeding. Handles final API submission and redirects to verification page. |
| `VerificationPageClient.ts` | Verification wrapper (`/onboard/verify-customer/[id]`). | Fetches customer details (ID, Name, Email) server-side and passes them to client. Redirects user to success page upon OTP entry. |
| `OtpVerificationForm.ts` | OTP Input and Verification.                | Manages OTP input, calls `/api/onboard/verify-otp` and `/api/onboard/resend-otp`. Enforces 15s cooldown for resend button. Provides real-time feedback (success/error/info). |

---

## 3. Server-Side API Endpoints

### 3.1 Customer Creation (`POST /api/onboard`)

**Route:** `api/onboard/route.ts`  

This is the primary endpoint for registering a new customer and initiating verification.

| Step            | Action              | Technical Detail                                                                 |
|-----------------|---------------------|---------------------------------------------------------------------------------|
| 1. Validation   | Input Check         | Uses `CustomerOnboardingAPISchema` (Zod) for robust server-side validation.     |
| 2. Persistence  | Database Transaction| Prisma transaction creates `Image` records + `Customer` record. Status = `PENDING`. |
| 3. OTP Generation | Security Layer    | Calls `generateEmailOtp()` → unique OTP, HMAC hash, 10-min expiry.              |
| 4. OTP Storage  | DB Update           | Updates `Customer` with `emailOtpHash`, `emailOtpExpiry`, resets `emailOtpAttempts`. |
| 5. Email Delivery | Notification      | Calls `sendEmailOtp` to deliver OTP to customer’s email.                        |
| 6. Response     | Redirect Payload    | Returns `customerId` for redirection to `/onboard/verify-customer/[id]`.        |

---

### 3.2 Verification & Resend

These endpoints manage the secure OTP workflow (see **Secure Customer Onboarding Workflow**).

| Endpoint                   | Purpose             | Key Logic                                                                 |
|-----------------------------|---------------------|---------------------------------------------------------------------------|
| `POST /api/onboard/verify-otp` | Final Verification | Validates OTP via HMAC-SHA256 + expiry. If valid → Prisma transaction updates `Customer.status` to `VERIFIED` and creates `bankAccount`. Sends confirmation email. |
| `POST /api/onboard/resend-otp` | OTP Refresh        | Resets `emailOtpAttempts` to 0. Generates new OTP + expiry hash. Sends new OTP email. |

---

## 4. State Management and Flow

The module manages critical state across the workflow:

- **Customer Status:** Initially `PENDING`. Updated to `VERIFIED` only after successful OTP validation (`/api/onboard/verify-otp`).  
- **Security Counters:** `emailOtpAttempts` protects against brute-force attacks. Enforced server-side, reset during resend flow.  
- **Data Integrity:** Image URLs are normalized from array format (`[url]`) expected by frontend → stored as single URL string in backend API before transactional creation.  


# Secure Customer Onboarding and Verification Workflow



This document details the backend and frontend logic governing the secure email verification and atomic bank account creation for new NCBA customers.  
The core principle is **guaranteeing a valid email address before provisioning any financial resources**.

---

## 1. Core Verification Submission Flow

The primary endpoint handles the final verification of the customer's identity and subsequent account creation.

**Endpoint:** `POST /api/onboard/verify-otp`

### 1.1 Pre-Verification Checks

Upon receiving the customer's submitted 6-digit OTP and their `customerId`, the API performs immediate server-side validation:

- **Customer Status Check:** Reject if status is already `VERIFIED`.  
- **Attempt Throttling:** Reject if `emailOtpAttempts` exceeds threshold (currently 5).  
- **Data Presence:** Confirm `emailOtpHash` and `emailOtpExpiry` exist in the customer record.  

### 1.2 OTP Security Validation

The system uses the secure helper function `verifyEmailOtp` (`lib/emailOtp.js`) with cryptographic and time-based security:

- **Expiry Check:** Validates `new Date() < storedExpiry`. OTP validity = 10 minutes.  
- **HMAC Comparison:** Recomputes HMAC-SHA256 using OTP, expiry, and `EMAIL_SECRET`. Compares against `storedHash`.  

### 1.3 Success Action (Status: `"valid"`)

If OTP is valid, the system provisions the account via an atomic transaction:

- **Account Generation:** Calls `generateUniqueAccount` → collision-free 9-digit account number.  
- **Atomic Transaction (Prisma):** Ensures both operations succeed or fail together:
  - **Account Creation:** Inserts record into `bankAccount` table linked to `customerId`.  
  - **Customer Update:** Sets status to `VERIFIED`, clears temporary verification data (`emailOtpHash`, `emailOtpExpiry`, `emailOtpAttempts`).  
- **Notification:** Sends welcome + account confirmation email via `sendAccountMail`.  
- **Response:** Returns success → client redirects user.  

### 1.4 Failure Action (Status: `"expired"` or `"invalid"`)

If OTP validation fails:

- **Attempt Increment:** Increases `emailOtpAttempts`.  
- **Response:** Returns error (`OTP expired`, `Invalid Code`).  

---

## 2. Resend Code Flow

Allows customer to request a new OTP if the original is lost or expired.

**Endpoint:** `POST /api/onboard/resend-otp`

### 2.1 Cooldown Enforcement (Client-Side)

- UI (`VerificationPageClient.js`) enforces **15-second cooldown** on "Resend Code" button.  
- Prevents spamming of email service and server resources.  

### 2.2 Server Action and Update

- **New OTP Generation:** Calls `generateEmailOtp` → new OTP, hash, 10-minute expiry.  
- **Database Update:** Updates customer record, resets `emailOtpAttempts` to 0.  
- **Email Delivery:** Sends new OTP via `sendEmailOtp`.  
- **Response:** Returns success → client restarts 15-second cooldown.  

---

## 3. Key Technical Mechanisms

| Mechanism        | Component/File                     | Technical Detail                                                                 |
|------------------|------------------------------------|---------------------------------------------------------------------------------|
| Secure Hashing   | `lib/emailOtp.js`                  | Uses HMAC-SHA256 with expiry. Plain OTP never stored → protects against leaks.   |
| Atomicity        | `api/onboard/verify-otp/route.js`  | Ensures `bankAccount` creation + `Customer.status` update happen in one transaction. |
| Unique Account ID| `lib/account.js`                   | Iterative loop ensures generated 9-digit account number is unique before commit. |
| Throttling       | `api/onboard/resend-otp/route.js` / Client UI | Server-side max attempts (5) + client-side resend cooldown (15s). |


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
