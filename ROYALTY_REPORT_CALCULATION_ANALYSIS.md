# Royalty Report Calculation Analysis - Sheep Gadget Q4 2025

## Report Overview
- **Property**: Monchhichi
- **Report Period**: 01/10/25 to 31/12/25 (Q4 2025)
- **Licensee**: Sheep Gadget Co., Ltd
- **Territory**: Thailand

## Sales Channel Structure

The report contains TWO sales channels with DIFFERENT royalty rates:

### Channel 1: Direct Retail (Wholesale Sales)
- **Royalty Rate**: 6%
- **Total Gross Turnover**: USD 1,789,494.44
- **Royalty Due**: 1,789,494.44 × 6% = USD 107,369.67

### Channel 2: Wholesale (Retail Sales)
- **Royalty Rate**: 11%
- **Total Gross Turnover**: USD 203,621.23
- **Royalty Due**: 203,621.23 × 11% = USD 22,398.34

## Total Royalty Calculation

| Channel | Gross Turnover | Rate | Royalty Due |
|---------|----------------|------|-------------|
| Direct Retail | USD 1,789,494.44 | 6% | USD 107,369.67 |
| Wholesale | USD 203,621.23 | 11% | USD 22,398.34 |
| **TOTAL** | **USD 1,993,115.67** | - | **USD 129,768.00** |

## MG Recoupment Status

- **Minimum Guarantee**: USD 12,000 (due upon signing)
- **Q4 2025 Royalty Due**: USD 129,768.00
- **MG Recoupment**: USD 12,000 (fully recouped in this quarter)
- **Excess Royalty**: USD 129,768.00 - USD 12,000 = USD 117,768.00

## Key Observations

1. **Two-Channel Model**: The report shows both wholesale and retail channels with different royalty rates, matching the contract terms (6% retail, 11% wholesale)

2. **Currency**: All amounts are in USD (no currency conversion needed for this report - likely already converted from Thai Baht)

3. **Line Items**: 200+ product SKUs with individual unit prices, units sold, and gross turnover calculations

4. **Calculation Flow**:
   - Per-product: Unit Price × Units Sold = Gross Turnover
   - Per-channel: Sum of all product gross turnovers
   - Royalty: Gross Turnover × Rate
   - Total: Sum of all channel royalties

5. **MG Handling**: The MG (USD 12,000) is recouped from the first royalty payment, with excess royalties due after recoupment

## Invoice Generation Requirements

Based on this report, the system needs to generate:

1. **Excess Royalty Invoice** (since MG is fully recouped):
   - Invoice Amount: USD 117,768.00 (Royalty Due - MG)
   - Description: "Q4 2025 Royalty Payment (Oct 1 - Dec 31, 2025) - Excess Royalty after MG recoupment"
   - Due Date: 30 days from report submission date

## Platform Implementation Notes

### Royalty Report Form Structure
- Support multiple sales channels per report
- Each channel has its own royalty rate
- Per-product line items with SKU, description, unit price, units sold
- Auto-calculate gross turnover per line item
- Auto-calculate channel totals
- Auto-calculate royalty per channel
- Display total royalty due
- Display MG recoupment status
- Calculate and display excess royalty

### Multi-Currency Considerations
- This report is already in USD
- If licensee reports in local currency (THB), system should:
  - Accept local currency input
  - Use end-of-quarter exchange rate
  - Auto-convert to USD
  - Display both local and USD amounts

### Invoice Generation Logic
- If total royalty < MG: Generate MG invoice for the difference
- If total royalty = MG: No invoice needed (MG fully paid)
- If total royalty > MG: Generate excess royalty invoice for (total royalty - MG)

### Quarterly Reminder Timing
- Report Period: Q4 (Oct 1 - Dec 31)
- Submission Deadline: 30 days after quarter end = Jan 30
- Reminder Dates: Jan 1, Jan 15, Jan 25, Jan 30 (escalating)
- Overdue: After Jan 30
