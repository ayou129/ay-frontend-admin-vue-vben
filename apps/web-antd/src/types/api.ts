// 导出一个 ApiResponse 的类型
export interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
}

// export interface CustomPageResponse<T> {
//   items: T[];
//   page: number;
//   page_size: number;
//   total: number;
//   total_pages: number;
//   has_more: boolean;
// }

export interface PhpPageResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: null | string;
  path: string;
  per_page: number;
  prev_page_url: null | string;
  to: number;
  total: number;
}
