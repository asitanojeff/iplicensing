# Charmy Chan Royalty Report Template Analysis

## Report Overview
- **Property**: Charmy Chan
- **Licensee**: TAKE TOYS CO., LTD. (Example - Thailand)
- **Territory**: Thailand
- **Report Period**: 01/01/26 to 31/03/26 (Q1 2026)
- **Currency**: Thai Baht (THB)
- **Submission Deadline**: Within 30 days after quarter end

## Report Structure

The template has two main sales channels with separate royalty calculations:

### Channel 1: Wholesale Sales (in THB)
- **Unit Price (Wholesale)**: Price per unit in wholesale
- **Units Sold**: Quantity sold at wholesale
- **Gross Turnover**: Unit Price × Units Sold
- **Royalty Rate**: 10% (for wholesale channel)
- **Royalty Due**: Gross Turnover × Royalty Rate

### Channel 2: Direct Retail Sales (in THB)
- **Unit Price (Retail)**: Price per unit in retail
- **Units Sold**: Quantity sold at retail
- **Gross Turnover**: Unit Price × Units Sold
- **Royalty Rate**: 5% (for retail channel)
- **Royalty Due**: Gross Turnover × Royalty Rate

## Key Fields in Template

| Field | Description | Notes |
|-------|-------------|-------|
| Reference Number / SKU Number | Product identifier | Format: CC-Licensee code-item code |
| Licensed Product Name and Description | Full product name | E.g., "Monchhichi Love Pajamas set" |
| Unit Price (Wholesale) | Wholesale price per unit | In local currency (THB) |
| Units Sold (Wholesale) | Quantity sold at wholesale | Numeric value |
| Gross Turnover (Wholesale) | Wholesale sales total | Calculated: Unit Price × Units Sold |
| Unit Price (Retail) | Retail price per unit | In local currency (THB) |
| Units Sold (Retail) | Quantity sold at retail | Numeric value |
| Gross Turnover (Retail) | Retail sales total | Calculated: Unit Price × Units Sold |

## Calculation Methodology

### Per Product Line
1. **Wholesale Gross Turnover**: Unit Price (Wholesale) × Units Sold (Wholesale)
2. **Retail Gross Turnover**: Unit Price (Retail) × Units Sold (Retail)

### Channel Totals
1. **Total Gross Turnover (Wholesale)**: Sum of all wholesale gross turnovers
2. **Total Gross Turnover (Retail)**: Sum of all retail gross turnovers

### Royalty Calculation
1. **Wholesale Royalty**: Total Gross Turnover (Wholesale) × 10%
2. **Retail Royalty**: Total Gross Turnover (Retail) × 5%
3. **Total Royalty Due**: Wholesale Royalty + Retail Royalty

## Example from Template

**Product**: Monchhichi Love Pajamas set

**Wholesale Channel**:
- Unit Price: THB 18.96
- Units Sold: 15
- Gross Turnover: THB 284.43
- Royalty Rate: 10%
- Royalty Due: THB 28.44

**Retail Channel**:
- Unit Price: THB 34.48
- Units Sold: 1
- Gross Turnover: THB 34.48
- Royalty Rate: 5%
- Royalty Due: THB 1.72

**Total Royalty**: THB 30.16

## Multi-Currency Conversion

### Current Template
- **Local Currency**: Thai Baht (THB)
- **Conversion Required**: THB to USD
- **Exchange Rate Field**: "Exchange Rate, THB to USD" (to be filled by licensee)
- **Conversion Timing**: End of reporting period (quarterly)

### Conversion Process
1. Licensee reports all sales in local currency (THB)
2. Licensee provides exchange rate used (THB to USD)
3. System converts total royalty due to USD
4. Payment made in USD

### Example Conversion
- Total Royalty Due: THB 30.16
- Exchange Rate (end of Q1): 1 THB = 0.0278 USD (example)
- Royalty Due in USD: THB 30.16 × 0.0278 = USD 0.84

## Reporting Frequency and Deadlines

### Quarterly Schedule
- **Q1**: January 1 - March 31 (Report due by April 30)
- **Q2**: April 1 - June 30 (Report due by July 30)
- **Q3**: July 1 - September 30 (Report due by October 30)
- **Q4**: October 1 - December 31 (Report due by January 30)

### Submission Instructions
- Send to: El Brand Group Ltd. / mgt@elbrandgroup.com
- Format: Excel spreadsheet (as per template)
- Deadline: Within 30 days after quarter end (or 25 days per License Agreement)

## Key Differences from Chaelect Contract

### Chaelect Contract (South Korea)
- **Royalty Rates**: 6% (Retail), 12% (Wholesale), 14% (Premium)
- **Minimum Guarantee**: USD 15,000 (CY1), USD 20,000 (CY2)
- **Reporting Deadline**: 25 days after quarter end
- **Currency**: Korean Won (KRW) → USD conversion

### Template Example (Thailand)
- **Royalty Rates**: 5% (Retail), 10% (Wholesale)
- **No MG mentioned**: (May vary by licensee)
- **Reporting Deadline**: 30 days after quarter end
- **Currency**: Thai Baht (THB) → USD conversion

## Platform Implementation Requirements

### Royalty Report Form Fields
1. Property name (pre-filled)
2. Licensee name (pre-filled)
3. Territory (pre-filled)
4. Report period (quarter selector)
5. Currency (pre-filled from contract)
6. Line items for each product:
   - SKU/Reference number
   - Product name
   - Wholesale unit price
   - Wholesale units sold
   - Retail unit price
   - Retail units sold
7. Exchange rate (user input)
8. Remarks/Notes (optional)

### Automatic Calculations
1. Gross turnover per product (wholesale and retail)
2. Total gross turnover per channel
3. Royalty due per channel (based on contract rates)
4. Total royalty due in local currency
5. Total royalty due in USD (after exchange rate conversion)
6. MG recoupment tracking
7. Excess royalty calculation

### Validation Rules
1. All numeric fields must be positive
2. Exchange rate must be provided
3. At least one product line must be entered
4. Report period must match contract terms
5. Submission must be within deadline (25-30 days)

### Data Storage
1. Store original report in local currency
2. Store exchange rate used
3. Store converted amounts in USD
4. Store MG recoupment status
5. Store approval status
6. Store payment status

### Reporting and Analytics
1. Quarterly royalty summary by licensee
2. Cumulative royalty tracking against MG
3. Excess royalty due calculation
4. Territory performance comparison
5. Product category performance
6. Sales channel analysis (wholesale vs retail)
7. Currency impact analysis

## Notes for Platform Development

1. **Template Flexibility**: Different licensees may have different royalty rates and structures - use contract terms to drive calculations
2. **Exchange Rate Accuracy**: Use end-of-quarter exchange rates (consider integrating with real exchange rate API)
3. **MG Tracking**: Implement cumulative tracking to determine when MG is fully recouped
4. **Approval Workflow**: Implement review and approval process before payment
5. **Audit Trail**: Maintain complete history of all submissions and changes
6. **Notification**: Send reminders before deadline (e.g., 7 days before)
7. **Invoice Generation**: Auto-generate invoices for excess royalties after MG recoupment
