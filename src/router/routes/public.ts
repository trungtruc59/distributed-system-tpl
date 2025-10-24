const publicRoutes = [
    {
        path: '/',
        component: () => import('@/layout/public-layout.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@/views/user-public-page/index.vue'),
                meta: { requiresAuth: false },
            },
            {
                path: 'schedule',
                name: 'schedule',
                component: () => import('@/views/booking-schedule/BookingSchedule.vue'),
                meta: { requiresAuth: false },
            },
        ],
    },
];

export default publicRoutes;
