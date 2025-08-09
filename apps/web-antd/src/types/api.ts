// 导出一个 ApiResponse 的类型
export interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
}

export interface CustomPageResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_more: boolean;
}

// CustomPageResponse 的空状态常量
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
