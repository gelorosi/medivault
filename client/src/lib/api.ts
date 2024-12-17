export const BASE_URL = "http://localhost:5000/api";

type ApiRequestConfig = {
  body?: Record<string, unknown> | string;
} & Omit<RequestInit, "body">;

export async function client<T>(
  endpoint: string,
  { body, ...customConfig }: ApiRequestConfig = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = typeof body === "string" ? body : JSON.stringify(body);
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Handle 401 Unauthorized
  if (response.status === 401) {
    localStorage.removeItem("token");
    throw new Error("Unauthorized access");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  // Only try to parse JSON if there's content
  try {
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    
    if (response.ok) {
      return data;
    }
    throw new Error(data.message || "Request failed");
  } catch (error) {
    if (response.ok) {
      // If response was successful but couldn't parse JSON, return empty object
      return {} as T;
    }
    console.error("API Error:", error);
    throw error;
  }
}

// Export the API client for use with React Query and other features
export const api = {
  async get<T>(endpoint: string, config: Omit<ApiRequestConfig, "body"> = {}) {
    return client<T>(endpoint, { ...config, method: "GET" });
  },
  async post<T>(
    endpoint: string,
    data: unknown,
    config: Omit<ApiRequestConfig, "body"> = {}
  ) {
    return client<T>(endpoint, {
      ...config,
      method: "POST",
      body: data as Record<string, unknown>,
    });
  },
  async put<T>(
    endpoint: string,
    data: unknown,
    config: Omit<ApiRequestConfig, "body"> = {}
  ) {
    return client<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data as Record<string, unknown>,
    });
  },
  async patch<T>(
    endpoint: string,
    data: unknown,
    config: Omit<ApiRequestConfig, "body"> = {}
  ) {
    return client<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data as Record<string, unknown>,
    });
  },
  async delete<T>(
    endpoint: string,
    config: Omit<ApiRequestConfig, "body"> = {}
  ) {
    return client<T>(endpoint, { ...config, method: "DELETE" });
  },
};