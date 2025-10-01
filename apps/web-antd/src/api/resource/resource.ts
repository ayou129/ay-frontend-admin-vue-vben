import type { PhpPageResponse } from '#/types';
import type { Resource, ResourceFolder } from '#/types/resource';
import type { RequestGetPageQuery } from '#/utils/filter';

import { apiPrefix } from '#/api/core/config';
import { requestClient } from '#/api/request';

/**
 * 获取资源目录树
 */
export async function getResourceFolderTree() {
  return requestClient.get<{ list: ResourceFolder[] }>(
    `${apiPrefix}/resource/folders/tree`,
  );
}

/**
 * 获取目录下的资源文件列表
 */
export async function getResourceFiles(folderId: number) {
  return requestClient.get<{ list: Resource[] }>(
    `${apiPrefix}/resource/folders/${folderId}/files`,
  );
}

/**
 * 获取资源列表（分页）
 */
export async function getResourceList(params: RequestGetPageQuery) {
  const response = await requestClient.get<PhpPageResponse<Resource>>(
    `${apiPrefix}/resource/list/page`,
    {
      params: {
        page: params.page,
        page_size: params.page_size,
        filters: params.filters,
        filter_sort_option: params.filter_sort_option,
      },
    },
  );

  return {
    items: response.data,
    total: response.total,
  };
}

/**
 * 获取资源文件详情
 */
export async function getResourceFileDetail(id: number) {
  return requestClient.get<Resource>(`${apiPrefix}/resource/files/${id}`);
}

/**
 * 批量上传文件
 */
export async function uploadResourceFiles(data: FormData) {
  return requestClient.post<{ list: Resource[] }>(
    `${apiPrefix}/resource/files`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

/**
 * 批量删除文件
 */
export async function deleteResourceFiles(ids: number[]) {
  return requestClient.delete(`${apiPrefix}/resource/files`, {
    data: { ids },
  });
}

/**
 * 移动文件到其他目录
 */
export async function moveResourceFile(id: number, folderId: number) {
  return requestClient.put<Resource>(
    `${apiPrefix}/resource/files/${id}/folder`,
    { folder_id: folderId },
  );
}

/**
 * 创建资源目录
 */
export async function createResourceFolder(data: {
  description?: string;
  name: string;
  parent_id?: number;
}) {
  return requestClient.post<ResourceFolder>(
    `${apiPrefix}/resource/folders`,
    data,
  );
}

/**
 * 更新资源目录
 */
export async function updateResourceFolder(
  id: number,
  data: {
    description?: string;
    name?: string;
  },
) {
  return requestClient.put<ResourceFolder>(
    `${apiPrefix}/resource/folders/${id}`,
    data,
  );
}

/**
 * 删除资源目录
 */
export async function deleteResourceFolder(id: number) {
  return requestClient.delete(`${apiPrefix}/resource/folders/${id}`);
}
