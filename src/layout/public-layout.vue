<template>
    <a-layout class="public-layout flex flex-column">
        <PageHeader />
        <a-layout-content class="public-content flex-1">
            <router-view v-slot="{ Component, route }">
                <component :is="Component" v-if="route.meta.ignoreCache" :key="route.fullPath" />
                <keep-alive v-else :include="cacheList">
                    <component :is="Component" :key="route.fullPath" />
                </keep-alive>
            </router-view>
        </a-layout-content>
    </a-layout>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';
    import { useTabBarStore } from '@/store';
    import PageHeader from '@/components/public-page-header/PageHeader.vue';

    const tabBarStore = useTabBarStore();
    const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less">
    .public-layout {
        width: 100%;
        height: 100dvh;
        overflow: hidden;
    }

    .public-header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 60px;
        padding: 0;
    }
</style>
