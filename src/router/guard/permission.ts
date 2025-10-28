import type { Router, RouteRecordNormalized } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { useUserStore, useAppStore } from '@/store';
import { appRoutes } from '../routes';
import { WHITE_LIST, NOT_FOUND } from '../constants';

export default function setupPermissionGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        const appStore = useAppStore();
        const userStore = useUserStore();
        const Permission = usePermission();
        const permissionsAllow = Permission.accessRouter(to);

        if (appStore.menuFromServer) {
            if (!appStore.appAsyncMenus.length && !WHITE_LIST.find((el) => el.name === to.name)) {
                await appStore.fetchServerMenuConfig();
            }

            const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST];
            let exist = false;
            while (serverMenuConfig.length && !exist) {
                const element = serverMenuConfig.shift();
                if (element?.name === to.name) exist = true;
                if (element?.children) {
                    serverMenuConfig.push(...(element.children as unknown as RouteRecordNormalized[]));
                }
            }

            if (exist && permissionsAllow) {
                next();
            } else {
                next(NOT_FOUND);
            }
            NProgress.done();
            return;
        }

        // Nếu là user và route không phải public (requiresAuth !== false) thì về home
        if (userStore.role === 'user' && to.meta.requiresAuth !== false) {
            next({ name: 'home' });
            NProgress.done();
            return;
        }

        if (permissionsAllow) {
            next();
            NProgress.done();
            return;
        }

        if (userStore.role === 'user') {
            next({ name: 'home' });
            NProgress.done();
            return;
        }

        if (userStore.role === 'admin') {
            const destination = Permission.findFirstPermissionRoute(appRoutes, userStore.role) || {
                name: 'dashboard',
            };
            next(destination);
            NProgress.done();
            return;
        }

        next(NOT_FOUND);
        NProgress.done();
    });
}
