"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import DatasetRequestForm from "@/components/ai-training/DatasetRequestForm";
import RequestSummary from "@/components/ai-training/RequestSummary";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

// Define the form schema
const requestFormSchema = z.object({
  dataTypes: z.array(z.string()).min(1, "Select at least one data type"),
  useCase: z.string().min(10, "Please provide more detail about your use case"),
  dataSize: z.string().min(1, "Select a data size"),
  format: z.string().min(1, "Select a format"),
  additionalRequirements: z.string().optional(),
  organization: z.string().min(2, "Organization name is required"),
  email: z.string().email("Invalid email address"),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

export default function AITrainingRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      dataTypes: [],
      useCase: "",
      dataSize: "",
      format: "",
      additionalRequirements: "",
      organization: "",
      email: "",
    },
  });

  const onSubmit = async (data: RequestFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await api.datasets.createRequest(data)
      
      toast({
        title: "Request Submitted Successfully",
        description: "We'll review your request and get back to you soon.",
      })
      
      setSubmitted(true)

      // Optionally redirect after a delay
      setTimeout(() => {
        router.push('/dashboard/requests')
      }, 5000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>AI Training Dataset Request</CardTitle>
            <CardDescription>
              Request a custom dataset for your AI training needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <DatasetRequestForm form={form} isSubmitting={isSubmitting} />
                </form>
              </Form>
            ) : (
              <RequestSummary data={form.getValues()} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
