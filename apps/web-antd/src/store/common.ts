import type { CustomPageResponse } from '#/types';

export const EMPTY_CUSTOM_PAGE_RESPONSE: Omit<
  CustomPageResponse<any>,
  'items'
> & { items: any[] } = {
  items: [],
  page: 1,
  page_size: 10,
  total: 0,
  total_pages: 0,
  has_more: false,
};
