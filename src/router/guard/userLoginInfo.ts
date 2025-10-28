import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';

export default function setupUserLoginInfoGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        NProgress.start();
        const userStore = useUserStore();
        // Hydrate thông tin từ token khi mới vào trang và có token/thiếu role
        if (userStore.isLogin) {
            await userStore.hydrateFromToken();
        }
        if (userStore.isLogin) {
            if (userStore.role) {
                // Nếu đã đăng nhập:
                // - Admin vào trang public hoặc login -> chuyển sang dashboard
                if (userStore.role === 'admin' && (to.name === 'login' || to.name === 'home')) {
                    next({ name: 'dashboard' });
                    return;
                }
                // - User vào trang admin (requiresAuth true + roles admin) bị guard permission xử lý
                next();
            } else {
                try {
                    await userStore;
                    next();
                } catch (error) {
                    await userStore.logout();
                    next({
                        name: 'login',
                        query: {
                            redirect: to.name,
                            ...to.query,
                        } as LocationQueryRaw,
                    });
                }
            }
        } else {
            if (to.name === 'login') {
                next();
                return;
            }
            if (to.meta.requiresAuth === false) {
                next();
                return;
            }

            next({
                name: 'login',
                query: {
                    redirect: to.name,
                    ...to.query,
                } as LocationQueryRaw,
            });
        }
    });
}
