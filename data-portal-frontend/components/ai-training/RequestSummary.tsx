import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface RequestSummaryProps {
  data: {
    dataTypes: string[];
    useCase: string;
    dataSize: string;
    format: string;
    additionalRequirements?: string;
    organization: string;
    email: string;
  };
  onClose?: () => void;
}

export default function RequestSummary({ data, onClose }: RequestSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center text-green-600 mb-6">
        <Icons.check className="h-12 w-12" />
      </div>

      <h3 className="text-lg font-medium text-center mb-4">
        Request Submitted Successfully
      </h3>

      <div className="bg-muted p-4 rounded-lg space-y-4">
        <div>
          <h4 className="font-medium">Data Types</h4>
          <p>{data.dataTypes.join(", ")}</p>
        </div>

        <div>
          <h4 className="font-medium">Use Case</h4>
          <p>{data.useCase}</p>
        </div>

        <div>
          <h4 className="font-medium">Data Size</h4>
          <p>{data.dataSize}</p>
        </div>

        <div>
          <h4 className="font-medium">Format</h4>
          <p>{data.format}</p>
        </div>

        {data.additionalRequirements && (
          <div>
            <h4 className="font-medium">Additional Requirements</h4>
            <p>{data.additionalRequirements}</p>
          </div>
        )}

        <div>
          <h4 className="font-medium">Organization</h4>
          <p>{data.organization}</p>
        </div>

        <div>
          <h4 className="font-medium">Contact Email</h4>
          <p>{data.email}</p>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {"We'll"} review your request and get back to you within 1-2 business days.
      </p>

      {onClose && (
        <div className="flex justify-center mt-6">
          <Button onClick={onClose}>View All Requests</Button>
        </div>
      )}
    </div>
  );
}
