/**
 * API client configuration and base utilities for Apokria frontend.
 * Handles HTTP requests, response formatting, and error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  timestamp: string;
  errors?: string[];
  error_code?: string;
}

class ApiError extends Error {
  public statusCode: number;
  public errorCode?: string;
  public errors?: string[];

  constructor(message: string, statusCode: number, errorCode?: string, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      throw new ApiError('Invalid response format', response.status);
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || data.status === 'error') {
      throw new ApiError(
        data.message || 'Request failed',
        response.status,
        data.error_code,
        data.errors
      );
    }

    return data.data as T;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 500);
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', endpoint, null, options);
  }

  async post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('POST', endpoint, body, options);
  }

  async put<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PUT', endpoint, body, options);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', endpoint, null, options);
  }

  async patch<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PATCH', endpoint, body, options);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export { ApiError };
export type { ApiResponse };