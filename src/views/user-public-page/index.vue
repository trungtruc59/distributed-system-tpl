<template>
    <a-layout class="user-public--page-layout">
        <PublicHeader />
        <a-layout-content class="user-public--content">
            <a-spin :loading="branchStore.isLoading === true" dot>
                <div v-if="branchStore.isLoading" style="width: 100vw"></div>
                <BranchCard v-for="b in branches" :key="b.id" :branch="b" />
            </a-spin>
        </a-layout-content>
        <a-layout-footer class="user-public--footer">Footer</a-layout-footer>
    </a-layout>
</template>

<script setup lang="ts">
    import useBranchStore from '@/store/modules/branches';
    import { onMounted, computed } from 'vue';
    import PublicHeader from './components/public-page-header/index.vue';
    import BranchCard from './components/branch-infomation-card/BranchCard.vue';

    const branchStore = useBranchStore();

    const branches = computed(() => {
        return branchStore.branches;
    });
    onMounted(async () => {
        await branchStore.getAllBranchWithParams();
    });
</script>

<style>
    .user-public--page-layout {
        display: flex;
        flex-direction: column;
        height: 100dvh;
    }

    .user-public--content {
        display: flex;
        flex: 1;
        padding: 1rem;
    }
</style>
