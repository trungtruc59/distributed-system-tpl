<template>
    <a-menu
        v-model:collapsed="collapsed"
        v-model:open-keys="openKeys"
        :mode="topMenu ? 'horizontal' : 'vertical'"
        :show-collapse-button="appStore.device !== 'mobile'"
        :auto-open="false"
        :selected-keys="selectedKey"
        :auto-open-selected="true"
        :level-indent="34"
        style="height: 100%; width: 100%"
        @collapse="setCollapse"
    >
        <MenuItem v-for="item in menuTree" :key="item.name" :item="item" @select="goto" />
    </a-menu>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
    import type { RouteMeta } from 'vue-router';
    import { useAppStore } from '@/store';
    import { listenerRouteChange } from '@/utils/route-listener';
    import { openWindow, regexUrl } from '@/utils';
    import useMenuTree from './use-menu-tree';

    const { t } = useI18n();
    const appStore = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const { menuTree } = useMenuTree();

    const collapsed = computed({
        get() {
            if (appStore.device === 'desktop') return appStore.menuCollapse;
            return false;
        },
        set(value: boolean) {
            appStore.updateSettings({ menuCollapse: value });
        },
    });

    const topMenu = computed(() => appStore.topMenu);
    const openKeys = ref<string[]>([]);
    const selectedKey = ref<string[]>([]);

    function goto(item: RouteRecordRaw) {
        if (regexUrl.test(item.path)) {
            openWindow(item.path);
            selectedKey.value = [item.name as string];
            return;
        }
        const { hideInMenu, activeMenu } = item.meta as RouteMeta;
        if (route.name === item.name && !hideInMenu && !activeMenu) {
            selectedKey.value = [item.name as string];
            return;
        }
        router.push({ name: item.name as string });
    }

    function findMenuOpenKeys(target: string) {
        const result: string[] = [];
        let isFind = false;
        const backtrack = (item: RouteRecordRaw, keys: string[]) => {
            if (item.name === target) {
                isFind = true;
                result.push(...keys);
                return;
            }
            if (item.children?.length) {
                item.children.forEach((el) => backtrack(el, [...keys, el.name as string]));
            }
        };
        menuTree.value.forEach((el: RouteRecordRaw) => {
            if (isFind) return;
            backtrack(el, [el.name as string]);
        });
        return result;
    }

    listenerRouteChange((newRoute) => {
        const { requiresAuth, activeMenu, hideInMenu } = newRoute.meta;
        if (requiresAuth && (!hideInMenu || activeMenu)) {
            const menuOpenKeys = findMenuOpenKeys((activeMenu || newRoute.name) as string);
            const keySet = new Set([...menuOpenKeys, ...openKeys.value]);
            openKeys.value = [...keySet];
            selectedKey.value = [activeMenu || menuOpenKeys[menuOpenKeys.length - 1]] as string[];
        }
    }, true);

    function setCollapse(val: boolean) {
        if (appStore.device === 'desktop') appStore.updateSettings({ menuCollapse: val });
    }

    // Local recursive component
    const MenuItem = {
        name: 'MenuItem',
        props: {
            item: {
                type: Object as () => RouteRecordRaw,
                required: true,
            },
        },
        emits: ['select'],
        setup(props: { item: RouteRecordRaw }, { emit }: { emit: (e: 'select', item: RouteRecordRaw) => void }) {
            function handleClick(item: RouteRecordRaw) {
                emit('select', item);
            }
            return { t, handleClick };
        },
        template: `
    <a-sub-menu v-if="item.children && item.children.length" :key="item.name">
      <template #icon>
        <component v-if="item.meta && item.meta.icon" :is="item.meta.icon" />
      </template>
      <template #title>{{ t(item.meta?.locale || '') }}</template>
      <MenuItem v-for="child in item.children" :key="child.name" :item="child" @select="$emit('select', $event)" />
    </a-sub-menu>
    <a-menu-item v-else :key="item.name" @click="handleClick(item)">
      <template #icon>
        <component v-if="item.meta && item.meta.icon" :is="item.meta.icon" />
      </template>
      {{ t(item.meta?.locale || '') }}
    </a-menu-item>
  `,
    };
</script>

<style lang="less" scoped>
    :deep(.arco-menu-inner) {
        .arco-menu-inline-header {
            display: flex;
            align-items: center;
        }

        .arco-icon {
            &:not(.arco-icon-down) {
                font-size: 18px;
            }
        }
    }
</style>
