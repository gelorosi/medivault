import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-2xl font-bold text-destructive">Oops! Something went wrong</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              {process.env.NODE_ENV === "development" && (
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-40">
                  {this.state.error?.stack}
                </pre>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={this.handleReload}>Reload Page</Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}