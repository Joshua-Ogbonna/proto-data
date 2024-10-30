"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Database, DatabaseIcon, MapIcon, SearchIcon } from "lucide-react";

// Mock data (replace with API calls later)
const creditInfo = {
  available: 750,
  used: 250,
  total: 1000,
};

const activeRequests = [
  {
    id: "REQ001",
    type: "HD Map",
    area: "New York City",
    status: "Processing",
    progress: 60,
  },
  {
    id: "REQ002",
    type: "3D Scene",
    area: "San Francisco",
    status: "Queued",
    progress: 0,
  },
];

const pastRequests = [
  {
    id: "REQ000",
    type: "Labeled Dataset",
    area: "Los Angeles",
    status: "Completed",
    date: "2023-10-15",
  },
  {
    id: "REQ-1",
    type: "Raw Imagery",
    area: "Chicago",
    status: "Completed",
    date: "2023-10-10",
  },
  {
    id: "REQ-2",
    type: "Point Cloud",
    area: "Houston",
    status: "Cancelled",
    date: "2023-10-05",
  },
];

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Credit Usage</CardTitle>
            <CardDescription>
              Your current credit balance and usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress
                value={(creditInfo.used / creditInfo.total) * 100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Used: {creditInfo.used}</span>
                <span>Available: {creditInfo.available}</span>
              </div>
            </div>
            <p className="mt-4 text-lg font-semibold">
              Total Credits: {creditInfo.total}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Requests</CardTitle>
            <CardDescription>
              Currently processing data requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeRequests.length > 0 ? (
              <ul className="space-y-4">
                {activeRequests.map((request) => (
                  <li key={request.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{request.type}</span>
                      <Badge
                        variant={
                          request.status === "Processing"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Area: {request.area}
                    </p>
                    <Progress value={request.progress} className="w-full" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No active requests</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Past Requests</CardTitle>
          <CardDescription>
            History of your completed and cancelled requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.area}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "Completed"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {/* Area Selection Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              Select Area
            </CardTitle>
            <CardDescription>
              Browse and select specific areas for data acquisition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              Select tiles by region, view data availability, and add areas to
              your cart.
            </p>
            <Button asChild className="w-full">
              <Link
                href="/area-selection"
                className="flex items-center justify-center gap-2"
              >
                <SearchIcon className="h-4 w-4" />
                Select Areas
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Sample Dataset Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseIcon className="h-5 w-5 text-primary" />
              Sample Dataset
            </CardTitle>
            <CardDescription>
              Explore our sample dataset to see data quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              View sample data types and quality before making a purchase.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link
                href="/sample-dataset"
                className="flex items-center justify-center gap-2"
              >
                View Samples
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              AI Training Dataset
            </CardTitle>
            <CardDescription>
              Request custom datasets for AI model training
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              Get access to comprehensive datasets tailored for AI training
              purposes.
            </p>
            <Button asChild className="w-full">
              <Link href="/ai-training-request">Request Dataset</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
