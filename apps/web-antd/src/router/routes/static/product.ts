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
        name: 'ProductCategory',
        path: '/product/category',
        component: () => import('#/views/product/category/index.vue'),
        meta: {
          icon: 'lucide:folder-tree',
          title: $t('page.product.category'),
          ignoreAccess: true,
        },
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
    ],
  },
];

export default routes;
