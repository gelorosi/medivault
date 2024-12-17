import { useReducer, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";
import { api } from "@/lib/api";
import type { LoginCredentials, RegisterCredentials, User } from "@/types";

interface AuthResponse {
  user: {
    id: number;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: Boolean(localStorage.getItem("token")),
  isLoading: true, // Changed to true for initial load
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  // Load user data on mount if token exists
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch({ type: "AUTH_ERROR" });
        return;
      }

      try {
        const response = await api.get<{ user: User }>("/auth/me");
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: response.user, token },
        });
      } catch (error) {
        localStorage.removeItem("token");
        dispatch({ type: "AUTH_ERROR" });
      }
    }

    loadUser();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch({ type: "AUTH_START" });

        const response = await api.post<AuthResponse>(
          "/auth/login",
          credentials
        );

        // Make sure the response matches the User type
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        };

        localStorage.setItem("token", response.token);
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user, token: response.token },
        });
      } catch (error) {
        dispatch({ type: "AUTH_ERROR" });
        toast({
          variant: "destructive",
          title: "Login Failed",
          description:
            error instanceof Error ? error.message : "Unable to login",
        });
        throw error;
      }
    },
    [toast]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        dispatch({ type: "AUTH_START" });

        const response = await api.post<AuthResponse>(
          "/auth/register",
          credentials
        );

        // Make sure the response matches the User type
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        };

        localStorage.setItem("token", response.token);
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user, token: response.token },
        });
      } catch (error) {
        dispatch({ type: "AUTH_ERROR" });
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description:
            error instanceof Error ? error.message : "Unable to register",
        });
        throw error;
      }
    },
    [toast]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    toast({
      description: "Successfully logged out",
    });
  }, [toast]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
