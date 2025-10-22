<template>
  <a-layout class="user-public--page-layout">
    <PublicHeader />
    <a-layout-content class="user-public--content">
      <a-spin :loading="branchStore.loading === true" dot>
        <div v-if="branchStore.loading" style="width: 100vw"></div>
        <div v-for="b in branches" :key="b.id">{{ b.name }}</div>
      </a-spin>
    </a-layout-content>
    <a-layout-footer class="user-public--footer">Footer</a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
  import useBranchStore from '@/store/modules/branches';
  import { ref, onMounted, computed } from 'vue';
  import PublicHeader from './components/public-page-header/index.vue';

  const branchStore = useBranchStore();

  const branches = computed(() => {
    return branchStore.branches;
  });
  onMounted(async () => {
    console.log(branchStore.loading);
    await branchStore.getAllBranchWithParams();
    console.log(branchStore.loading);
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
  }
</style>
