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
        {
            path: 'add',
            name: 'BranchsAdd',
            component: () => import('@/views/branchs/list/add.vue'),
            meta: {
                locale: 'Thêm chi nhánh',
                hideInMenu: true,
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'courts-management',
            name: 'court-listing',
            component: () => import('@/views/court-management/CourtManagement.vue'),
            meta: {
                locale: 'Danh sách sân',
                requiresAuth: true,
                hideChildrenInMenu: true,
                roles: ['*'],
            },
        },
        {
            path: 'courts-management/create',
            name: 'court-create',
            component: () => import('@/views/court-management/AddCourtPage.vue'),
            meta: {
                locale: 'Thêm sân mới',
                hideInMenu: true,
                requiresAuth: true,
                activeMenu: 'court-listing',
                roles: ['*'],
            },
        },
        {
            path: 'courts-management/edit',
            name: 'court-edit',
            component: () => import('@/views/court-management/AddCourtPage.vue'),
            meta: {
                locale: 'Chỉnh sửa thông tin sân',
                hideInMenu: true,
                requiresAuth: true,
                activeMenu: 'court-listing',
                roles: ['*'],
            },
        },
    ],
};

export default BRANCH;
