"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dataTypes = [
  { id: "3d", label: "3D Models" },
  { id: "imagery", label: "High-Resolution Imagery" },
  { id: "labeled-3d", label: "Labeled 3D Data" },
  { id: "labeled-imagery", label: "Labeled Imagery" },
];

const dataSizes = [
  { value: "small", label: "Small (< 1000 samples)" },
  { value: "medium", label: "Medium (1000-5000 samples)" },
  { value: "large", label: "Large (5000+ samples)" },
  { value: "custom", label: "Custom Size" },
];

const dataFormats = [
  { value: "glb", label: "GLB/GLTF" },
  { value: "fbx", label: "FBX" },
  { value: "obj", label: "OBJ" },
  { value: "jpeg", label: "JPEG" },
  { value: "custom", label: "Custom Format" },
];

interface DatasetRequestFormProps {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
}

export default function DatasetRequestForm({
  form,
  isSubmitting,
}: DatasetRequestFormProps) {
  return (
    <div className="space-y-8">
      {/* Data Types */}
      <FormField
        control={form.control}
        name="dataTypes"
        render={() => (
          <FormItem>
            <FormLabel>Data Types Required</FormLabel>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {dataTypes.map((type) => (
                <FormField
                  key={type.id}
                  control={form.control}
                  name="dataTypes"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(type.id)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            const updated = checked
                              ? [...current, type.id]
                              : current.filter(
                                  (value: string) => value !== type.id
                                );
                            field.onChange(updated);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {type.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Use Case */}
      <FormField
        control={form.control}
        name="useCase"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Use Case Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your intended use case and specific requirements..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              The more detail you provide, the better we can tailor the dataset
              to your needs.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Data Size */}
      <FormField
        control={form.control}
        name="dataSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dataset Size</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select dataset size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dataSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Format */}
      <FormField
        control={form.control}
        name="format"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Format</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select data format" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dataFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Organization & Contact */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Additional Requirements */}
      <FormField
        control={form.control}
        name="additionalRequirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Requirements</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any additional specifications or requirements..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </Button>
    </div>
  );
}
