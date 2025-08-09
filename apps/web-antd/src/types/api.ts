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
