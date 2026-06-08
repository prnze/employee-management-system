import { TemplateRef } from '@angular/core';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  visible?: boolean;
  width?: string;
  cellTemplate?: TemplateRef<any>;
  headerClass?: string;
  cellClass?: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
