import type {
  PhpPageResponse,
  RequestFilterQuery,
  RequestFilterSortOption,
} from '#/types';

export const EMPTY_PHP_PAGE_RESPONSE: Omit<PhpPageResponse<any>, 'data'> & {
  data: any[];
  filter_sort_option: RequestFilterSortOption;
  filters: RequestFilterQuery[];
} = {
  data: [],
  current_page: 1,
  first_page_url: '',
  from: 0,
  last_page: 1,
  last_page_url: '',
  next_page_url: null,
  path: '',
  per_page: 10,
  prev_page_url: null,
  to: 0,
  total: 0,
  filters: [],
  filter_sort_option: { sort_field: 'id', sort_order: 'desc' },
};
