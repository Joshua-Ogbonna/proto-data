"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface CartSummaryProps {
  items: any[];
  onRemoveItem: (id: string) => void;
}

export default function CartSummary({ items, onRemoveItem }: CartSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.properties.price, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] mb-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <div>
                <div className="font-medium">Tile {item.id}</div>
                <div className="text-sm text-gray-500">
                  ${item.properties.price}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </ScrollArea>

        {items.length > 0 ? (
          <div>
            <div className="flex justify-between font-bold mb-4">
              <span>Total</span>
              <span>${total}</span>
            </div>
            <Button className="w-full">Proceed to Checkout</Button>
          </div>
        ) : (
          <div className="text-center text-gray-500">No items in cart</div>
        )}
      </CardContent>
    </Card>
  );
}
