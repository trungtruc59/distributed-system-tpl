import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const BRANCH: AppRouteRecordRaw = {
  path: '/branchs',
  name: 'branchs',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'Quản lý chi nhánh',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'list',
      name: 'ListBranchs',
      component: () => import('@/views/branchs/list/index.vue'),
      meta: {
        locale: 'Danh sách chi nhánh',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default BRANCH;
