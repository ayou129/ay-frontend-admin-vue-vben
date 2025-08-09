import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:shopping-cart',
      order: 3,
      title: $t('page.order.title'),
      ignoreAccess: true,
    },
    name: 'Order',
    path: '/order',
    children: [
      {
        name: 'OrderStatistics',
        path: '/order/statistics',
        component: () => import('#/views/order/statistics/index.vue'),
        meta: {
          icon: 'lucide:trending-up',
          title: $t('page.order.statistics'),
          ignoreAccess: true,
        },
      },
      {
        name: 'OrderList',
        path: '/order/list',
        component: () => import('#/views/order/list/index.vue'),
        meta: {
          icon: 'lucide:list',
          title: $t('page.order.list'),
          ignoreAccess: true,
        },
      },
      {
        name: 'OrderConfig',
        path: '/order/config',
        component: () => import('#/views/order/config/index.vue'),
        meta: {
          icon: 'lucide:settings-2',
          title: $t('page.order.config'),
          ignoreAccess: true,
        },
      },
    ],
  },
];

export default routes;
