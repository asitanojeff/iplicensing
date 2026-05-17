# Invoice Format Analysis - MG Invoice Example

## Invoice Header
- **Issuer**: EL BRAND GROUP LIMITED
- **Document Type**: INVOICE
- **Page**: 1/1

## Invoice Details
- **Invoice Date**: 3 Jan 2025
- **Invoice Number**: IN202502
- **Payment Term**: Due on 10 Jan 2025
- **Reference**: MCC license agreement #0408

## Client Information
- **Client**: Sheep Gadget Co., Ltd
- **Contact**: Mr. Apinun Treratijarn
- **Phone**: +66 0210199999
- **Email**: apinun@applesheep.com
- **Address**: 38/8-9, Ladprao Road, Chomphon Subdistrict, Chatuchak District, Thailand 10900

## Invoice Line Items

| Item | Project | Amount (USD) |
|------|---------|--------------|
| 1 | According to the payment schedule in Monchhichi license agreement #0408: CY1: 1 Dec 2024 to 31 Mar 2026 CY1 Minimum Guarantee | USD 12,000 |

**TOTAL**: USD 12,000

## Remarks
"According to the Monchhichi license agreement, EL Brand Group Ltd. is responsible for collection of royalty fee incl. minimum guarantee on behalf of licensor - Sekiguchi Co., Ltd."

## Remittance Instructions

### Beneficiary Information
- **Beneficiary Name**: EL BRAND GROUP LIMITED
- **Beneficiary Address**: Unit 717, Peninsula Centre, 67 Mody Road, Tsim Sha Tsui, Kowloon, Hong Kong

### Bank Details
- **Bank Name**: DBS Bank (Hong Kong) Limited
- **DBS SWIFT Bank Identifier Code (BIC)**: DHBKHKHH
- **Bank Address**: 11/F, The Center, 99 Queen's Road Central, Central, Hong Kong
- **Beneficiary Account Number**: 001433824

## Correspondence Address
- **Office**: Rm 717 Peninsula Centre, Tsim Sha Tsui Kowloon Hong Kong
- **Office**: A1-01, 3/F, Block A, Yee Lim Industrial Centre, 2-28 Kwai Lok Street, Kwai Chung, N.T., Hong Kong
- **Tel**: 852-60678617
- **Email**: mgt@elbrandgroup.com

## Invoice Structure for Platform Implementation

### Header Section
- Issuer name and logo
- Invoice title
- Page indicator

### Invoice Metadata
- Invoice date
- Invoice number (format: IN[YYMMDD])
- Payment term (due date)
- Reference (license agreement number)

### Client Section
- Client name
- Contact person
- Phone and email
- Full address

### Line Items Section
- Item number
- Project/Description
- Amount in USD

### Total Section
- Total amount in USD

### Remarks Section
- Explanation of invoice purpose
- Reference to license agreement

### Remittance Instructions
- Beneficiary name and address
- Bank name and address
- SWIFT code
- Account number

### Footer
- Correspondence addresses
- Contact information

## Key Fields for Platform

### Required for Invoice Generation
1. Invoice date (auto-generated)
2. Invoice number (auto-generated with format IN[YYMMDD])
3. Payment term/due date (calculated from invoice date)
4. Client name, contact, phone, email, address
5. License agreement reference number
6. Invoice line items with descriptions and amounts
7. Total amount
8. Remarks
9. Remittance instructions (can be stored as template)

### Invoice Types to Support
1. **MG Invoice** - For Minimum Guarantee payments
2. **Excess Royalty Invoice** - For royalties owed after MG recoupment
3. **Quarterly Royalty Invoice** - For regular royalty payments

### Dynamic Content
- Invoice number generation
- Payment term calculation
- Line item descriptions (based on contract terms and reporting period)
- Total calculation
- Client information (from contract)

### Static Content (Template)
- Issuer name and address
- Bank details
- Correspondence addresses
- Remarks template
