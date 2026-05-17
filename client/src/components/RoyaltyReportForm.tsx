import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Decimal } from "decimal.js";

interface LineItem {
  id: string;
  itemNumber: string;
  productName: string;
  channel: "retail" | "wholesale";
  unitPrice: string;
  unitsSold: string;
  grossTurnover: number;
  royaltyRate: number;
  royaltyDue: number;
}

interface RoyaltyReportFormProps {
  contractId: number;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
  onSuccess?: () => void;
}

export function RoyaltyReportForm({ contractId, quarter, year, onSuccess }: RoyaltyReportFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState("1.0");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<LineItem>>({});
  const [currency, setCurrency] = useState("USD");

  const submitReportMutation = trpc.royalties.submitReport.useMutation();

  const calculateTotals = () => {
    const totalRetail = lineItems
      .filter(item => item.channel === "retail")
      .reduce((sum, item) => sum + item.royaltyDue, 0);
    
    const totalWholesale = lineItems
      .filter(item => item.channel === "wholesale")
      .reduce((sum, item) => sum + item.royaltyDue, 0);
    
    const totalRoyalty = totalRetail + totalWholesale;
    const totalInUSD = totalRoyalty * parseFloat(exchangeRate);

    return { totalRetail, totalWholesale, totalRoyalty, totalInUSD };
  };

  const addLineItem = () => {
    if (!newItem.itemNumber || !newItem.productName || !newItem.channel || !newItem.unitPrice || !newItem.unitsSold) {
      toast.error("Please fill in all fields");
      return;
    }

    const unitPrice = parseFloat(newItem.unitPrice as string);
    const unitsSold = parseFloat(newItem.unitsSold as string);
    const grossTurnover = unitPrice * unitsSold;
    const royaltyRate = newItem.channel === "retail" ? 0.06 : 0.11; // Sheep Gadget rates
    const royaltyDue = grossTurnover * royaltyRate;

    setLineItems([
      ...lineItems,
      {
        id: Math.random().toString(),
        itemNumber: newItem.itemNumber as string,
        productName: newItem.productName as string,
        channel: newItem.channel as "retail" | "wholesale",
        unitPrice: newItem.unitPrice as string,
        unitsSold: newItem.unitsSold as string,
        grossTurnover,
        royaltyRate,
        royaltyDue,
      },
    ]);

    setNewItem({});
    toast.success("Line item added");
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lineItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    setIsLoading(true);
    try {
      const totals = calculateTotals();
      
      // Submit royalty report via tRPC
      await submitReportMutation.mutateAsync({
        contractId,
        quarter: quarter as "Q1" | "Q2" | "Q3" | "Q4",
        year,
        currency,
        items: lineItems.map(item => ({
          itemNumber: item.itemNumber,
          unitsSold: new Decimal(item.unitsSold),
          unitPrice: new Decimal(item.unitPrice),
          royaltyRate: new Decimal(item.royaltyRate),
        })),
        exchangeRate: new Decimal(exchangeRate),
      });

      toast.success("Royalty report submitted successfully");
      setLineItems([]);
      setExchangeRate("1.0");
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit royalty report");
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Royalty Report</CardTitle>
        <CardDescription>
          {quarter} {year} - Report sales by product and channel. All amounts in local currency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Currency & Exchange Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="CNY">CNY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exchangeRate">Exchange Rate (to USD)</Label>
              <Input
                id="exchangeRate"
                type="number"
                step="0.0001"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                placeholder="1.0"
              />
              <p className="text-xs text-muted-foreground">
                Use end-of-quarter exchange rate (e.g., last day of {quarter})
              </p>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Product Sales</Label>
            </div>

            {lineItems.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead>Item #</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Units</TableHead>
                      <TableHead className="text-right">Royalty %</TableHead>
                      <TableHead className="text-right">Royalty Due</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.itemNumber}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.productName}</TableCell>
                        <TableCell className="capitalize">{item.channel}</TableCell>
                        <TableCell className="text-right">${item.unitPrice}</TableCell>
                        <TableCell className="text-right">{item.unitsSold}</TableCell>
                        <TableCell className="text-right">{(item.royaltyRate * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-right font-semibold">${item.royaltyDue.toFixed(2)}</TableCell>
                        <TableCell>
                          <button
                            type="button"
                            onClick={() => removeLineItem(item.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Add New Item */}
            <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
              <p className="font-semibold text-sm">Add Product Sale</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Item #"
                  value={newItem.itemNumber || ""}
                  onChange={(e) => setNewItem({ ...newItem, itemNumber: e.target.value })}
                />
                <Input
                  placeholder="Product Name"
                  value={newItem.productName || ""}
                  onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                />
                <Select value={newItem.channel || ""} onValueChange={(value) => setNewItem({ ...newItem, channel: value as "retail" | "wholesale" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail (6%)</SelectItem>
                    <SelectItem value="wholesale">Wholesale (11%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Unit Price"
                  type="number"
                  step="0.01"
                  value={newItem.unitPrice || ""}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                />
                <Input
                  placeholder="Units Sold"
                  type="number"
                  value={newItem.unitsSold || ""}
                  onChange={(e) => setNewItem({ ...newItem, unitsSold: e.target.value })}
                />
                <Button type="button" onClick={addLineItem} className="col-span-2 md:col-span-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>

          {/* Totals */}
          {lineItems.length > 0 && (
            <div className="space-y-3 bg-muted p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Retail Channel Total:</span>
                <span className="font-semibold">${totals.totalRetail.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Wholesale Channel Total:</span>
                <span className="font-semibold">${totals.totalWholesale.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total Royalty (Local):</span>
                <span className="font-bold text-lg">${totals.totalRoyalty.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm bg-blue-50 p-2 rounded">
                <span>Total in USD (@ {exchangeRate}):</span>
                <span className="font-bold text-blue-900">${totals.totalInUSD.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* MG Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">Minimum Guarantee (MG)</p>
              <p>MG: $12,000 | Paid: $12,000 | Excess Royalty: ${Math.max(0, totals.totalInUSD - 12000).toFixed(2)}</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || submitReportMutation.isPending || lineItems.length === 0}>
              {isLoading || submitReportMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
