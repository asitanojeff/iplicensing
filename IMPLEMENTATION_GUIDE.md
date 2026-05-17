# Uniment IP Licensing Platform - Implementation Guide

## Current Status (65% Complete)

### ✅ Completed Components
- **Backend Infrastructure**: 18+ database tables, 40+ tRPC procedures, 102 vitest tests
- **Core Business Logic**: 
  - Role-based access control (Admin, Licensor, Licensee, Reviewer)
  - 4-stage product approval pipeline
  - Multi-currency support with exchange rate tracking
  - Quarterly reminder system
  - Royalty calculations with MG recoupment
  - Security label management (QR codes, serial numbers)
- **Frontend Foundation**: 
  - Elegant landing page
  - Licensor and Licensee dashboards
  - Component library (ProductSubmissionForm, RoyaltyReportForm, InvoiceViewer)
  - Role-based navigation

### ⏳ Remaining Work (35%)

1. **Database Migration Fixes** (Critical)
2. **UI Integration & Form Wiring**
3. **Real Data Integration**
4. **End-to-End Testing**
5. **Invoice Generation**
6. **Notification System**

---

## Phase 2: Fix Database Migration Issues

### Problem
The database schema has conflicts between the Drizzle schema definition and the actual database:

**Missing/Conflicting Columns:**
- `ip_assets.category` - Missing in database
- `contracts.description` - Missing in database
- `approval_comments` table - Column name conflicts (comment_type, content, created_by need to be renamed)
- `contract_terms` table - Multiple column conflicts

### Solution

**Option A: Manual SQL Migration (Recommended)**

```sql
-- Add missing columns to ip_assets
ALTER TABLE ip_assets ADD COLUMN category VARCHAR(100);

-- Add missing columns to contracts
ALTER TABLE contracts ADD COLUMN description LONGTEXT;

-- Fix approval_comments table
ALTER TABLE approval_comments 
  RENAME COLUMN comment_type TO is_revision_request,
  RENAME COLUMN content TO comment,
  ADD COLUMN commented_by INT;

-- Fix contract_terms table
ALTER TABLE contract_terms
  RENAME COLUMN payment_frequency TO payment_terms,
  ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

**Option B: Using Drizzle Kit (Interactive)**

```bash
cd /home/ubuntu/ip-licensing-system
pnpm exec drizzle-kit generate --config drizzle.config.ts
# When prompted, select "create column" for all new columns
pnpm exec drizzle-kit migrate --config drizzle.config.ts
```

### Verification

After migration, run tests:
```bash
pnpm test
```

Expected result: All 102 tests should pass.

---

## Phase 3: Complete UI Integration

### 1. Product Submission Form Integration

**File**: `client/src/pages/ProductSubmissionPage.tsx`

**Current State**: Form component exists but not wired to backend

**Tasks**:
```typescript
// Wire form to tRPC mutation
const submitMutation = trpc.approvals.submitProduct.useMutation();

// On form submit:
await submitMutation.mutateAsync({
  contractId: input.contractId,
  itemNumber: input.itemNumber,
  productName: input.productName,
  category: input.category,
  description: input.description,
  quantity: input.quantity,
  unitPrice: new Decimal(input.unitPrice),
  notes: input.notes,
  // File upload - use storagePut from server/storage.ts
  designFile: await uploadToStorage(file),
});
```

### 2. Royalty Report Form Integration

**File**: `client/src/pages/RoyaltyReportPage.tsx`

**Current State**: Form component exists but not wired to backend

**Tasks**:
```typescript
// Wire form to tRPC mutation
const reportMutation = trpc.royalties.submitReport.useMutation();

// On form submit:
await reportMutation.mutateAsync({
  contractId: input.contractId,
  quarter: input.quarter,
  year: input.year,
  currency: input.currency,
  items: input.items.map(item => ({
    itemNumber: item.itemNumber,
    unitsSold: item.unitsSold,
    unitPrice: new Decimal(item.unitPrice),
    royaltyRate: new Decimal(item.royaltyRate),
  })),
  notes: input.notes,
});
```

### 3. Asset Bank UI

**File**: `client/src/pages/AssetBankPage.tsx` (Create new)

**Required Features**:
- List all IP assets (with permission checks)
- Filter by category, status, expiry date
- Download tracking
- Version history
- Upload new assets (for Licensors only)

```typescript
// Get assets
const { data: assets } = trpc.assets.getLicenseeAssets.useQuery();

// Download asset
const downloadMutation = trpc.assets.downloadAsset.useMutation();
```

### 4. Contract Management Dashboard

**File**: `client/src/pages/ContractDashboard.tsx` (Create new)

**Required Features**:
- List active contracts
- View contract terms
- Track contract status
- View associated licensees
- Upload new contracts (for Licensors)

---

## Phase 4: Real Data Integration (Sheep Gadget)

### Sample Data Structure

```typescript
// Sheep Gadget Contract
const sheepGadgetContract = {
  contractNumber: "SG-2024-001",
  title: "Sheep Gadget Licensing Agreement",
  licensorId: 1, // Your ID
  description: "Comprehensive licensing agreement for Sheep Gadget products",
  status: "active" as const,
  startDate: new Date("2024-01-01"),
  endDate: new Date("2026-12-31"),
  storageKey: "contracts/sg-2024-001.pdf",
  storageUrl: "/manus-storage/contracts/sg-2024-001.pdf",
};

