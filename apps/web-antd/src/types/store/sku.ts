export interface Sku {
  id: number;
  spu_id: number;
  name: string;
  code: string;
  price: number; // 价格，单位：分
  stock_count: number;
  specification?: string;
  created_at: string;
  updated_at: string;
}
