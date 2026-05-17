# IP Licensing Management System - Development Roadmap

## Phase 1: Core Infrastructure & Database Schema
- [x] Design and implement complete database schema with all entities
  - [x] Users table (with role-based access: admin, licensor, licensee, reviewer)
  - [x] IP Assets table (style guides, logos, artwork, templates)
  - [x] Asset Versions table (version control and download tracking)
  - [x] Asset Permissions table (licensee access control)
  - [x] Contracts table (deal memos, agreements, key terms)
  - [x] Contract Terms table (royalty rates, MG, territories, categories)
  - [x] Product Submissions table (concept designs, packaging, samples)
  - [x] Submission Approvals table (4-stage pipeline: Concept → Pre-Prod → Final → Market)
  - [x] Approval Comments table (review feedback and revision requests)
  - [x] Royalty Reports table (quarterly submissions)
  - [x] Royalty Calculations table (auto-calculated royalties, MG tracking)
  - [x] Security Labels table (QR codes, serial tracking, anti-counterfeit)
  - [x] Notifications table (audit log for reminders and alerts)
- [x] Set up database migrations and run initial schema push

## Phase 2: Authentication & Authorization
- [x] Implement role-based access control (RBAC) system
  - [x] Licensor Admin: Full platform control
  - [x] Licensee User: Scoped to own submissions and approved assets
  - [x] Reviewer Team: Limited to review and approval actions
- [x] Create protected procedures for role-based endpoint security
- [ ] Build user management interface for admins to assign roles and permissions
- [x] Implement permission checks on all sensitive operations

## Phase 3: IP Art Bank Management
- [x] Build file upload system with folder structure support
- [x] Implement version control for all assets
- [x] Create download tracking and audit logs
- [x] Build asset expiry control system
- [x] Implement permission-based asset access for licensees
- [ ] Create asset management UI for licensors
- [ ] Build licensee asset browser with filtered access

## Phase 4: Contract Management System
- [x] Create contract upload interface for licensors
- [x] Build contract template system for draft generation
- [x] Implement key terms extraction (royalty rates, MG, territories, categories)
- [x] Create contract versioning and signed agreement tracking
- [x] Build contract activation workflow
- [ ] Auto-create licensee accounts upon contract activation
- [ ] Create contract management dashboard for licensors

## Phase 5: Product Approval Workflow
- [x] Implement 4-stage approval pipeline (Concept → Pre-Prod → Final → Market)
- [ ] Build submission form for licensees (concept designs, packaging, marketing materials, samples)
- [x] Create review interface for licensor/reviewer team
- [x] Implement comment system for feedback and revision requests
- [x] Build approval tracking and history
- [ ] Create notification system for submission status changes
- [x] Implement revision request workflow with resubmission capability

## Phase 6: Royalty Report Management
- [ ] Build quarterly royalty report submission form for licensees
- [x] Implement auto-calculation of royalties based on contract terms
- [x] Create MG (Minimum Guarantee) recoupment tracking
- [x] Build excess royalty invoice generation system
- [x] Implement royalty report validation and review workflow
- [ ] Create royalty dashboard with performance analytics
- [x] Build historical royalty tracking and reporting

## Phase 7: Security Label Management
- [x] Implement security label generation system (QR codes, serial numbers)
- [x] Build label assignment to products workflow
- [x] Create label tracking against royalty reports
- [x] Implement QR code verification system for anti-counterfeit
- [x] Build label inventory management
- [x] Create label usage analytics and reporting

## Phase 8: Reporting & Analytics Dashboard
- [ ] Build royalty income analytics and charts
- [ ] Create territory performance reports
- [ ] Implement top categories and product performance tracking
- [ ] Build overdue submissions tracking
- [ ] Create compliance analysis reports
- [ ] Implement custom report generation
- [ ] Build data export functionality (CSV, PDF)

## Phase 9: Notification & Approval Engine
- [ ] Implement automated reminders for pending approvals
- [ ] Build royalty submission deadline notifications
- [ ] Create contract expiry alerts
- [ ] Implement revision request notifications
- [ ] Build notification preferences system
- [ ] Create notification history and audit logs
- [ ] Implement email notification delivery

## Phase 10: UI/UX & Visual Design
- [ ] Design elegant, refined visual system
  - [ ] Define color palette (sophisticated, professional)
  - [ ] Choose premium typography
  - [ ] Create spacing and layout system
  - [ ] Design component library with refined aesthetics
- [ ] Build responsive layouts for all screen sizes
- [ ] Implement smooth animations and micro-interactions
- [ ] Create consistent design language across all pages
- [ ] Build loading states and empty states
- [ ] Implement error handling UI
- [ ] Create onboarding experience

## Phase 11: Dashboard & Navigation
- [ ] Build main dashboard for each user role
  - [ ] Licensor dashboard: Overview of all contracts, submissions, royalties
  - [ ] Licensee dashboard: My assets, submissions, royalty reports
  - [ ] Reviewer dashboard: Pending approvals, submissions to review
