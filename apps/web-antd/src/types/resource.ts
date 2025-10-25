export enum ResourceType {
  Archive = 5, // 压缩包
  Audio = 2, // 音频
  Document = 4, // 文档
  Image = 1, // 图片
  Video = 3, // 视频
}

export const resourceTypeTextMap: Record<ResourceType, string> = {
  [ResourceType.Image]: '图片',
  [ResourceType.Audio]: '音频',
  [ResourceType.Video]: '视频',
  [ResourceType.Document]: '文档',
  [ResourceType.Archive]: '压缩包',
};

export const resourceTypeColorMap: Record<ResourceType, string> = {
  [ResourceType.Image]: 'green',
  [ResourceType.Audio]: 'blue',
  [ResourceType.Video]: 'purple',
  [ResourceType.Document]: 'orange',
  [ResourceType.Archive]: 'gray',
};

export enum ResourceUserVisibility {
  Friends = 1, // 好友可见
  Private = 0, // 仅自己
  Public = 2, // 公开
}

export const resourceUserVisibilityTextMap: Record<
  ResourceUserVisibility,
  string
> = {
  [ResourceUserVisibility.Private]: '仅自己',
  [ResourceUserVisibility.Friends]: '好友可见',
  [ResourceUserVisibility.Public]: '公开',
};

export const resourceUserVisibilityColorMap: Record<
  ResourceUserVisibility,
  string
> = {
  [ResourceUserVisibility.Private]: 'red',
  [ResourceUserVisibility.Friends]: 'orange',
  [ResourceUserVisibility.Public]: 'green',
};

// 资源模型
export interface ResourceModel {
  created_at: string;
  file_ext: string;
  file_md5: string;
  file_original_filename: string;
  file_path: string;
  file_size: number;
  file_slug: string;
  folder_id: number;
  formatted_size?: string; // 格式化后的文件大小（前端计算）
  id: number;
  is_public: number;
  type: ResourceType;
  updated_at: string;
  user_id: number;
  url: string;
  user_visibility: ResourceUserVisibility;
}

// 资源文件夹模型
export interface ResourceFolderModel {
  id: number;
  name: string;
  parent_id: number;
  created_at: string;
  updated_at: string;
  children?: ResourceFolderModel[]; // 子文件夹列表
}

// 创建资源文件夹 DTO
export interface CreateResourceFolderDTO {
  name: string;
  parent_id?: number;
  description?: string;
}

// 更新资源文件夹 DTO
export interface UpdateResourceFolderDTO {
  name?: string;
  parent_id?: number;
  description?: string;
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
