"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loadStripe } from "@stripe/stripe-js";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CartPage() {
  const { state, dispatch } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error("Error:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {state.items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() =>
                      dispatch({ type: "REMOVE_ITEM", payload: item.id })
                    }
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Cart Summary */}
          <div>
            <CartSummary
              subtotal={state.total}
              onCheckout={handleCheckout}
              isLoading={isLoading}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Add some items to your cart to get started.
          </p>
          <Button onClick={() => router.push("/area-selection")}>
            Browse Available Data
          </Button>
        </div>
      )}
    </div>
  );
}
