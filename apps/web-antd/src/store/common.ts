import type { GoPageModel } from '@ay-shared-core/types/api';

import type { FilterQuery, FilterSortOption } from '#/types';

export const EMPTY_GO_PAGE_RESPONSE: Omit<GoPageModel<any>, 'list'> & {
  filters: FilterQuery[];
  list: any[];
  sort_option: FilterSortOption;
} = {
  list: [],
  page: 1,
  pageSize: 20,
  total: 0,
  filters: [],
  sort_option: { sort_field: 'id', sort_order: 'desc' },
};
