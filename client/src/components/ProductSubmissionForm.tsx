import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ProductSubmissionFormProps {
  contractId: number;
  onSuccess?: () => void;
}

export function ProductSubmissionForm({ contractId, onSuccess }: ProductSubmissionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemNumber: "",
    licensedProduct: "",
    suggestedRetailPrice: "",
    suggestedWholesalePrice: "",
    targetLaunchDate: "",
    targetQuantity: "",
    notes: "",
  });
  const [designImage, setDesignImage] = useState<File | null>(null);

  const createSubmissionMutation = trpc.approvals.createSubmission.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setDesignImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemNumber || !formData.licensedProduct || !formData.targetLaunchDate || !formData.targetQuantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Create product submission via tRPC
      const submission = await createSubmissionMutation.mutateAsync({
        contractId,
        itemNumber: formData.itemNumber,
        productName: formData.licensedProduct,
        description: formData.notes,
      });

      toast.success("Product submission created successfully");
      setFormData({
        itemNumber: "",
        licensedProduct: "",
        suggestedRetailPrice: "",
        suggestedWholesalePrice: "",
        targetLaunchDate: "",
        targetQuantity: "",
        notes: "",
      });
      setDesignImage(null);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating submission:", error);
      toast.error("Failed to create product submission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit New Product</CardTitle>
        <CardDescription>
          Submit product designs for approval. All information is preliminary and can be adjusted before market release.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemNumber">Item Number (SKU) *</Label>
              <Input
                id="itemNumber"
                name="itemNumber"
                placeholder="e.g., MCC-2026-001"
                value={formData.itemNumber}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">Must match your royalty report</p>
            </div>

            {/* Licensed Product */}
            <div className="space-y-2">
              <Label htmlFor="licensedProduct">Licensed Product *</Label>
              <Select value={formData.licensedProduct} onValueChange={(value) => setFormData(prev => ({ ...prev, licensedProduct: value }))}>
                <SelectTrigger id="licensedProduct">
                  <SelectValue placeholder="Select product category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plush">Kidult & Kids Premium Plush</SelectItem>
                  <SelectItem value="baby">Baby Essentials</SelectItem>
                  <SelectItem value="travel">Travel Products</SelectItem>
                  <SelectItem value="stationery">Stationery</SelectItem>
                  <SelectItem value="accessories">Phone Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="suggestedRetailPrice">Suggested Retail Price (USD) *</Label>
              <Input
                id="suggestedRetailPrice"
                name="suggestedRetailPrice"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.suggestedRetailPrice}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggestedWholesalePrice">Suggested Wholesale Price (USD)</Label>
              <Input
                id="suggestedWholesalePrice"
                name="suggestedWholesalePrice"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={formData.suggestedWholesalePrice}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
          </div>

          {/* Timeline & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetLaunchDate">Target Launch Date *</Label>
              <Input
                id="targetLaunchDate"
                name="targetLaunchDate"
                type="date"
                value={formData.targetLaunchDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetQuantity">Estimated Production Quantity *</Label>
              <Input
                id="targetQuantity"
                name="targetQuantity"
                type="number"
                placeholder="e.g., 50000"
                value={formData.targetQuantity}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">Used for label ordering</p>
            </div>
          </div>

          {/* Design Image Upload */}
          <div className="space-y-2">
            <Label>Design Image</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent cursor-pointer transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="designImage"
              />
              <label htmlFor="designImage" className="cursor-pointer block">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium">{designImage ? designImage.name : "Click to upload or drag and drop"}</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, PSD up to 100MB</p>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes & Description</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Describe your product design, materials, target market, or any special requests..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Provide design rationale, pre-production feedback, or any customization requests
            </p>
          </div>

          {/* Preliminary Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Preliminary Information</p>
              <p>All information above is preliminary and can be adjusted before Market Release approval.</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || createSubmissionMutation.isPending}>
              {isLoading || createSubmissionMutation.isPending ? "Submitting..." : "Submit for Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
