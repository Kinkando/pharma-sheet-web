export interface Pagination {
  limit: number;
  offset: number;
  totalItem: number;
  totalPage: number;
  currentPage: number;
}

export interface Data<T> {
  data: T[];
  metadata: Pagination;
}

export interface PaginationRequest {
  limit: number;
  page: number;
  search?: string;
  sort?: string;
}
