import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  mode: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Define schemas for login and register
  const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
  });

  const registerSchema = loginSchema
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  // Use appropriate schema based on mode
  const formSchema = mode === "register" ? registerSchema : loginSchema;
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === "register" ? { confirmPassword: "" } : {}),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (mode === "login") {
        await login({ email: values.email, password: values.password });
        navigate("/dashboard");
      } else {
        const registerValues = values as z.infer<typeof registerSchema>;
        await register({
          email: registerValues.email,
          password: registerValues.password,
          confirmPassword: registerValues.confirmPassword,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Authentication failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          {mode === "login" ? "Sign in" : "Create an account"}
        </CardTitle>
        <CardDescription>
          Enter your email below to {mode === "login" ? "sign in to" : "create"}{" "}
          your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      type="email"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === "register" && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button
              type="submit"
              className="w-full bg-neutral-900 text-white"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <Button
                variant="link"
                className="px-0"
                onClick={() => navigate("/register")}
                disabled={loading}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button
                variant="link"
                className="px-0"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                Sign in
              </Button>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
