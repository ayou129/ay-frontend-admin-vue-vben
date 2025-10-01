export enum ResourceType {
  Archive = 5, // 压缩包
  Audio = 2, // 音频
  Document = 4, // 文档
  Image = 1, // 图片
  Video = 3, // 视频
}

export enum ResourceUserVisibility {
  Friends = 1, // 好友可见
  Private = 0, // 仅自己
  Public = 2, // 公开
}

// 资源类型
export interface Resource {
  created_at: string;
  file_ext: string;
  file_md5: string;
  file_original_filename: string;
  file_path: string;
  file_size: number;
  file_slug: string;
  folder?: ResourceFolder;
  folder_id: number;
  formatted_size?: string; // 格式化后的文件大小
  id: number;
  is_public: number;
  type: ResourceType;
  updated_at: string;
  user_id: number;
  url: string;
  user_visibility: ResourceUserVisibility;
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
  SkuMainImage = 2, // SKU主图
  SpuCarousel = 1, // SPU轮播图
}

export interface ResourceRelation {
  id?: number;
  resource_id: number;
  relation_id: number; // 关联的ID，例如SPUID，SKUID
  relation_type: ResourceRelationType;
  sort: number;
}
