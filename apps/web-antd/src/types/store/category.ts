export interface CategoryModel {
  children?: CategoryModel[];
  created_at: string;
  id: number;
  name: string;
  parent_id: number;
  updated_at: string;
}

// 创建分类 DTO
export interface CreateCategoryDTO {
  name: string;
  parent_id?: number;
}

// 更新分类 DTO
export interface UpdateCategoryDTO {
  name?: string;
  parent_id?: number;
}
