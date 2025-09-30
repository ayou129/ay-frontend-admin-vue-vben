export interface Category {
  children?: Category[];
  created_at: string;
  id: number;
  name: string;
  parent_id: number;
  updated_at: string;
}
