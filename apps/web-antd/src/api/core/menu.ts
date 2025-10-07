import type { RouteRecordStringComponent } from '@vben/types';

import { http } from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return http.get<RouteRecordStringComponent[]>('/menu/all');
}
