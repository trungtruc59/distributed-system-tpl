import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const BOOKING: AppRouteRecordRaw = {
    path: '/booking',
    name: 'booking',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.booking',
        requiresAuth: true,
        icon: 'icon-list',
        hideInMenu: true,
        order: 4,
    },
    children: [
        {
            path: 'management',
            name: 'BookingManagement',
            component: () => import('@/views/booking-management/BookingManagement.vue'),
            meta: {
                locale: 'menu.booking.management',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};

export default BOOKING;

