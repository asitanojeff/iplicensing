# Security Label Order Request Form Analysis

## Form Overview
- **Program**: Monchhichi Licensing Program
- **Recipient**: Monchhichi Licensing Agent – El Brand Group Ltd.
- **Contact**: Ms. Carmen Chiu (mgt@elbrandgroup.com)

## Company Information Section

### Licensee Details
- **Licensee Name**: Sheep Gadget Co., Ltd
- **Contact Person**: Dream Wanitcha
- **Email**: wanitcha.applesheep@gmail.com
- **Phone Number**: +66946576290

### Address Information
- **Billing Address**: Sheep Gadget Co., Ltd 438/8-9, Ladprao Rd., Chomphon, Chatuchak, BKK 10900 Thailand
- **Shipping Address**: Sheep Gadget Co., Ltd 438/8-9, Ladprao Rd., Chomphon, Chatuchak, BKK 10900 Thailand

## Order Details Section

### Label Order Information
- **Label Order Quantity**: 29,000 pcs
- **Requested Arrival Date**: 1 Oct 2025
- **Contact Person for Delivery**: Dream Wanitcha, Tel. +66946576290

## Pricing and Logistics

### Label Pricing
- **Cost per Label**: USD 0.01 per pc (Note: Contract stated USD 0.012, but this form shows USD 0.01)
- **Minimum Order Quantity (MOQ)**: 2,000 pcs
- **Label Sheet Format**: 100 pcs per sheet

### Shipping and Delivery
- **Courier Fee**: Excluded from label cost (licensee pays separately)
- **Lead Time**: 5-7 working days after payment received
- **Shipping Address**: Same as billing address

## Order Calculation Example (Sheep Gadget)
- **Order Quantity**: 29,000 pcs
- **Cost per Label**: USD 0.01
- **Total Label Cost**: 29,000 × USD 0.01 = USD 290.00
- **Sheets Needed**: 29,000 ÷ 100 = 290 sheets
- **Plus**: Courier fee (separate invoice)

## Platform Implementation Requirements

### Label Order Form Fields

**Company Information** (auto-populated from licensee account):
- Licensee name
- Contact person
- Email
- Phone number
- Billing address
- Shipping address

**Order Details** (user input):
- Label order quantity (must be ≥ MOQ of 2,000 pcs)
- Requested arrival date
- Shipping address (can override default)
- Special instructions/remarks

**Auto-Calculated Fields**:
- Total label cost (qty × USD 0.01 per label)
- Number of sheets (qty ÷ 100)
- Lead time (5-7 working days from payment)
- Courier fee (separate line item)

### Access Control for Label Orders

**Licensee can order labels when**:
1. Account is created (MG paid)
2. Product is at "Pre-Production" approval stage or beyond
3. Product has estimated production quantity specified
4. Contract allows labels for this product (not exempt)

**Order Workflow**:
1. Licensee submits label order request
2. System generates order form with details
3. Licensor/Admin reviews and approves order
4. Invoice is generated (label cost + courier fee)
5. Licensee pays invoice
6. Labels are manufactured and shipped
7. Licensee receives labels and sticks them on products

### Label Inventory Tracking

**System should track**:
- Order date
- Requested arrival date
- Actual arrival date
- Quantity ordered
- Quantity received
- Quantity used (linked to products)
- Remaining inventory
- Expiry date (if applicable)

### Invoice Generation for Label Orders

**Label Order Invoice** should include:
- Label quantity ordered
- Cost per label (USD 0.01)
- Total label cost
- Courier fee (separate line)
- Total invoice amount
- Payment terms
- Delivery timeline

### Contract Term Variations

**Important**: Different contracts may have different label costs:
- **Charmy Chan**: USD 0.012 per label (from contract)
- **Sheep Gadget**: USD 0.01 per label (from order form)
- **Monchhichi/Feelfin**: Need to verify from contract

**System must**:
- Store label cost per unit in contract terms
- Use contract-specific cost when calculating label order invoices
- Support different MOQs and sheet formats per contract

### Multi-Currency Considerations

**Label Pricing**:
- Labels are always priced in USD
- Licensee in Thailand pays in USD or Thai Baht equivalent
- Exchange rate used: End-of-quarter rate (same as royalty reports)

**Payment**:
- Label invoice issued in USD
- Licensee can pay in USD or local currency
- Payment made to same Hong Kong bank account (El Brand Group Ltd.)

## Key Business Rules

1. **MOQ Enforcement**: Minimum order is 2,000 pcs (system should validate)
2. **Lead Time**: 5-7 working days after payment (not from order date)
3. **Courier Fee**: Separate from label cost (licensee bears this cost)
4. **Sheet Format**: 100 pcs per sheet (for planning purposes)
5. **Contract-Based**: Label requirement and cost depends on individual contract terms
6. **Exempt Products**: Some contracts may exempt certain product categories from label requirement
7. **Timing**: Labels can only be ordered after Pre-Production approval, before Market Release

## Platform Features Needed

1. **Label Order Form** (web form for licensees)
2. **Order Management Dashboard** (for admins to track orders)
3. **Invoice Generation** (for label costs)
4. **Inventory Tracking** (for label stock management)
5. **Label Linking** (link labels to products and royalty reports)
6. **Compliance Verification** (ensure all market-released products have labels)
