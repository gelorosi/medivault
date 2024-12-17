import { useCallback } from "react";
import { useAuth as useAuthContext } from "@/context/auth";
import { api } from "@/lib/api";

interface Credentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export function useAuth() {
  const { login: contextLogin, register: contextRegister, logout: contextLogout } = useAuthContext();

  const login = useCallback(
    async (credentials: Credentials) => {
      const data = await api.post<AuthResponse>("/auth/login", credentials);
      await contextLogin(credentials.email, credentials.password);
      return data;
    },
    [contextLogin]
  );

  const register = useCallback(
    async (credentials: Credentials) => {
      const data = await api.post<AuthResponse>("/auth/register", credentials);
      await contextRegister(credentials.email, credentials.password);
      return data;
    },
    [contextRegister]
  );

  const logout = useCallback(() => {
    contextLogout();
  }, [contextLogout]);

  return { login, register, logout };
}