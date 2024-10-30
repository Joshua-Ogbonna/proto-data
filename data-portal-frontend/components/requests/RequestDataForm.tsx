"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface TileProperties {
  id: string;
  coverage: number;
  availableImagery: string; // JSON string
  labelingStatus: string;
  lastUpdated: string;
  accuracyScore: number;
}

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

interface RequestDataFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTile: TileFeature | null;
  onSubmit: (formData: RequestFormData) => void;
}

interface RequestFormData {
  tileId: string;
  dataTypes: string[];
  additionalRequirements: string;
}

const parseAvailableImagery = (imageryString: string | undefined): string[] => {
  if (!imageryString) return [];
  try {
    return JSON.parse(imageryString);
  } catch (error) {
    console.error("Error parsing availableImagery:", error);
    return [];
  }
};

export default function RequestDataForm({
  isOpen,
  onClose,
  selectedTile,
  onSubmit,
}: RequestDataFormProps) {
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [additionalRequirements, setAdditionalRequirements] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTile) return;

    const formData: RequestFormData = {
      tileId: selectedTile.properties.id,
      dataTypes: selectedDataTypes,
      additionalRequirements,
    };

    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setSelectedDataTypes([]);
    setAdditionalRequirements("");
    onClose();
  };

  const toggleDataType = (dataType: string) => {
    setSelectedDataTypes((prev) =>
      prev.includes(dataType)
        ? prev.filter((type) => type !== dataType)
        : [...prev, dataType]
    );
  };

  if (!selectedTile?.properties?.availableImagery) return null;

  const { coverage, accuracyScore, availableImagery } = selectedTile.properties;
  const availableDataTypes = parseAvailableImagery(availableImagery as unknown as string);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Data for Selected Area</DialogTitle>
          <DialogDescription>
            Coverage: {coverage}% | Accuracy: {accuracyScore}%
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Available Data Types</label>
            {availableDataTypes.map((dataType: string) => (
              <div key={dataType} className="flex items-center space-x-2">
                <Checkbox
                  id={dataType}
                  checked={selectedDataTypes.includes(dataType)}
                  onCheckedChange={() => toggleDataType(dataType)}
                />
                <label htmlFor={dataType} className="text-sm">
                  {dataType}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Additional Requirements
            </label>
            <Textarea
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              placeholder="Describe any specific requirements or preferences"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
