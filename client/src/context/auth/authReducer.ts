import type { AuthState, User } from "@/types";

export type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_ERROR" }
  | { type: "LOGOUT" };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };

    case "AUTH_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case "AUTH_ERROR":
      return {
        ...state,
        isLoading: false,
      };

    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    default:
      return state;
  }
}
