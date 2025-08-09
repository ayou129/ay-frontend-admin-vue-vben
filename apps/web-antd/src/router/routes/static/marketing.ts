import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:megaphone',
      order: 4,
      title: $t('page.marketing.title'),
      ignoreAccess: true,
    },
    name: 'Marketing',
    path: '/marketing',
    children: [
      {
        meta: {
          icon: 'lucide:ticket',
          title: $t('page.marketing.coupon.title'),
          ignoreAccess: true,
        },
        name: 'Coupon',
        path: '/marketing/coupon',
        children: [
          {
            name: 'CouponList',
            path: '/marketing/coupon/list',
            component: () => import('#/views/marketing/coupon/list/index.vue'),
            meta: {
              icon: 'lucide:ticket-check',
              title: $t('page.marketing.coupon.list'),
              ignoreAccess: true,
            },
          },
          {
            name: 'CouponRecord',
            path: '/marketing/coupon/record',
            component: () =>
              import('#/views/marketing/coupon/record/index.vue'),
            meta: {
              icon: 'lucide:history',
              title: $t('page.marketing.coupon.record'),
              ignoreAccess: true,
            },
          },
        ],
      },
      {
        meta: {
          icon: 'lucide:coins',
          title: $t('page.marketing.points.title'),
          ignoreAccess: true,
        },
        name: 'Points',
        path: '/marketing/points',
        children: [
          {
            name: 'PointsStatistics',
            path: '/marketing/points/statistics',
            component: () =>
              import('#/views/marketing/points/statistics/index.vue'),
            meta: {
              icon: 'lucide:pie-chart',
              title: $t('page.marketing.points.statistics'),
              ignoreAccess: true,
            },
          },
          {
            name: 'PointsProducts',
            path: '/marketing/points/products',
            component: () =>
              import('#/views/marketing/points/products/index.vue'),
            meta: {
              icon: 'lucide:gift',
              title: $t('page.marketing.points.products'),
              ignoreAccess: true,
            },
          },
          {
            name: 'PointsRecord',
            path: '/marketing/points/record',
            component: () =>
              import('#/views/marketing/points/record/index.vue'),
            meta: {
              icon: 'lucide:scroll-text',
              title: $t('page.marketing.points.record'),
              ignoreAccess: true,
            },
          },
          {
            name: 'PointsConfig',
            path: '/marketing/points/config',
            component: () =>
              import('#/views/marketing/points/config/index.vue'),
            meta: {
              icon: 'lucide:wrench',
              title: $t('page.marketing.points.config'),
              ignoreAccess: true,
            },
          },
        ],
      },
    ],
  },
];

export default routes;
