"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/ui/icons";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { loadStripe } from "@stripe/stripe-js";

const formSchema = z.object({
  credits: z.number().min(50, {
    message: "Minimum purchase is 50 credits",
  }),
});

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function BuyCreditsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credits: 50,
    },
  });

  const CREDIT_PRICE_USD = 1;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProcessing(true);

      // Create Stripe Checkout Session
      const { sessionId } = await api.payments.createCheckoutSession({
        credits: values.credits,
        amount: values.credits * CREDIT_PRICE_USD,
        userId: user?.id as string,
      });

      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      // Redirect to Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Buy Credits</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Credit System Explanation</CardTitle>
              <CardDescription>
                Understand how our credit system works
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Credits are used to access and download data from our platform.
                Each type of data or action may require a different number of
                credits.
              </p>
              <ul className="list-disc list-inside mt-4">
                <li>1 credit = Access to basic dataset</li>
                <li>5 credits = Download of HD map for small area</li>
                <li>10 credits = Access to premium 3D scene</li>
                {/* Add more examples as needed */}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefits of Purchasing Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>Flexible usage across different data types</li>
                <li>Volume discounts for larger purchases</li>
                <li>Credits never expire</li>
                <li>Simplified billing process</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Purchase Credits</CardTitle>
              <CardDescription>Minimum purchase: 50 credits</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Credits</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Each credit costs $1. Minimum purchase is 50 credits.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Icons.creditCard className="mr-2 h-4 w-4" />
                        Purchase Credits ($
                        {form.watch("credits") * CREDIT_PRICE_USD})
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
