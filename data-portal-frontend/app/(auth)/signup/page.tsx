"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const formSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      (email) => {
        const [, domain] = email.split("@");
        return ![
          "gmail.com",
          "yahoo.com",
          "hotmail.com",
          "outlook.com",
        ].includes(domain.toLowerCase());
      },
      {
        message: "Please use a work email address",
      }
    ),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  companyName: z.string().min(1, {
    message: "Company name is required",
  }),
  companyWebsite: z.string().url({
    message: "Please enter a valid URL",
  }),
  intendedUse: z.enum(
    [
      "AI Training Datasets",
      "Map feature extraction",
      "3D Data",
      "AR/VR",
      "Custom tasks",
      "I'm just testing this out",
    ],
    {
      required_error: "Please select an intended use",
    }
  ),
});

export default function SignUpPage() {
  const [showAccessRequestForm, setShowAccessRequestForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      companyName: "",
      companyWebsite: "",
      intendedUse: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await api.auth.signup(values);

      // Store the token
      localStorage.setItem("token", response.token);

      toast({
        title: "Account created successfully",
        description: "Welcome to Proto Data Portal!",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sign Up for Proto Data Portal</h1>
      {!showAccessRequestForm ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.name@company.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please use your work email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intendedUse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intended Use of Proto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select intended use" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AI Training Datasets">
                        AI Training Datasets
                      </SelectItem>
                      <SelectItem value="Map feature extraction">
                        Map feature extraction
                      </SelectItem>
                      <SelectItem value="3D Data">3D Data</SelectItem>
                      <SelectItem value="AR/VR">AR/VR</SelectItem>
                      <SelectItem value="Custom tasks">Custom tasks</SelectItem>
                      <SelectItem value="I'm just testing this out">
                        {"I'm"} just testing this out
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      ) : (
        <AccessRequestForm />
      )}
      <div className="mt-4">
        <Button
          variant="link"
          onClick={() => setShowAccessRequestForm(!showAccessRequestForm)}
        >
          {showAccessRequestForm
            ? "Back to Sign Up"
            : "Request access without a work email"}
        </Button>
      </div>
    </div>
  );
}

function AccessRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<{ email: string; reason: string }>({
    defaultValues: {
      email: "",
      reason: "",
    },
  });

  async function onSubmit(values: { email: string; reason: string }) {
    try {
      setIsLoading(true);
      await api.auth.requestAccess(values);

      toast({
        title: "Request submitted",
        description: "We'll review your request and get back to you soon.",
      });

      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Access</FormLabel>
              <FormControl>
                <Textarea required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Request Access"}
        </Button>
      </form>
    </Form>
  );
}
