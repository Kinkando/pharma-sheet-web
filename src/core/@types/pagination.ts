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
