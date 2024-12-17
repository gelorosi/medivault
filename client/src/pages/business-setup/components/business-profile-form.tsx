import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UseMutationResult } from "@tanstack/react-query";

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
import { useCreateBusinessProfile } from "@/hooks/useBusinessProfile";
import { CreateBusinessProfileDTO, BusinessProfile } from "@/types";

const businessFormSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

interface BusinessProfileFormProps {
  onSuccess: () => void;
}

export function BusinessProfileForm({ onSuccess }: BusinessProfileFormProps) {
  const { mutate: createProfile, isPending } =
    useCreateBusinessProfile() as UseMutationResult<
      BusinessProfile,
      Error,
      CreateBusinessProfileDTO,
      unknown
    >;

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = (values: BusinessFormValues) => {
    createProfile(values, {
      onSuccess: () => {
        // Add a small delay to allow the success toast to be visible
        setTimeout(onSuccess, 1000);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter business name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter business address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
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
              <FormLabel>Business Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter business email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Setting up..." : "Complete Setup"}
        </Button>
      </form>
    </Form>
  );
}
