import type { GoPageModel } from '@ay-shared-core/types/api';
import type { PageQueryDTO } from '@ay-shared-core/utils/page_query';

import type {
  CreateResourceFolderDTO,
  ResourceFolderModel,
  ResourceModel,
  UpdateResourceFolderDTO,
} from '#/types/resource';

import { apiPrefix } from '#/api/config';
import { http } from '#/api/request';

/**
 * 获取资源目录树
 */
export async function getResourceFolderTree() {
  return http.get<ResourceFolderModel[]>(
    `${apiPrefix}/admin/resource/folders/tree`,
  );
}

/**
 * 获取资源列表（分页）
 */
export async function getResourceList(params: PageQueryDTO) {
  const response = await http.post<GoPageModel<ResourceModel>>(
    `${apiPrefix}/admin/resource/list/page`,
    params,
  );

  return {
    items: response.list,
    total: response.total,
  };
}

/**
 * 获取资源文件详情
 */
export async function getResourceFileDetail(id: number) {
  return http.get<ResourceModel>(`${apiPrefix}/admin/resource/files/${id}`);
}

/**
 * 批量上传文件
 */
export async function uploadResourceFiles(data: FormData) {
  return http.post<ResourceModel[]>(
    `${apiPrefix}/admin/resource/files`,
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
  return http.delete(`${apiPrefix}/admin/resource/files`, {
    data: { ids },
  });
}

/**
 * 移动文件到其他目录
 */
export async function moveResourceFile(id: number, folderId: number) {
  return http.put<ResourceModel>(
    `${apiPrefix}/admin/resource/files/${id}/folder`,
    {
      folder_id: folderId,
    },
  );
}

/**
 * 创建资源目录
 */
export async function createResourceFolder(data: CreateResourceFolderDTO) {
  return http.post<ResourceFolderModel>(
    `${apiPrefix}/admin/resource/folders`,
    data,
  );
}

/**
 * 更新资源目录
 */
export async function updateResourceFolder(
  id: number,
  data: UpdateResourceFolderDTO,
) {
  return http.put<ResourceFolderModel>(
    `${apiPrefix}/admin/resource/folders/${id}`,
    data,
  );
}

/**
 * 删除资源目录
 */
export async function deleteResourceFolder(id: number) {
  return http.delete(`${apiPrefix}/admin/resource/folders/${id}`);
}
