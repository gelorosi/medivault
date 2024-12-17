"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  sku: z.string().min(1, {
    message: "SKU is required.",
  }),
  category: z.enum(["OTC", "PRESCRIPTION"], {
    required_error: "Please select a category.",
  }),
  quantity: z.coerce.number().min(0, {
    message: "Quantity cannot be negative.",
  }),
  minStockLevel: z.coerce.number().min(0, {
    message: "Minimum stock level cannot be negative.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price cannot be negative.",
  }),
  expiryDate: z.date({
    required_error: "Expiry date is required.",
  }),
  supplierId: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? val : val.toString())),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface Supplier {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormValues>;
  suppliers: Supplier[];
  onSubmit: (data: ProductFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({
  initialData,
  suppliers,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const { toast } = useToast();

  const transformedInitialData = {
    ...initialData,
    supplierId: initialData?.supplierId
      ? initialData.supplierId.toString()
      : "",
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: transformedInitialData?.name || "",
      sku: transformedInitialData?.sku || "",
      category: transformedInitialData?.category || "OTC",
      quantity: transformedInitialData?.quantity || 0,
      price: transformedInitialData?.price || 0,
      minStockLevel: transformedInitialData?.minStockLevel || 0,
      expiryDate: transformedInitialData?.expiryDate || new Date(),
      description: transformedInitialData?.description || "",
      supplierId: transformedInitialData?.supplierId || "",
    },
  });

  async function onFormSubmit(data: ProductFormValues) {
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: "Product saved successfully.",
      });
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="OTC">Over The Counter</SelectItem>
                    <SelectItem value="PRESCRIPTION">Prescription</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minStockLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Stock Level</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MMM dd, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="z-50 w-auto p-0"
                    align="start"
                    side="bottom"
                    sideOffset={5}
                    onInteractOutside={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div
                      className="rounded-md border bg-popover"
                      style={{ pointerEvents: "all" }}
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          console.log("Date selected:", date);
                          field.onChange(date);
                          // Simulate click outside to close popover
                          const overlay = document.querySelector(
                            "[data-radix-popper-content-wrapper]"
                          )?.parentElement;
                          if (overlay) {
                            setTimeout(() => {
                              const clickEvent = new MouseEvent("click", {
                                bubbles: true,
                                cancelable: true,
                                view: window,
                              });
                              overlay.dispatchEvent(clickEvent);
                            }, 100);
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        defaultMonth={field.value}
                        initialFocus
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString() || ""} // Ensure value is string
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem
                        key={supplier.id}
                        value={supplier.id.toString()}
                      >
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Product"}
        </Button>
      </form>
    </Form>
  );
}