- [ ] Create main navigation structure
- [ ] Implement sidebar navigation for role-specific features
- [ ] Build breadcrumb navigation
- [ ] Create search and filter functionality

## Phase 12: Integration & Testing
- [x] Write comprehensive vitest tests for all procedures
- [x] Test role-based access control enforcement
- [x] Test royalty calculation accuracy (via calculateRoyalties procedure)
- [x] Test approval workflow state transitions (via approvals router)
- [ ] Test file upload and storage integration
- [ ] Test notification delivery
- [ ] Conduct end-to-end testing of all workflows

## Phase 13: Deployment & Polish
- [ ] Perform final UI polish and refinement
- [ ] Optimize performance and loading times
- [ ] Implement caching strategies
- [ ] Create user documentation
- [ ] Set up monitoring and error tracking
- [ ] Create checkpoint and prepare for deployment


## Phase 14: Multi-Currency Support (NEW)
- [ ] Add currency field to royalty reports table
- [ ] Integrate with exchange rate API (get last day of quarter rates)
- [ ] Auto-convert local currency to USD
- [ ] Store historical exchange rates for audit trail
- [ ] Display converted amounts in reports
- [ ] Create currency conversion UI in report submission form
- [ ] Test with multiple currencies (EUR, GBP, JPY, etc.)

## Phase 15: Quarterly Reporting Schedule & Automated Reminders (NEW)
- [ ] Define quarterly periods (Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec)
- [ ] Calculate submission deadlines (30 days after quarter end)
- [ ] Create scheduled task for reminder notifications
- [ ] Send reminder email on submission deadline date
- [ ] Track which licensees have submitted for each quarter
- [ ] Send follow-up reminders for overdue reports (weekly)
- [ ] Create overdue report dashboard for licensors
- [ ] Implement cron job for automated reminder scheduling


## Phase 16: Integration with Real Documents & Data (WAITING FOR USER INPUT)
- [ ] Receive and review style guide/brand guidelines
- [ ] Receive and review standard license agreement template
- [ ] Receive and review royalty report template
- [ ] Receive 1-2 sample licensee contracts with real terms
- [ ] Receive sample royalty reports (if available)
- [ ] Extract key terms from real license agreements
- [ ] Design royalty report form based on actual template
- [ ] Configure quarterly reminder schedule for actual deadlines
- [ ] Set up multi-currency conversion with real exchange rates
- [ ] Test with real licensee data
- [ ] Validate calculations against real contracts
- [ ] Optimize UI based on actual document structure


## Phase 15: Enhanced Royalty Management (Three-Model Calculations)
- [ ] Update contract terms table to store three royalty rate models
  - [ ] Retail price royalty rate
  - [ ] Wholesale price royalty rate
  - [ ] Manufacturing cost royalty rate (for Gift with Purchase, Purchase with Purchase)
- [ ] Build royalty report form with three pricing models
  - [ ] Line item entry with SKU, product name, pricing model selector
  - [ ] Dynamic unit price and quantity fields based on model
  - [ ] Auto-calculated gross turnover per line
  - [ ] Auto-calculated royalty due per line
  - [ ] Channel totals (retail vs wholesale vs manufacturing)
- [ ] Implement multi-currency conversion
  - [ ] Integrate with exchange rate API (Wall Street Journal, Yahoo Finance)
  - [ ] Use end-of-quarter exchange rates
  - [ ] Display exchange rate used in report
  - [ ] Auto-convert total royalty to USD
- [ ] Implement quarterly reminder system
  - [ ] Q1 (Jan 1-31 Mar): Deadline Apr 25-30
  - [ ] Q2 (Apr 1-30 Jun): Deadline Jul 25-30
  - [ ] Q3 (Jul 1-30 Sep): Deadline Oct 25-30
  - [ ] Q4 (Oct 1-31 Dec): Deadline Jan 25-30
  - [ ] Automated reminders on deadline date
  - [ ] Overdue tracking and escalation
- [ ] Implement invoice generation
  - [ ] MG payment invoices
  - [ ] Excess royalty invoices (after MG recoupment)
  - [ ] Payment tracking and history
- [ ] Test with Charmy Chan contract (Chaelect - South Korea)
- [ ] Test with Monchhichi contracts (when provided)

## Phase 16: Integration with Real Documents & Data (WAITING FOR USER INPUT)
- [ ] Receive Monchhichi License Agreement
- [ ] Receive Monchhichi Royalty Report sample
- [ ] Receive MG Invoice example
- [ ] Receive Excess Royalty Invoice example
- [ ] Extract key terms from Monchhichi agreements
- [ ] Test calculations with Monchhichi data
- [ ] Validate invoice generation matches real format
- [ ] Test multi-currency conversion with real exchange rates
