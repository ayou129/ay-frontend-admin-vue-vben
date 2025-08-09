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

// 分页查询参数
export interface RequestGetPageQuery {
  page: number;
  page_size: number;
  // 其他字段作为关键词搜索，如 phone?: string, real_name?: string 等
  [key: string]: any;
}
