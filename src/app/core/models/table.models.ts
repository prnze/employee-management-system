export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  visible?: boolean;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
