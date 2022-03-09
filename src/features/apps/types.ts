import { FullAppData, FilterValue } from '@openchannel/react-common-components';

export interface MappedFilter extends FilterValue {
  valueId?: string;
  filterId?: string;
}

export interface Gallery extends MappedFilter {
  data: FullAppData[];
}

export interface Searchable<T> {
  data: T[];
  pageNumber: number;
  limit: number;
  pages: number;
  sort?: string;
}
