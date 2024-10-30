"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapIcon, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { state } = useCart();
  const itemCount = state.items.length;
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Proto Data Portal
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/explore" className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  Explore Data
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/buy-credits">Buy Credits</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Cart</h4>
                  <p className="text-sm text-muted-foreground">
                    {itemCount} items in your cart
                  </p>
                </div>
                <Separator />
                {itemCount > 0 ? (
                  <>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {state.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.dataType}
                              </p>
                            </div>
                            <p className="font-medium">${item.price}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">${state.total}</span>
                      </div>
                      <Button asChild className="w-full">
                        <Link href="/cart">View Cart & Checkout</Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      Your cart is empty
                    </p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/area-selection">Browse Available Data</Link>
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
}
