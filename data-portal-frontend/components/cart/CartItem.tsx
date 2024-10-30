import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    dataType: string;
    coverage: number;
  };
  onRemove: () => void;
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <div className="text-sm text-gray-600">
          <p>Type: {item.dataType}</p>
          <p>Coverage: {item.coverage}%</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">${item.price}</div>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
