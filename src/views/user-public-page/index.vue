<template>
    <a-layout class="user-public--page-layout">
        <PublicHeader />
        <a-layout-content :class="branchStore.isLoading ? ' user-public--page-loading' : 'user-public--content'">
            <a-spin v-if="branchStore.isLoading" :loading="true" dot>
                <div style="width: 100vw; height: 30vh; margin: auto"></div>
            </a-spin>
            <BranchCard v-for="b in branches" :key="b.id" :branch="b" />
        </a-layout-content>
        <!-- <a-layout-footer class="user-public--footer">Footer</a-layout-footer> -->
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
    }

    .user-public--page-loading {
        display: flex;
        justify-content: center;
        height: 20vh;
    }

    .user-public--content {
        display: flex;
        padding: 1rem;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: flex-start;
        max-width: calc(470px * 3 + 4rem); /* 470px là chiều rộng của BranchCard */
        margin: auto;
    }
</style>
