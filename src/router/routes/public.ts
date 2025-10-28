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
            {
                path: 'payment',
                name: 'payment',
                component: () => import('@/views/booking-payment-page/BookingPaymentPage.vue'),
                meta: { requiresAuth: false },
            },
            {
                path: 'user-profile',
                name: 'user-profile',
                component: () => import('@/views/user-public-profile/UserPublicProfile.vue'),
                meta: { requiresAuth: false },
            },
        ],
    },
];

export default publicRoutes;
