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
                    <a-popconfirm v-if="record.active == false" content="Kích hoạt tài khoản này?" type="info" @ok="handleActive(record.id)">
                        <a-tag size="large" color="red" class="dont-active" >
                            <template #icon>
                                <icon-info-circle />
                            </template>
                           {{ $t(`user.list.status.${record.active}`) }}
                        </a-tag>
                    </a-popconfirm>
                    <a-tag size="large" v-else color="green" >
                        <template #icon>
                            <icon-check-circle />
                        </template>
                        {{ $t(`user.list.status.${record.active}`) }}
                    </a-tag>
                </template>

                <template #operations="{ record }">
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
                    <a-button @click="openModal(record)" >
                        Cập nhật Role
                    </a-button>
                    <a-modal v-model:visible="visible" title="Cập nhật Role" @cancel="handleCancel" @before-ok="() => handleBeforeOk(record.id)" :loading="loading" destroy-on-close>
                        <a-form label-align="left" :model="formUpdateRole" ref="formRef">
                            <a-form-item field="role" label="Phần quyền" :label-col-props="{ span: 16 }" :wrapper-col-props="{ span: 24 }">
                            <a-cascader
                                v-model="formUpdateRole.role"
                                placeholder="Chọn phần quyền"
                                style="width: 100%;"
                                :options="options"
                                allow-clear
                            />
                        </a-form-item>
                        </a-form>
                    </a-modal>
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
    import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
    import cloneDeep from 'lodash/cloneDeep';
    import { User } from '@/types/userTypes';
    import { getUsers, deleteAccount, activeAccount, updateRole, getRoles } from '@/api/user';
    import { useRouter } from 'vue-router';
    import Breadcrumb from '@/components/breadcrumb/index.vue';
    import { done } from 'nprogress';

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
    const formRef = ref();
    const options = ref<{ label: string; value: string }[]>([]);
    const formUpdateRole = ref({
        role: '', // chỉ 1 role duy nhất
    });
    const { loading, setLoading } = useLoading(true);
    const { t } = useI18n();
    const renderData = ref<User[]>([]);
    const cloneColumns = ref<Column[]>([]);
    const showColumns = ref<Column[]>([]);

    const size = ref<SizeProps>('medium');
    const currentId = ref<string | null>(null);
    const openModal = (record: any) => {
        currentId.value = record.id;  // ✅ Gán id mỗi khi mở modal
        visible.value = true;
        formUpdateRole.value.role = record.role || ''; // nếu cần
    };
    const resetForm = () => {
        formUpdateRole.value = { role: '' };
        if (formRef.value) formRef.value.resetFields?.();
    };
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
            width: 150,
        },
        {
            title: t('user.list.status'),
            dataIndex: 'active',
            slotName: 'status',
            width: 170,
        },
        {
            title: t('user.list.action'),
            dataIndex: 'id',
            slotName: 'operations',
        },
    ]);
    const cloneRoles = async () => {
        setLoading(true);
        try {
            const res = await getRoles();
            const data = 'data' in res ? res.data : res;
            options.value = Array.isArray(data) ? data.map((role: any) => ({ label: role.title, value: role.id })) : [];
            
        } catch (err) {
            console.error('fetchData error:', err);
        } finally {
            setLoading(false);
        }
    };
    cloneRoles();
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
    const handleActive = async (id: string) => {
        setLoading(true);
        try {
            await activeAccount(id, 'active')
            fetchData(
                pagination.value.current - 1,
                pagination.value.pageSize
            );
        } catch (err) {
            console.error('activate error:', err);
        } finally {
            setLoading(false);
        }
    };
    const visible = ref(false);

    const handleBeforeOk = async (id: string) => {
        if (!currentId.value) return;
        loading.value = true;
        try {
            console.log(id);
            
            const res = await updateRole(currentId.value, formUpdateRole.value.role);
            visible.value = false;
            done(true)
            resetForm();
            fetchData(
                pagination.value.current - 1,
                pagination.value.pageSize
            );
        } catch (err) {
            console.error('Update role failed:', err)
        } finally {
            loading.value = false;
        }
    };
    const handleCancel = () => {
      visible.value = false;
      resetForm();
    }
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
    .dont-active {
        cursor: pointer;
    }
</style>
