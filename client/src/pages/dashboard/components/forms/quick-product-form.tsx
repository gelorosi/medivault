import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"  // Updated import path
import { useAddProduct } from "@/hooks/useProducts"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
  price: z.number().min(0, "Price must be positive"),
})

export function QuickProductForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast()
  const addProduct = useAddProduct()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      quantity: 0,
      price: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addProduct.mutateAsync(values)
      toast({ title: "Product added successfully" })
      onSuccess()
    } catch (error) {
      toast({ 
        title: "Failed to add product", 
        variant: "destructive" 
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
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
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Add Product</Button>
      </form>
    </Form>
  )
}