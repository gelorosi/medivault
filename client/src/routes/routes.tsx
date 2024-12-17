import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoginPage from "@/pages/auth/login-page";
import RegisterPage from "@/pages/auth/register-page";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { Skeleton } from "@/components/ui/skeleton";

// Using dynamic imports with type annotations for proper lazy loading
const Layout = lazy(() =>
  import("@/components/layout/layout").then((mod) => ({
    default: mod.Layout,
  }))
);

const DashboardPage = lazy(() =>
  import("@/pages/dashboard/dashboard-page").then((mod) => ({
    default: mod.default,
  }))
);

const ProductsPage = lazy(() =>
  import("@/pages/products/products-page").then((mod) => ({
    default: mod.default,
  }))
);

const SuppliersPage = lazy(() =>
  import("@/pages/suppliers/suppliers-page").then((mod) => ({
    default: mod.default,
  }))
);

const ReportsPage = lazy(() =>
  import("@/pages/reports/reports-page").then((mod) => ({
    default: mod.default,
  }))
);

const BusinessSetupPage = lazy(() =>
  import("@/pages/business-setup/business-setup-page").then((mod) => ({
    default: mod.default,
  }))
);

function LoadingFallback() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-8 w-full max-w-sm" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Business Setup - Protected but outside main layout */}
          <Route
            path="/business-setup"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <BusinessSetupPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ErrorBoundary>
                  <DashboardPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/products"
              element={
                <ErrorBoundary>
                  <ProductsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/suppliers"
              element={
                <ErrorBoundary>
                  <SuppliersPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/reports"
              element={
                <ErrorBoundary>
                  <ReportsPage />
                </ErrorBoundary>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
