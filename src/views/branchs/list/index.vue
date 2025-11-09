<template>
  <div class="wrap-main">
    <Breadcrumb :items="['menu.list', 'menu.list.searchTable']" />
    <a-card class="branch-card">
      <a-row >
        <a-col style="margin-bottom: 20px;">
          <h3 style="font-size: 18px; font-weight: 500;">Tìm kiếm chi nhánh</h3>
        </a-col>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 19 }"
            label-align="left"
          >
            <a-row :gutter="20">
              <a-col :span="12" >
                <a-form-item field="name" :label="'Tên chi nhánh'">
                  <a-input
                    v-model="formModel.name"
                    placeholder="Tên chi nhánh"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="3">
                <a-space>
                  <a-button type="primary" @click="search">
                    Tìm kiếm
                  </a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="router.push({ name: 'BranchsAdd' })">
              <template #icon>
                <icon-plus />
              </template>
              Thêm chi nhánh
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-tooltip :content="'Refresh'">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="'Kích thước'">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :row-selection="rowSelection"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #thumbnail="{ record }">
          <a-space>
            <a-image :src="record.logo" :alt="record.name" :preview="false" fit="cover" class="branch-information--image" />
          </a-space>
        </template>
        <template #createdTime="{ record }">
          {{ dayjs(record.openTime).format('HH:mm') }} - {{ dayjs(record.closeTime).format('HH:mm') }}
        </template>

        <template #actions="{ record }">
          <a-space>
            <a-tooltip :content="'Cập nhật'">
              <a-button type="text" status="normal" @click="handleEdit(record.id)">
                <icon-edit />
              </a-button>
            </a-tooltip>
          </a-space>
          <a-popconfirm content="Bạn có chắc chắn muốn xoá tài khoản này?" type="warning" @ok="handleDelete(record.id)">
            <a-tooltip :content="'Xoá'">
              <a-button type="text" status="danger">
                <icon-delete />
              </a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { getUserBranches } from '@/api/branch';
  import { Branch, BranchRequest } from '@/types/branchTypes';
  import { Pagination } from '@/types/global';
  import { useRouter } from 'vue-router';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import dayjs from 'dayjs';
  import Breadcrumb from '@/components/breadcrumb/index.vue';

  const router = useRouter();
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const rowSelection = ref({
        type: 'checkbox',
        showCheckedAll: true,
        onlyCurrent: false,
    });
  const generateFormModel = () => {
    return {
      number: '',
      name: '',
      contentType: '',
      filterType: '',
      createdTime: [],
      status: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<Branch[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
      current: 1,
      pageSize: 10,
  };
  const pagination = ref({
      ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      slotName: 'index',
      width: 50,
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'thumbnail',
      slotName: 'thumbnail',
      width: 130,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: 220,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: 'Thời gian hoạt động',
      dataIndex: 'createdTime',
      slotName: 'createdTime',
      width: 180,
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      slotName: 'actions',
    },
  ]);

  const fetchData = async (
    page = 0, size = 10
    ) => {
    setLoading(true);
    try {
      const res = await getUserBranches();
      const data = ('data' in res && Array.isArray(res.data)) ? res.data as Branch[] : [];
      renderData.value = data;
      console.log(res);
      const totalElements = 'totalElements' in res ? res.totalElements : 0;
      pagination.value.total = totalElements;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData(
        pagination.value.current - 1,
        pagination.value.pageSize
    );
  };
  const onPageChange = (current: number) => {
        pagination.value.current = current;
        fetchData(
            current - 1,
            pagination.value.pageSize
        );
    };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };
  const handleEdit = (id: string) => {
    router.push({ name: 'BranchsEdit', params: { id } });
  };
  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .wrap-main {
        padding: 0 20px 20px 20px;
  }
  .branch-card {
    border-radius: 8px;
    padding-top: 20px;
  }
  .branch-information--image {
    width: 80px;
    height: 50px;
    
    & :deep(.arco-image-img){
      width: auto;
      height: 60px;
      border-radius: 4px;
    }
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
