import type { ResourceFolder } from '#/types/resource';

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
 * 创建资源目录
 */
export async function createResourceFolder(data: {
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
    name?: string;
    parent_id?: number;
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
