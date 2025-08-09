// 导出一个 ApiResponse 的类型
export interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
}
