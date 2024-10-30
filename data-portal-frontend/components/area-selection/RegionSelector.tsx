"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface RegionSelectorProps {
  onRegionChange: (region: string) => void;
}

export default function RegionSelector({
  onRegionChange,
}: RegionSelectorProps) {
  const [country, setCountry] = useState("");
  const [showCustomRegion, setShowCustomRegion] = useState(false);

  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value) => {
          setCountry(value);
          setShowCustomRegion(value === "other");
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="india">India</SelectItem>
          <SelectItem value="usa">United States</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      {country && !showCustomRegion && (
        <Select onValueChange={onRegionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            {country === "india" && (
              <>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
              </>
            )}
            {country === "usa" && (
              <>
                <SelectItem value="california">California</SelectItem>
                <SelectItem value="texas">Texas</SelectItem>
                <SelectItem value="newyork">New York</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      )}

      {showCustomRegion && (
        <Input
          placeholder="Enter custom region"
          onChange={(e) => onRegionChange(e.target.value)}
        />
      )}
    </div>
  );
}
