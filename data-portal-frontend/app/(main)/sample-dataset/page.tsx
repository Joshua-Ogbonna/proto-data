"use client";

import { useState } from "react";
import Map, { Marker } from "react-map-gl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ThreeDViewer from "@/components/threedviewer/ThreeDViewer";
import ImageViewer from "@/components/imageViewer/ImageViewer";

// Replace with your actual Mapbox token
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZGV2amF5a2VzIiwiYSI6ImNrbjBkMDd2eTBqaTcycHF1cXNjZTE4YzMifQ.RW0IjJxAMU8vGg8NCXYRyA";

const BANGALORE_COORDINATES = [77.5946, 12.9716];

const sampleDataset = {
  "3dModel": "/Dayo.glb",
  labeledImagery: "/gltf_embedded_1@channels=B.jpeg",
  labeled3dDataset: "/kelvin__deadlock_hero_model.glb",
  rawImagery: "/gltf_embedded_2.jpeg",
};

export default function SampleDatasetExplorer() {
  const [selectedTab, setSelectedTab] = useState("3dModel");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sample Dataset Explorer</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dataset Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This sample dataset represents an H8 cell in Bangalore, showcasing
            various data types available in our platform.
          </p>
          <Button className="mt-4">Request Full Access</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Map</CardTitle>
            <CardDescription>H8 cell in Bangalore</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: "400px" }}>
              <Map
                initialViewState={{
                  longitude: BANGALORE_COORDINATES[0],
                  latitude: BANGALORE_COORDINATES[1],
                  zoom: 11,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
              >
                <Marker
                  longitude={BANGALORE_COORDINATES[0]}
                  latitude={BANGALORE_COORDINATES[1]}
                  color="red"
                />
              </Map>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dataset Viewer</CardTitle>
            <CardDescription>Explore different data types</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="3dModel">3D Model</TabsTrigger>
                <TabsTrigger value="labeledImagery">
                  Labeled Imagery
                </TabsTrigger>
                <TabsTrigger value="labeled3dDataset">
                  Labeled 3D Dataset
                </TabsTrigger>
                <TabsTrigger value="rawImagery">Raw Imagery</TabsTrigger>
              </TabsList>
              <TabsContent value="3dModel">
                <div style={{ height: "400px" }}>
                  <ThreeDViewer modelPath={sampleDataset["3dModel"]} />
                </div>
              </TabsContent>
              <TabsContent value="labeledImagery">
                <ImageViewer imagePath={sampleDataset.labeledImagery} />
              </TabsContent>
              <TabsContent value="labeled3dDataset">
                <div style={{ height: "400px" }}>
                  <ThreeDViewer modelPath={sampleDataset.labeled3dDataset} />
                </div>
              </TabsContent>
              <TabsContent value="rawImagery">
                <ImageViewer imagePath={sampleDataset.rawImagery} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
