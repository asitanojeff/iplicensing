# Label Order Invoice Analysis - Sheep Gadget 29,000 pcs Order

## Invoice Overview
- **Issuer**: EL BRAND GROUP LIMITED
- **Document Type**: INVOICE
- **Invoice Number**: IN202539
- **Invoice Date**: 26 Sep 2025
- **Due Date**: 01 Oct 2025
- **Reference**: MCC Sec Label

## Client Information
- **Client**: Sheep Gadget Co.Ltd
- **Contact**: Dream Wanitcha
- **Phone**: +66946576290
- **Email**: wanitcha.applesheep@gmail.com
- **Billing Address**: Sheep Gadget Co.Ltd 438/8-9,Ladprao Rd.,Chomphon, Chatuchak, BKK 10900 Thailand

## Shipping Address
- **Shipping Address**: Sheep Gadget Co.Ltd 438/8-9,Ladprao Rd.,Chomphon, Chatuchak, BKK 10900 Thailand

## Invoice Line Items

| Item | Project | Amount (USD) |
|------|---------|--------------|
| 1 | Monchhichi Security Label 29000pcs @0.01 / pc | USD 290.00 |
| 2 | Courier fee | USD 60.00 |
| | Serial No (SN): To be adjusted later. | |

**TOTAL INVOICE AMOUNT**: USD 350.00

## Breakdown

### Label Cost
- **Quantity**: 29,000 pcs
- **Unit Price**: USD 0.01 per pc
- **Total Label Cost**: 29,000 × USD 0.01 = USD 290.00

### Shipping Cost
- **Courier Fee**: USD 60.00
- **Note**: "To be adjusted later" - may be updated based on actual shipping cost

### Total Invoice
- **Labels**: USD 290.00
- **Courier**: USD 60.00
- **TOTAL**: USD 350.00

## Key Information

### Serial Number
- **Serial No (SN)**: To be adjusted later
- This suggests the SN will be assigned after payment or during production

### Delivery Timeline
- **Invoice Date**: 26 Sep 2025
- **Due Date**: 01 Oct 2025 (5 days)
- **Lead Time**: 5-7 working days after payment received
- **Expected Delivery**: Around 5-15 Oct 2025

### Remarks
"According to Monchhichi license agreement, EL Brand Group Ltd. is responsible for collection of royalty fee incl. minimum guarantee on behalf of licensor - Sekiguchi Co., Ltd.

For the delivery of security label, normally, this will take 5 working days after received the above payment. Please pay it in a net amount (all bank charges should be bear by the licensee)"

## Remittance Instructions

### Beneficiary Information
- **Beneficiary Name**: EL BRAND GROUP LIMITED
- **Beneficiary Address**: Unit 717, Peninsula Centre, 67 Mody Road, Tsim Sha Tsui, Kowloon, Hong Kong

### Bank Details
- **Bank Name**: DBS Bank (Hong Kong) Limited
- **DBS SWIFT Bank Identifier Code (BIC)**: DHBKHKHH
- **Bank Address**: 11/F, The Center, 99 Queen's Road Central, Central, Hong Kong
- **Beneficiary Account Number**: 001433824

## Platform Implementation - Label Order Invoice Generation

### Invoice Structure
The label order invoice follows the same template as MG and royalty invoices with:
- Standard header with issuer information
- Client details and addresses
- Line items for labels and courier fee
- Total amount
- Remarks and payment instructions
- Bank details

### Line Item Calculation
1. **Label Line Item**:
   - Description: "Monchhichi Security Label [QTY]pcs @[RATE] / pc"
   - Amount: Quantity × Unit Price

2. **Courier Fee Line Item**:
   - Description: "Courier fee"
   - Amount: Estimated or actual courier cost
   - Note: "To be adjusted later" if estimate

### Dynamic Fields
- Invoice number (auto-generated: IN[YYMMDD])
- Invoice date (current date)
- Due date (typically 5 days from invoice date)
- Client information (from licensee account)
- Label quantity (from order request)
- Label unit price (from contract terms)
- Courier fee (estimated or actual)
- Serial number (to be assigned later)

### Serial Number Management
- **Initial Status**: "To be adjusted later"
- **After Production**: Serial numbers are assigned to label sheets
- **Tracking**: Link serial numbers to specific products and royalty reports
- **Verification**: Use serial numbers for anti-counterfeit verification

### Payment Tracking
- Invoice issued: 26 Sep 2025
- Due date: 01 Oct 2025
- Payment received: [To be tracked]
- Labels shipped: 5-7 working days after payment
- Expected delivery: [To be tracked]

## Key Business Rules for Label Order Invoices

1. **Timing**: Invoice issued when label order is approved
2. **Quantity**: Must meet MOQ of 2,000 pcs
3. **Unit Price**: Contract-specific (USD 0.01 for Sheep Gadget, USD 0.012 for Charmy Chan)
4. **Courier Fee**: Separate line item, may be adjusted after shipment
5. **Serial Numbers**: Assigned after production, tracked in system
6. **Lead Time**: 5-7 working days after payment received
7. **Payment Terms**: Net amount, licensee pays all bank charges

## Multi-Currency Considerations

**Label Orders**:
- Always priced in USD
- Licensee in Thailand pays in USD or Thai Baht equivalent
- Exchange rate: End-of-quarter rate (if paying in local currency)
- Payment to Hong Kong bank account in USD

## Comparison with Other Invoice Types

| Invoice Type | Amount | Timing | Trigger |
|--------------|--------|--------|---------|
| MG Invoice | Contract-specific (e.g., USD 12,000) | Upon contract signing | Contract execution |
| Label Order Invoice | Qty × Unit Price + Courier | Upon order approval | Label order request |
| Excess Royalty Invoice | Total Royalty Due | After report submission | Quarterly royalty report |

## Platform Features Needed

1. **Label Order Invoice Generation**
   - Auto-generate invoice number
   - Calculate label cost (qty × unit price)
   - Add courier fee
   - Generate PDF invoice

2. **Serial Number Management**
   - Assign serial numbers after production
   - Track serial numbers in system
   - Link to products and royalty reports
   - Support anti-counterfeit verification

3. **Payment Tracking**
   - Track invoice payment status
   - Record payment date
   - Trigger label production after payment
   - Track shipment and delivery

4. **Inventory Management**
   - Track label stock received
   - Track label usage per product
   - Track remaining inventory
   - Alert when stock is low
