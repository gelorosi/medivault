import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"  // Updated import path
import { useUpdateStock } from "@/hooks/useProducts"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProducts } from "@/hooks/useProducts"

const formSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().int().min(0, "Quantity must be positive"),
})

export function QuickStockUpdate({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast()
  const updateStock = useUpdateStock()
  const { data: products, isLoading } = useProducts()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateStock.mutateAsync(values)
      toast({ title: "Stock updated successfully" })
      onSuccess()
    } catch (error) {
      toast({ 
        title: "Failed to update stock", 
        variant: "destructive" 
      })
    }
  }

  if (isLoading) {
    return <div>Loading products...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Quantity</FormLabel>
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
        <Button type="submit" className="w-full">Update Stock</Button>
      </form>
    </Form>
  )
}