# Excess Royalty Invoice Analysis - Sheep Gadget Q4 2025

## Invoice Overview
- **Issuer**: EL BRAND GROUP LIMITED
- **Invoice Number**: IN202631
- **Invoice Date**: 2 Mar 2026
- **Due Date**: 9 Mar 2026
- **Reference**: MCC license agreement #0408

## Client Information
- **Client**: Sheep Gadget Co.Ltd
- **Contact**: Dream Wanitcha
- **Phone**: +66 945576290
- **Email**: wanitcha.applesheep@gmail.com
- **Billing Address**: Sheep Gadget Co.Ltd 14/3686-8, Ladprao Rd., Chomphon, Chatuchak, BKK 10900 Thailand

## Invoice Line Items

| Item | Project | Amount (USD) |
|------|---------|--------------|
| 1 | According to the payment schedule in Monchhichi license agreement #0408 Contract period: 1 Dec 2024 to 31 Mar 2026 Excess Royalty after Q4 2025 period 1 Oct 2025 to 31 Dec 2025 | USD 129,768.00 |

**TOTAL INVOICE AMOUNT**: USD 129,768.00

## Key Observations

### Invoice Amount Breakdown
- **Q4 2025 Total Royalty Due**: USD 129,768.00
- **Minimum Guarantee (MG)**: USD 12,000 (already paid in MG invoice)
- **Excess Royalty**: USD 129,768.00 (this invoice covers the full amount)

**Important Note**: The invoice shows USD 129,768.00, which is the TOTAL royalty due for Q4 2025. This means:
- The MG (USD 12,000) was paid separately via the MG Invoice (IN202502)
- This excess royalty invoice (IN202631) is for the total royalty amount
- The licensee pays the full USD 129,768.00, which includes the MG recoupment

### Timeline
- **MG Invoice Date**: 3 Jan 2025 (for USD 12,000 MG)
- **Q4 Report Period**: 1 Oct 2025 - 31 Dec 2025
- **Excess Royalty Invoice Date**: 2 Mar 2026 (after report submission)
- **Due Date**: 9 Mar 2026 (7 days from invoice date)

### Remarks
"According to Monchhichi license agreement, EL Brand Group Ltd. is responsible for collection of royalty fee incl. minimum guarantee on behalf of licensor - Sekiguchi Co., Ltd.

For the delivery of security label, normally, this will take 5 working days after received the above payment. Please pay it in a net amount (all bank charges should be bear by the licensee)"

## Remittance Instructions (Same as MG Invoice)

### Beneficiary Information
- **Beneficiary Name**: EL BRAND GROUP LIMITED
- **Beneficiary Address**: Unit 717, Peninsula Centre, 67 Mody Road, Tsim Sha Tsui, Kowloon, Hong Kong

### Bank Details
- **Bank Name**: DBS Bank (Hong Kong) Limited
- **DBS SWIFT Bank Identifier Code (BIC)**: DHBKHKHH
- **Bank Address**: 11/F, The Center, 99 Queen's Road Central, Central, Hong Kong
- **Beneficiary Account Number**: 001433824

## Invoice Generation Logic for Platform

### When to Generate Invoices

1. **MG Invoice** (at contract signing or first reporting period):
   - Amount: Minimum Guarantee amount
   - Description: "CY1 Minimum Guarantee"
   - Due Date: As per contract payment schedule

2. **Excess Royalty Invoice** (after royalty report submission):
   - Amount: Total Royalty Due (from report)
   - Description: "Excess Royalty after [Quarter] [Year] period [Start Date] to [End Date]"
   - Due Date: Typically 7-10 days from invoice date

### MG Recoupment Handling

**Important Discovery**: The invoice shows the TOTAL royalty amount (USD 129,768.00), not just the excess after MG recoupment.

This suggests two possible scenarios:

**Scenario A: MG Already Paid**
- MG Invoice (IN202502): USD 12,000 paid on 3 Jan 2025
- Excess Royalty Invoice (IN202631): USD 129,768.00 for Q4 royalty
- Licensee pays: USD 12,000 + USD 129,768.00 = USD 141,768.00 total

**Scenario B: MG Recoupment in Royalty**
- MG Invoice (IN202502): USD 12,000 paid on 3 Jan 2025
- Excess Royalty Invoice (IN202631): USD 129,768.00 includes MG recoupment
- Licensee pays: USD 129,768.00 (MG already recouped)

The invoice language suggests Scenario B is correct - the excess royalty invoice is for the total royalty amount, with MG already accounted for.

### Platform Implementation

The system should:

1. **Track MG Status**:
   - Record MG amount and payment date
   - Mark MG as "Paid" when MG invoice is issued
   - Track MG recoupment against quarterly royalties

2. **Calculate Excess Royalty**:
   - Total Royalty = Sum of all channel royalties
   - If Total Royalty > MG: Generate excess royalty invoice for Total Royalty
   - If Total Royalty ≤ MG: No excess royalty invoice needed

3. **Generate Invoices**:
   - Auto-generate invoice number with format IN[YYMMDD]
   - Auto-calculate due date (typically 7 days from invoice date)
   - Include contract reference and period details
   - Use template for remittance instructions

4. **Track Payment Status**:
   - Record invoice date and due date
   - Track payment received
   - Flag overdue invoices
   - Update MG recoupment status

## Multi-Currency Considerations

This example is in USD. For licensees reporting in local currency:

1. **Royalty Report**: Submitted in local currency (e.g., THB)
2. **Currency Conversion**: Convert to USD using end-of-quarter exchange rate
3. **Invoice**: Issued in USD to Hong Kong bank account
4. **Payment**: Licensee pays in USD or local currency equivalent

The system should:
- Accept royalty reports in any currency
- Use end-of-quarter exchange rates for conversion
- Display both local and USD amounts in invoices
- Track exchange rates used for audit purposes
