<template>
  <div class="wrap-main">
    <Breadcrumb :routes="breadcrumbRoutes" />
    <a-card class="general-card" :title="'Sửa thông tin người dùng'">
      <a-row class="wrapper">
        <BasicInformation :userDetail="userDetail" :id="idUser" />
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { getUsers} from '@/api/user';
  import { ref, onMounted } from 'vue';
  import { accountRequest } from '@/types/userTypes';
  import BasicInformation from './components/basic-information.vue';

  const route = useRoute();
  const userDetail = ref<accountRequest>();
  const idUser = ref('');
  const { id } = route.params;
  idUser.value = id as string;
  const breadcrumbRoutes = [
    { path: '/dashboard', label: 'Trang chủ' },
    { path: '/user/list', label: 'Danh sách người dùng' },
    { path: '/user/edit', label: 'Sửa thông tin' },
  ]
  const getDetailAccount = async () => {
        try {
          
          const res = await getUsers();
          const data = 'data' in res ? res.data : res;

          // lọc user theo id
          const foundUser = Array.isArray(data) ? data.find((item: any) => String(item.id) === String(id)) : null;
          userDetail.value = foundUser || null;

          console.log('User detail:', userDetail.value);
            
        } catch (err) {
            console.error('fetchData error:', err);
        }
    };

  onMounted(() => {
      getDetailAccount();
  });
</script>

<script lang="ts">
  export default {
    name: 'Setting',
  };
</script>

<style scoped lang="less">
  .wrap-main {
    padding: 0 20px 20px 20px;
  }

  .wrapper {
    padding: 20px 20px;
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
