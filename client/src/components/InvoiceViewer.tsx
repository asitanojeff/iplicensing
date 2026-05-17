import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  type: "mg" | "excess_royalty" | "label_order";
  amount: number;
  currency: string;
  status: "pending" | "paid" | "overdue";
  description: string;
}

interface InvoiceViewerProps {
  invoices: Invoice[];
}

export function InvoiceViewer({ invoices }: InvoiceViewerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "mg":
        return "Minimum Guarantee";
      case "excess_royalty":
        return "Excess Royalty";
      case "label_order":
        return "Label Order";
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>View and download your invoices</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No invoices yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold">{invoice.invoiceNumber}</p>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                    <Badge variant="outline">{getTypeLabel(invoice.type)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{invoice.description}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Issued: {new Date(invoice.date).toLocaleDateString()}</span>
                    <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="text-right mr-4">
                  <p className="font-bold text-lg">
                    {invoice.currency} {invoice.amount.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
