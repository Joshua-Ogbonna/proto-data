"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const data = await api.datasets.getRequests()
      setRequests(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load requests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dataset Requests</h1>
      <div className="space-y-4">
        {requests.map((request: any) => (
          <Card key={request._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {request.organization}
                </CardTitle>
                <Badge>{request.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium">Data Types</dt>
                  <dd>{request.dataTypes.join(", ")}</dd>
                </div>
                <div>
                  <dt className="font-medium">Data Size</dt>
                  <dd>{request.dataSize}</dd>
                </div>
                <div>
                  <dt className="font-medium">Format</dt>
                  <dd>{request.format}</dd>
                </div>
                <div>
                  <dt className="font-medium">Submitted</dt>
                  <dd>{new Date(request.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}