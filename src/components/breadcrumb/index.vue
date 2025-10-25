<template>
  <a-breadcrumb class="container-breadcrumb" :routes="routes">
    <template #item-render="{ route }">
      <router-link :to="route.path">
        {{ route.label }}
      </router-link>
    </template>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

// Định nghĩa props truyền vào
defineProps({
  routes: {
    type: Array as PropType<{ path: string; label: string }[]>,
    default: () => [],
  },
})
</script>

<style scoped lang="less">
.container-breadcrumb {
  margin: 16px 0;
  :deep(.arco-breadcrumb-item) {
    color: rgb(var(--gray-6));
    &:last-child {
      color: rgb(var(--gray-8));
    }
  }
}
</style>
