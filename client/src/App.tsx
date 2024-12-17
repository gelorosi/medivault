import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth";
import { BusinessProvider } from "@/context/business";
import { AppRoutes } from "@/routes/routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const router = createBrowserRouter([
  {
    path: "*",
    element: <AppRoutes />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BusinessProvider>
          <RouterProvider router={router} />
          <Toaster />
        </BusinessProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;