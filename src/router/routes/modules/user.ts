import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
    path: '/user',
    name: 'user',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.user',
        icon: 'icon-user',
        requiresAuth: true,
        order: 2,
    },
    children: [
        {
            path: 'list',
            name: 'List',
            component: () => import('@/views/user/list/index.vue'),
            meta: {
                locale: 'menu.user.list',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'add',
            name: 'UserAdd',
            component: () => import('@/views/user/add/index.vue'),
            meta: {
                locale: 'menu.user.add',
                hideInMenu: true,
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'edit/:id',
            name: 'UserEdit',
            component: () => import('@/views/user/add/edit.vue'),
            meta: {
                locale: 'menu.user.edit',
                hideInMenu: true,
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'info',
            name: 'Info',
            component: () => import('@/views/user/info/index.vue'),
            meta: {
                locale: 'menu.user.info',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'setting',
            name: 'Setting',
            component: () => import('@/views/user/setting/index.vue'),
            meta: {
                locale: 'menu.user.setting',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};

export default USER;
