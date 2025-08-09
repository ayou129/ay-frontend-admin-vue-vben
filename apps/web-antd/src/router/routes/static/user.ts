import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:users',
      order: 1,
      title: $t('page.user.title'),
      ignoreAccess: true,
    },
    name: 'User',
    path: '/user',
    children: [
      {
        name: 'UserStatistics',
        path: '/user/statistics',
        component: () => import('#/views/user/statistics/index.vue'),
        meta: {
          icon: 'lucide:bar-chart-3',
          title: $t('page.user.statistics'),
          ignoreAccess: true,
        },
      },
      {
        name: 'UserManagement',
        path: '/user/management',
        component: () => import('#/views/user/management/index.vue'),
        meta: {
          icon: 'lucide:user-cog',
          title: $t('page.user.management'),
          ignoreAccess: true,
        },
      },
      {
        name: 'UserLevel',
        path: '/user/level',
        component: () => import('#/views/user/level/index.vue'),
        meta: {
          icon: 'lucide:badge',
          title: $t('page.user.level'),
          ignoreAccess: true,
        },
      },
      {
        name: 'UserConfig',
        path: '/user/config',
        component: () => import('#/views/user/config/index.vue'),
        meta: {
          icon: 'lucide:settings',
          title: $t('page.user.config'),
          ignoreAccess: true,
        },
      },
    ],
  },
];

export default routes;
