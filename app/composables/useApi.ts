import type { UseFetchOptions } from "nuxt/app";

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.devAdminApiUrl;

  // Get token from localStorage or cookie
  const getToken = () => {
    if (process.client) {
      return localStorage.getItem("authToken") || "";
    }
    return "";
  };

  // Generic API call function
  const apiCall = async <T>(
    endpoint: string,
    options: UseFetchOptions<T> & { requiresAuth?: boolean } = {}
  ) => {
    const { requiresAuth = true, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    // Add bearer token if authentication is required
    if (requiresAuth) {
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return useFetch<T>(endpoint, {
      baseURL,
      ...fetchOptions,
      headers,
      // Handle errors globally
      onResponseError({ response }) {
        if (response.status === 401) {
          // Token expired or invalid - redirect to login
          if (process.client) {
            localStorage.removeItem("authToken");
            navigateTo("/auth/login");
          }
        }
      },
    });
  };

  // For immediate API calls (not reactive)
  const apiFetch = async <T>(
    endpoint: string,
    options: RequestInit & { requiresAuth?: boolean; params?: Record<string, any> } = {}
  ): Promise<T> => {
    const { requiresAuth = true, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    if (requiresAuth) {
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    try {
      return await $fetch<T>(endpoint, {
        baseURL,
        ...fetchOptions,
        headers,
        method: fetchOptions.method as any,
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        if (process.client) {
          localStorage.removeItem("authToken");
          navigateTo("/auth/login");
        }
      }
      throw error;
    }
  };

  // Convenience methods for common HTTP methods
  const get = <T>(
    endpoint: string,
    options?: UseFetchOptions<T> & { requiresAuth?: boolean }
  ) => {
    return apiCall<T>(endpoint, { ...options, method: "GET" });
  };

  const post = <T>(
    endpoint: string,
    body?: any,
    options?: UseFetchOptions<T> & { requiresAuth?: boolean }
  ) => {
    return apiCall<T>(endpoint, { ...options, method: "POST", body });
  };

  const put = <T>(
    endpoint: string,
    body?: any,
    options?: UseFetchOptions<T> & { requiresAuth?: boolean }
  ) => {
    return apiCall<T>(endpoint, { ...options, method: "PUT", body });
  };

  const del = <T>(
    endpoint: string,
    options?: UseFetchOptions<T> & { requiresAuth?: boolean }
  ) => {
    return apiCall<T>(endpoint, { ...options, method: "DELETE" });
  };

  // Immediate fetch methods (for actions, not reactive data)
  const fetchGet = <T>(
    endpoint: string,
    options?: RequestInit & { requiresAuth?: boolean; params?: Record<string, any> }
  ) => {
    return apiFetch<T>(endpoint, { ...options, method: "GET" });
  };

  const fetchPost = <T>(
    endpoint: string,
    body?: any,
    options?: RequestInit & { requiresAuth?: boolean }
  ) => {
    return apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  const fetchPut = <T>(
    endpoint: string,
    body?: any,
    options?: RequestInit & { requiresAuth?: boolean }
  ) => {
    return apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  };

  const fetchDelete = <T>(
    endpoint: string,
    options?: RequestInit & { requiresAuth?: boolean }
  ) => {
    return apiFetch<T>(endpoint, { ...options, method: "DELETE" });
  };

  return {
    // Reactive methods (use in components with auto-refresh)
    get,
    post,
    put,
    del,
    // Immediate methods (use in actions/handlers)
    fetchGet,
    fetchPost,
    fetchPut,
    fetchDelete,
  };
};
