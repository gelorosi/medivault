export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}
