<template>
  <div class="container">
    <Breadcrumb :routes="breadcrumbRoutes" />
    <a-card class="general-card" :title="'Thêm tài khoản mới'">
      <a-row class="wrapper">
        <a-col :span="24">
          <BasicInformation />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import Breadcrumb from '@/components/breadcrumb/index.vue';
  import BasicInformation from './components/basic-information.vue';

  const breadcrumbRoutes = [
    { path: '/dashboard', label: 'Trang chủ' },
    { path: '/user/list', label: 'Danh sách người dùng' },
    { path: '/user/add', label: 'Thêm tài khoản' },
  ]
</script>

<script lang="ts">
  export default {
    name: 'Setting',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .wrapper {
    padding: 20px 0 0 20px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
