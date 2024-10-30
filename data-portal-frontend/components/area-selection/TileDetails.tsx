"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TileDetailsProps {
  tile: any;
  onAddToCart: () => void;
  isInCart: boolean;
}

export default function TileDetails({
  tile,
  onAddToCart,
  isInCart,
}: TileDetailsProps) {
  const availableDataTypes = JSON.parse(tile.properties.availableImagery);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Tile Details</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Coverage & Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Coverage</span>
                <span>{tile.properties.coverage}%</span>
              </div>
              <Progress value={tile.properties.coverage} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Data Quality</span>
                <span>{tile.properties.dataQuality}%</span>
              </div>
              <Progress value={tile.properties.dataQuality} />
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
            {availableDataTypes.map((type: string) => (
              <Badge key={type} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">
            ${tile.properties.price}
          </div>
          <Button className="w-full" onClick={onAddToCart} disabled={isInCart}>
            {isInCart ? "Added to Cart" : "Add to Cart"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
