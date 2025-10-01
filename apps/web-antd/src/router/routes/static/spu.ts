import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:package',
      order: 2,
      title: $t('page.spu.title'),
      ignoreAccess: true,
    },
    name: 'Spu',
    path: '/spu',
    children: [
      {
        name: 'SpuStatistics',
        path: '/spu/statistics',
        component: () => import('#/views/spu/statistics/index.vue'),
        meta: {
          icon: 'lucide:bar-chart-3',
          title: $t('page.spu.statistics'),
          ignoreAccess: true,
        },
      },
      {
        name: 'SpuManagement',
        path: '/spu/management',
        component: () => import('#/views/spu/management/index.vue'),
        meta: {
          icon: 'lucide:package-2',
          title: $t('page.spu.management'),
          ignoreAccess: true,
        },
      },
      {
        name: 'SpuCategory',
        path: '/spu/category',
        component: () => import('#/views/spu/category/index.vue'),
        meta: {
          icon: 'lucide:folder-tree',
          title: $t('page.spu.category'),
          ignoreAccess: true,
        },
      },
    ],
  },
];

export default routes;
