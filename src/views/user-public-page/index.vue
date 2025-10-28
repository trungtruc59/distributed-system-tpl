<template>
    <a-layout class="user-public--page-layout">
        <PublicHeader />
        <a-layout-content :class="branchStore.isLoading ? ' user-public--page-loading' : 'user-public--content'">
            <a-spin v-if="branchStore.isLoading" :loading="true" dot>
                <div style="width: 96vw; height: 30vh; margin: auto"></div>
            </a-spin>
            <a-scrollbar v-if="!branchStore.isLoading" style="height: calc(100dvh - 64px); overflow: auto; width: 100%">
                <div class="user-public--container">
                    <BranchCard v-for="b in branches" :key="b.id" :branch="b" />
                </div>
            </a-scrollbar>
        </a-layout-content>
        <!-- <a-layout-footer class="user-public--footer">Footer</a-layout-footer> -->
    </a-layout>
</template>

<script setup lang="ts">
    import { onMounted, computed } from 'vue';
    import useBranchStore from '@/store/modules/branches';
    import PublicHeader from './components/public-page-header/PageHeader.vue';
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

    .user-public--page-loading {
        display: flex;
        justify-content: center;
        height: 20vh;
    }

    .user-public--content {
        display: flex;
        justify-content: center;
        flex: 1;
        overflow: hidden;
    }
    .user-public--container {
        display: flex;
        padding: 1rem;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        /* width: max-content; */
        margin: auto;
        max-width: calc(470px * 3 + 4rem); /* 470px là chiều rộng của BranchCard */
    }
</style>
