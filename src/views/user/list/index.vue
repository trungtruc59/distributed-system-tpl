<template>
    <div class="wrap-main">
        <Breadcrumb :routes="breadcrumbRoutes" />
        <a-card class="general-card" :title="$t('menu.user.list')">
            <a-divider style="margin-top: 0" />
            <a-row style="margin-bottom: 16px">
                <a-col :span="12">
                    <a-space>
                        <a-button type="primary" @click="router.push({ name: 'UserAdd' })">
                            <template #icon>
                                <icon-plus />
                            </template>
                            {{ $t('user.create') }}
                        </a-button>
                    </a-space>
                </a-col>
                <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
                    <a-dropdown @select="handleSelectDensity">
                        <a-tooltip :content="'Kích thước bảng'">
                            <div class="action-icon"><icon-line-height size="18" /></div>
                        </a-tooltip>
                        <template #content>
                            <a-doption v-for="item in densityList" :key="item.value" :value="item.value" :class="{ active: item.value === size }">
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
                
                
                <template #status="{ record }">
                    <span v-if="record.active == false" class="circle"></span>
                    <span v-else class="circle pass"></span>
                    {{ $t(`user.list.status.${record.active}`) }}
                </template>

                <template #operations="{ record }">
                    <a-space>
                      <a-tooltip :content="'Chỉnh sửa'">
                        <a-button type="text" status="normal" @click="handleEdit(record.id)">
                          <icon-edit />
                        </a-button>
                      </a-tooltip>
                    </a-space>
                    <a-popconfirm content="Are you sure you want to delete?" type="warning" @ok="handleDelete(record.id)">
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
    import { computed, ref, watch, nextTick, onMounted } from 'vue';
    import { useI18n } from 'vue-i18n';
    import useLoading from '@/hooks/loading';
    import { Pagination } from '@/types/global';
    import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
    import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
    import cloneDeep from 'lodash/cloneDeep';
    import { User } from '@/types/userTypes';
    import { getUsers, deleteAccount } from '@/api/user';
    import { useRouter } from 'vue-router';
    import Breadcrumb from '@/components/breadcrumb/index.vue';

    const router = useRouter();

    const breadcrumbRoutes = [
        { path: '/dashboard', label: 'Trang chủ' },
        { path: '/user/list', label: 'Danh sách người dùng' },
    ]
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
    const renderData = ref<User[]>([]);
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
            name: 'Nhỏ',
            value: 'small',
        },
        {
            name: 'Vừa',
            value: 'medium',
        },
        {
            name: 'Lớn',
            value: 'large',
        },
    ]);
    const columns = computed<TableColumnData[]>(() => [
        {
            title: t('user.list.index'),
            dataIndex: 'index',
            slotName: 'index',
            width: 50,
        },
        {
            title: t('user.list.fullname'),
            dataIndex: 'userInfo.full_name',
            width: 220,
        },
        {
            title: t('user.list.email'),
            dataIndex: 'email',
            width: 250,
        },
        {
            title: t('user.list.phone'),
            dataIndex: 'phone',
            slotName: 'phone',
            width: 150,
        },
        {
            title: t('user.list.role'),
            dataIndex: 'role',
            width: 120,
        },
        {
            title: t('user.list.status'),
            dataIndex: 'active',
            slotName: 'status',
            width: 150,
        },
        {
            title: t('user.list.action'),
            dataIndex: 'id',
            slotName: 'operations',
        },
    ]);
    const contentTypeOptions = computed<SelectOptionData[]>(() => [
        {
            label: t('searchTable.form.contentType.img'),
            value: 'img',
        },
        {
            label: t('searchTable.form.contentType.horizontalVideo'),
            value: 'horizontalVideo',
        },
        {
            label: t('searchTable.form.contentType.verticalVideo'),
            value: 'verticalVideo',
        },
    ]);
    const filterTypeOptions = computed<SelectOptionData[]>(() => [
        {
            label: t('searchTable.form.filterType.artificial'),
            value: 'artificial',
        },
        {
            label: t('searchTable.form.filterType.rules'),
            value: 'rules',
        },
    ]);
    const statusOptions = computed<SelectOptionData[]>(() => [
        {
            label: t('searchTable.form.status.online'),
            value: 'online',
        },
        {
            label: t('searchTable.form.status.offline'),
            value: 'offline',
        },
    ]);
    const fetchData = async (
    page = 0, size = 10
    ) => {
        setLoading(true);
        try {
            const res = await getUsers({
                page,
                pageSize: size,
            });
            const data = 'data' in res ? res.data : res;
            const totalElements = 'totalElements' in res ? res.totalElements : 0;
            renderData.value = Array.isArray(data) ? (data as User[]) : [];
            pagination.value.total = totalElements;
            
        } catch (err) {
            console.error('fetchData error:', err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
    const onPageChange = (current: number) => {
        pagination.value.current = current;
        fetchData(
            current - 1,
            pagination.value.pageSize
        );
    };
    const handleSelectDensity = (val: string | number | Record<string, any> | undefined, e: Event) => {
        size.value = val as SizeProps;
    };
    const handleEdit = async (id: string) => {
        router.push({
            name: 'UserEdit',
            params: { id },
        });
    };
    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await deleteAccount(id)
            fetchData(
                pagination.value.current - 1,
                pagination.value.pageSize
            );
        } catch (err) {
            console.error('delete error:', err);
        } finally {
            setLoading(false);
        }
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
