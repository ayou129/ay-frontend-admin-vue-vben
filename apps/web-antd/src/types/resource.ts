export enum ResourceType {
  Audio = 2, // 音频
  Image = 1, // 图片
  Video = 3, // 视频
}

// 资源类型
export interface Resource {
  id: number;
  folder_id: number;
  type: ResourceType;
  original_filename: string;
  save_slug: string;
  ext: string;
  save_path: string;
  size: number;
  mime_type: string;
  md5: string;
  created_at: string;
  updated_at: string;
  url?: string; // 资源预览URL
}

// 资源文件夹类型
export interface ResourceFolder {
  id: number;
  name: string;
  parent_id: number;
  created_at: string;
  updated_at: string;
  children?: ResourceFolder[]; // 子文件夹列表
}

// 资源文件夹更新参数
export interface ResourceFolderUpdateParams {
  id: number;
  name: string;
  parent_id: number;
}

// 创建资源请求
export interface ResourceCreateParams {
  files: File[];
  folder_id: number;
}

export enum ResourceRelationType {
  Sku = 3, // SKU相关
  SpuDetailImage = 2, // SPU详情图
  SpuMainImage = 1, // SPU主图
}

export interface ResourceRelation {
  id?: number;
  resource_id: number;
  relation_id: number; // 关联的ID，例如SPUID，SKUID
  relation_type: ResourceRelationType;
  sort: number;
}
