"use client";

import { useState, useCallback } from "react";
import Map, { Source, Layer, MapLayerMouseEvent } from "react-map-gl";
import { ScrollArea } from "@/components/ui/scroll-area";
import RegionSelector from "@/components/area-selection/RegionSelector";
import TileDetails from "@/components/area-selection/TileDetails";
import CartSummary from "@/components/area-selection/CartSummary";
import { FillLayer } from "mapbox-gl";
import { LineLayer } from "mapbox-gl";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZGV2amF5a2VzIiwiYSI6ImNrbjBkMDd2eTBqaTcycHF1cXNjZTE4YzMifQ.RW0IjJxAMU8vGg8NCXYRyA";

// Mock tile data - replace with your actual data source
const tileData = {
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
        availableImagery: '["3D", "Satellite", "Street View"]',
        price: 299,
        dataQuality: 92,
      },
    },
    // Add more features as needed
  ],
};

// Layer styles
const tileLayer: FillLayer = {
  id: "data-tiles",
  type: "fill",
  paint: {
    "fill-color": [
      "interpolate",
      ["linear"],
      ["get", "coverage"],
      0,
      "#f7fafc",
      50,
      "#90cdf4",
      100,
      "#2b6cb0",
    ] as any,
    "fill-opacity": 0.7,
  },
  source: "",
};

const tileOutlineLayer: LineLayer = {
  id: "data-tiles-outline",
  type: "line",
  paint: {
    "line-color": "#4a5568",
    "line-width": 1,
  },
  source: "",
};

const tileHighlightLayer: FillLayer = {
  id: "data-tiles-highlighted",
  type: "fill",
  paint: {
    "fill-color": "#48bb78",
    "fill-opacity": 0.5,
  },
  filter: ["==", "id", ""],
  source: "",
};

interface SelectedTile {
  id: string;
  properties: {
    coverage: number;
    availableImagery: string;
    price: number;
    dataQuality: number;
  };
}

export default function AreaSelectionPage() {
  const [selectedTile, setSelectedTile] = useState<SelectedTile | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [cartItems, setCartItems] = useState<SelectedTile[]>([]);
  const [viewState, setViewState] = useState({
    longitude: 77.5946,
    latitude: 12.9716,
    zoom: 10,
  });
  const [hoveredTileId, setHoveredTileId] = useState<string | null>(null);

  const handleTileClick = useCallback((event: MapLayerMouseEvent) => {
    if (!event.features || event.features.length === 0) return;

    const feature = event.features[0];
    console.log("Clicked feature:", feature); // Debug log

    setSelectedTile({
      id: feature.properties?.id,
      properties: {
        coverage: feature.properties?.coverage,
        availableImagery: feature.properties?.availableImagery,
        price: feature.properties?.price,
        dataQuality: feature.properties?.dataQuality,
      },
    });
  }, []);

  const handleMouseEnter = useCallback((event: MapLayerMouseEvent) => {
    if (!event.features || event.features.length === 0) return;
    const feature = event.features[0];
    setHoveredTileId(feature.properties?.id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredTileId(null);
  }, []);

  const handleAddToCart = (tile: SelectedTile) => {
    if (!cartItems.find((item) => item.id === tile.id)) {
      setCartItems([...cartItems, tile]);
    }
  };

  const handleRemoveFromCart = (tileId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== tileId));
  };

  return (
    <div className="h-screen flex">
      {/* Left Sidebar - Region Selection and Cart */}
      <div className="w-1/4 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Select Region</h2>
          <RegionSelector onRegionChange={setSelectedRegion} />
        </div>

        <div className="flex-1 p-4">
          <CartSummary items={cartItems} onRemoveItem={handleRemoveFromCart} />
        </div>
      </div>

      {/* Main Content - Map */}
      <div className="flex-1 flex">
        <div className="w-2/3 relative">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            interactiveLayerIds={["data-tiles"]}
            onClick={handleTileClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Source id="tiles" type="geojson" data={tileData}>
              <Layer {...tileLayer} />
              <Layer {...tileOutlineLayer} />
              <Layer {...tileHighlightLayer} />
            </Source>
          </Map>
        </div>

        {/* Right Sidebar - Tile Details */}
        <div className="w-1/3 border-l">
          <ScrollArea className="h-full">
            {selectedTile ? (
              <TileDetails
                tile={selectedTile}
                onAddToCart={() => handleAddToCart(selectedTile)}
                isInCart={cartItems.some((item) => item.id === selectedTile.id)}
              />
            ) : (
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-2">Select a Tile</h2>
                <p className="text-gray-600">
                  Click on a tile in the map to view its details and available
                  data.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
