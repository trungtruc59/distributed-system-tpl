import { isLogin } from '@/utils/auth';

const adminRoutes = [
    {
    path: '/admin',
    redirect: () => {
      return isLogin() ? '/dashboard' : '/login';
    },
  },
];

export default adminRoutes;