import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:package',
      order: 2,
      title: $t('page.product.title'),
      ignoreAccess: true,
    },
    name: 'Product',
    path: '/product',
    children: [
      {
        meta: {
          icon: 'lucide:bar-chart-3',
          title: $t('page.product.statistics.title'),
          ignoreAccess: true,
        },
        name: 'ProductStatistics',
        path: '/product/statistics',
        children: [
          {
            name: 'ProductOverview',
            path: '/product/statistics/overview',
            component: () => import('#/views/product/statistics/overview.vue'),
            meta: {
              icon: 'lucide:pie-chart',
              title: $t('page.product.statistics.overview'),
              ignoreAccess: true,
            },
          },
          {
            name: 'ProductRanking',
            path: '/product/statistics/ranking',
            component: () => import('#/views/product/statistics/ranking.vue'),
            meta: {
              icon: 'lucide:trending-up',
              title: $t('page.product.statistics.ranking'),
              ignoreAccess: true,
            },
          },
        ],
      },
      {
        name: 'ProductManagement',
        path: '/product/management',
        component: () => import('#/views/product/management/index.vue'),
        meta: {
          icon: 'lucide:package-2',
          title: $t('page.product.management'),
          ignoreAccess: true,
        },
      },
      {
        name: 'ProductCategory',
        path: '/product/category',
        component: () => import('#/views/product/category/index.vue'),
        meta: {
          icon: 'lucide:folder-tree',
          title: $t('page.product.category'),
          ignoreAccess: true,
        },
      },
    ],
  },
];

export default routes;
