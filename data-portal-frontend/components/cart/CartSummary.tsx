import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
  isLoading: boolean;
}

export default function CartSummary({
  subtotal,
  onCheckout,
  isLoading,
}: CartSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${subtotal}</span>
          </div>
        </div>

        <Button className="w-full" onClick={onCheckout} disabled={isLoading}>
          {isLoading ? "Processing..." : "Proceed to Checkout"}
        </Button>
      </CardContent>
    </Card>
  );
}
