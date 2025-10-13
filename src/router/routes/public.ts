const publicRoutes = [
  {
    path: '/',
    component: () => import('@/layout/public-layout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/template/index.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/template/about.vue'),
        meta: { requiresAuth: false },
      },
    ],
  },
];

export default publicRoutes;
