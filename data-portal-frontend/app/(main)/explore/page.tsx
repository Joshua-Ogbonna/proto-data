"use client";

import { useState } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Calendar, BarChart2, Image as ImageIcon } from "lucide-react";
import RequestDataForm from "@/components/requests/RequestDataForm";

// Replace with your Mapbox token
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZGV2amF5a2VzIiwiYSI6ImNrbjBkMDd2eTBqaTcycHF1cXNjZTE4YzMifQ.RW0IjJxAMU8vGg8NCXYRyA";

interface TileFeature {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  properties: {
    id: string;
    coverage: number;
    availableImagery: string[];
    labelingStatus: string;
    lastUpdated: string;
    accuracyScore: number;
    previewImage: string;
  };
}

// Mock data for tiles
const mockTileData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.5, 12.9],
            [77.6, 12.9],
            [77.6, 13.0],
            [77.5, 13.0],
            [77.5, 12.9],
          ],
        ],
      },
      properties: {
        id: "1",
        coverage: 85,
        availableImagery: ["3D", "Satellite", "Street View"], // This array must exist
        labelingStatus: "Completed",
        lastUpdated: "2024-02-15",
        accuracyScore: 92,
        previewImage: "/sample-tile-preview.jpg",
      },
    },
  ],
};

export default function ExplorationPage() {
  const [selectedTile, setSelectedTile] = useState<TileFeature | null>(null);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 77.5946,
    latitude: 12.9716,
    zoom: 10,
  });

  const handleTileClick = (event: TileFeature) => {
    if (event) {
      // Convert the feature to our expected format
      setSelectedTile(event);
    }
  };

  const handleRequestSubmit = (formData: any) => {
    console.log("Request submitted:", formData);
    // Here you would typically send the request to your backend
    // You can also show a success message to the user
  };

  const parseAvailableImagery = (
    imageryString: string | undefined
  ): string[] => {
    if (!imageryString) return [];
    try {
      return JSON.parse(imageryString);
    } catch (error) {
      console.error("Error parsing availableImagery:", error);
      return [];
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Panel - Map */}
      <div className="w-2/3 h-full relative">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          onClick={(event) => {
            const features = event.features || [];
            if (features.length > 0) {
              handleTileClick(features[0] as unknown as TileFeature);
            }
          }}
          interactiveLayerIds={["tile-fill"]}
        >
          <Source id="tiles" type="geojson" data={mockTileData}>
            <Layer
              id="tile-fill"
              type="fill"
              paint={{
                "fill-color": "#088",
                "fill-opacity": 0.4,
              }}
            />
            <Layer
              id="tile-outline"
              type="line"
              paint={{
                "line-color": "#088",
                "line-width": 2,
              }}
            />
          </Source>

          {selectedTile && (
            <Popup
              longitude={selectedTile.geometry.coordinates[0][0][0]}
              latitude={selectedTile.geometry.coordinates[0][0][1]}
              onClose={() => setSelectedTile(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold">Tile Information</h3>
                <p>Coverage: {selectedTile.properties.coverage}%</p>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Right Panel - Information */}
      <div className="w-1/3 h-full border-l">
        <ScrollArea className="h-full">
          {selectedTile ? (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Tile Details</h2>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Coverage Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Area Coverage</span>
                        <span>{selectedTile.properties.coverage}%</span>
                      </div>
                      <Progress value={selectedTile.properties.coverage} />
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Last Updated: {selectedTile.properties.lastUpdated}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      <span>
                        Accuracy Score: {selectedTile.properties.accuracyScore}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Available Data Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {parseAvailableImagery(
                      selectedTile?.properties
                        ?.availableImagery as unknown as string
                    ).map((type: string) => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="3d">
                    <TabsList>
                      <TabsTrigger value="3d">3D View</TabsTrigger>
                      <TabsTrigger value="satellite">Satellite</TabsTrigger>
                      <TabsTrigger value="street">Street View</TabsTrigger>
                    </TabsList>
                    <TabsContent value="3d">
                      <img
                        src={selectedTile?.properties?.previewImage}
                        alt="3D Preview"
                        className="w-full rounded-lg"
                      />
                    </TabsContent>
                    <TabsContent value="satellite">
                      <img
                        src={selectedTile?.properties?.previewImage}
                        alt="Satellite Preview"
                        className="w-full rounded-lg"
                      />
                    </TabsContent>
                    <TabsContent value="street">
                      <img
                        src={selectedTile?.properties?.previewImage}
                        alt="Street View Preview"
                        className="w-full rounded-lg"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Button
                className="w-full"
                onClick={() => setIsRequestFormOpen(true)}
              >
                Request Data for This Area
              </Button>

              <RequestDataForm
                isOpen={isRequestFormOpen}
                onClose={() => setIsRequestFormOpen(false)}
                selectedTile={selectedTile}
                onSubmit={handleRequestSubmit}
              />
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Data Explorer</h2>
              <p className="text-gray-600 mb-4">
                Select a tile on the map to view detailed information about
                available data.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Click on any highlighted area</span>
                </div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>View available imagery and data</span>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