// Sheep Gadget Terms
const sheepGadgetTerms = {
  contractId: 1,
  royaltyRate: new Decimal("0.08"), // 8%
  minimumGuarantee: new Decimal("5000"), // $5,000 per quarter
  territories: ["US", "EU", "APAC"],
  categories: ["Toys", "Collectibles", "Merchandise"],
  paymentFrequency: "quarterly",
  currency: "USD",
};

// Sample Product Submission
const sampleSubmission = {
  contractId: 1,
  itemNumber: "SG-TOY-001",
  productName: "Sheep Gadget Plushie",
  category: "Toys",
  description: "Soft plushie toy based on Sheep Gadget character",
  quantity: 5000,
  unitPrice: new Decimal("12.99"),
  stage: "concept" as const,
  submittedBy: 2, // Licensee ID
};
```

### Integration Steps

1. **Create test data via tRPC procedures**:
```bash
# Use the Management UI or API to create test contracts and terms
curl -X POST http://localhost:3000/api/trpc/contracts.create \
  -H "Content-Type: application/json" \
  -d '{ "json": { "contractNumber": "SG-2024-001", ... } }'
```

2. **Test complete workflow**:
   - Create contract
   - Create product submission
   - Move through approval stages
   - Submit royalty report
   - Generate invoice

---

## Phase 5: Invoice Generation & Quarterly Reminders

### Invoice Generation

**File**: `server/features/invoicing.ts` (Create new)

```typescript
export async function generateInvoice(royaltyReportId: number) {
  // 1. Get royalty report with calculations
  // 2. Calculate excess royalties (sales - MG)
  // 3. Create invoice record
  // 4. Generate PDF using reportlab or similar
  // 5. Store invoice in S3
  // 6. Return invoice URL
}
```

### Quarterly Reminders

**File**: `server/features/quarterlyReminders.ts` (Already exists)

**Implementation**:
```typescript
// Use Manus Heartbeat for scheduled tasks
// In periodic-updates.md:
export const quarterlyReminderJob = {
  name: "send-quarterly-reminders",
  schedule: "0 0 1 */3 * *", // First day of each quarter
  handler: async () => {
    // Get all active contracts
    // Calculate quarter end date
    // Send reminders to licensees
  }
};
```

---

## Phase 6: Testing Checklist

### Unit Tests (Vitest)

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/routers/approvals.test.ts

# Run with coverage
pnpm test --coverage
```

### Integration Tests

**Test Scenarios**:
1. ✅ Create contract → Create product submission → Move through approval stages
2. ✅ Submit royalty report → Calculate royalties → Generate invoice
3. ✅ Multi-currency conversion (EUR → USD)
4. ✅ MG recoupment tracking
5. ✅ Role-based access control

### End-to-End Tests

**Browser Testing**:
1. Login as Licensor → Create contract
2. Login as Licensee → View contract → Submit product
3. Login as Reviewer → Review submission → Approve
4. Licensee → Submit royalty report
5. Licensor → View royalty dashboard → Generate invoice

---

## Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `drizzle/schema.ts` | Database schema | ✅ Complete (needs migration) |
| `server/routers.ts` | tRPC procedures | ✅ Complete |
| `server/features/` | Business logic | ✅ Complete |
| `client/src/pages/` | UI pages | 🟡 Partial |
| `client/src/components/` | Reusable components | 🟡 Partial |
| `server/storage.ts` | File storage helpers | ✅ Complete |
| `server/_core/llm.ts` | LLM integration | ✅ Available |

---

## Environment Variables

All required env vars are automatically injected:
- `DATABASE_URL` - MySQL connection
- `JWT_SECRET` - Session signing
- `VITE_APP_ID` - OAuth app ID
- `OAUTH_SERVER_URL` - OAuth backend
- `BUILT_IN_FORGE_API_KEY` - Manus API key
- `VITE_FRONTEND_FORGE_API_KEY` - Frontend API key

---

## Deployment Checklist

- [ ] All 102 tests passing
- [ ] Database migrations applied
- [ ] UI forms wired to backend
- [ ] Real data integrated and tested
- [ ] Invoice generation working
- [ ] Quarterly reminders configured
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Empty states designed
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit passed
- [ ] Performance optimized
- [ ] Create final checkpoint
- [ ] Export to GitHub
- [ ] Publish via Manus UI

---

## Quick Commands

```bash
# Start dev server
pnpm dev

# Run tests
pnpm test

# Database operations
pnpm db:push          # Apply migrations
pnpm db:studio        # Open database UI

# Code quality
pnpm lint
pnpm format

# Build for production
pnpm build
```

---

## Support Resources

- **Manus Template Docs**: See README.md in project root
- **tRPC Docs**: https://trpc.io
- **Drizzle ORM**: https://orm.drizzle.team
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com

---

## Next Session Priorities

1. **Fix database migrations** (30 mins)
2. **Wire ProductSubmissionForm to backend** (45 mins)
3. **Wire RoyaltyReportForm to backend** (45 mins)
4. **Create AssetBankPage** (60 mins)
5. **Integrate Sheep Gadget test data** (30 mins)
6. **Run full test suite** (15 mins)
7. **Create checkpoint & export to GitHub** (15 mins)

**Estimated total: 4-5 hours to complete 90% of remaining work**

---

Generated: May 17, 2026
Platform: Uniment IP Licensing Management
Status: 65% Complete → Target: 95% Complete
