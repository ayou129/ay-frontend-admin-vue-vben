import type {
  CustomPageResponse,
  RequestFilterQuery,
  RequestFilterSortOption,
} from '#/types';

export const EMPTY_CUSTOM_PAGE_RESPONSE: Omit<
  CustomPageResponse<any>,
  'items'
> & {
  filter_sort_option: RequestFilterSortOption;
  filters: RequestFilterQuery[];
  items: any[];
} = {
  items: [],
  page: 1,
  page_size: 10,
  total: 0,
  total_pages: 0,
  has_more: false,
  filters: [],
  filter_sort_option: { sort_field: 'id', sort_order: 'desc' },
};
