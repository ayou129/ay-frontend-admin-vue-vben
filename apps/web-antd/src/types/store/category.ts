export interface CategoryModel {
  children?: CategoryModel[];
  created_at: string;
  id: number;
  name: string;
  parent_id: number;
  updated_at: string;
}
