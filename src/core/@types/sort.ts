export type OrderSequence = 'asc' | 'desc' | 'ASC' | 'DESC';

export interface SortOption {
  value: string;
  label: string;
}

export interface OrderOption {
  label: (sortBy: string) => string;
  value: OrderSequence;
}
