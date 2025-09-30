import type { Resource } from '#/types/resource';

import { apiPrefix } from '#/api/core/config';
import { requestClient } from '#/api/request';

/**
 * 获取目录下的资源文件列表
 */
export async function getResourceFiles(folderId: number) {
  return requestClient.get<{ list: Resource[] }>(
    `${apiPrefix}/resource/folders/${folderId}/files`,
  );
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
