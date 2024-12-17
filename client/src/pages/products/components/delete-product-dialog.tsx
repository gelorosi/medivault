import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteProduct } from "@/hooks/useProducts";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
  };
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
}: DeleteProductDialogProps) {
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = () => {
    // Log for debugging
    console.log('Initiating delete for product:', product);

    deleteProduct(product.id, {
      onSuccess: () => {
        console.log('Delete success callback');
        onOpenChange(false);
      },
      onError: (error) => {
        console.error('Delete error:', error);
      },
      onSettled: () => {
        console.log('Delete operation settled');
      }
    });
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(value) => {
        if (!isPending) {
          onOpenChange(value);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the product "{product.name}". This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}