<template>
    <div class="wrap-main">
        <Breadcrumb :items="['menu.list', 'menu.list.searchTable']" />
        <a-card class="branch-card">
            <template #title>
                <a-row :gutter="20" align="center">
                    <a-col :span="3" class="justify-center">Danh sách sân</a-col>
                    <a-col :span="9">
                        <a-select v-model="currentBranch" placeholder="Chọn một chi nhánh">
                            <a-option v-for="value in branchData" :key="value.id" :value="value.id">{{ value.name }}</a-option>
                        </a-select>
                    </a-col>
                </a-row>
            </template>
            <a-row style="margin-bottom: 16px">
                <a-col :span="12">
                    <a-space>
                        <a-button type="primary" @click="router.push({ name: 'court-create' })">
                            <template #icon>
                                <icon-plus />
                            </template>
                            Thêm sân
                        </a-button>
                    </a-space>
                </a-col>
                <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
                    <a-tooltip :content="'Refresh'">
                        <div class="action-icon" @click="fetchCourts"><icon-refresh size="18" /></div>
                    </a-tooltip>
                    <a-dropdown @select="handleSelectDensity">
                        <a-tooltip :content="'Kích thước'">
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
            <a-table row-key="id" :loading="loading" :pagination="pagination" :columns="columns" :data="courts" :bordered="false" :size="size" @page-change="onPageChange">
                <template #index="{ rowIndex }">
                    {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
                </template>
                <template #status="{ record }">
                    <a-tag v-if="record.status === 'available'" color="green">Sẵn sàng</a-tag>
                    <a-tag v-else-if="record.status === 'busy'" color="red">Đang sửa chữa</a-tag>
                    <a-tag v-else>Đang sửa chữa</a-tag>
                </template>
                <template #type> Sân đôi </template>
                <template #priceBoard="{ record }"> <a-button type="text" status="normal" @click="handleViewPriceList(record)">Xem bảng giá</a-button> </template>

                <template #operations="{ record }">
                    <a-space>
                        <a-tooltip :content="'Cập nhật'">
                            <a-button type="text" status="normal" @click="handleEdit(record)">
                                <icon-edit />
                            </a-button>
                        </a-tooltip>
                    </a-space>
                    <!-- <a-popconfirm content="Bạn có chắc chắn muốn xoá tài khoản này?" type="warning" @ok="handleDelete(record.id)">
                        <a-tooltip :content="'Xoá'">
                            <a-button type="text" status="danger">
                                <icon-delete />
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm> -->
                </template>
            </a-table>
            <PricePopup v-if="displayPrice" :key="Date.now()" :visible="displayPrice" :price-list="priceList" @cancel="handleClosePriceList" />
        </a-card>
    </div>
</template>

<script lang="ts" setup>
    import { computed, onMounted, ref, watch } from 'vue';
    import { useI18n } from 'vue-i18n';
    import useLoading from '@/hooks/loading';
    import { getUserBranches } from '@/api/branch';
    import { Branch } from '@/types/branchTypes';
    import { Pagination } from '@/types/global';
    import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
    import { useUserStore } from '@/store';
    import useBookingStore from '@/store/modules/booking/bookingStore';
    import router from '@/router';
    import useCourtManagementStore from '@/store/modules/court-management/courtManagementStore';
    import { ItemPayload } from '@/types/courtType';
    import PricePopup from './PricePopup.vue';

    type SizeProps = 'mini' | 'small' | 'medium' | 'large';
    const currentBranch = ref('');
    const { loading, setLoading } = useLoading(true);
    const { t } = useI18n();
    const userStore = useUserStore();
    const branchData = ref<Branch[]>([]);
    const { getAllCourtOfBranch } = useBookingStore();
    const courtManagementStore = useCourtManagementStore();

    const size = ref<SizeProps>('medium');
    const courts = ref([]);
    const displayPrice = ref(false);
    const priceList = ref([]);

    const isAdmin = ['superuser', 'admin'].includes(userStore.role);

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
            title: 'Tên sân',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: 'Loại sân',
            dataIndex: 'type',
            width: 200,
            slotName: 'type',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 150,
            slotName: 'status',
        },
        {
            title: 'Bảng giá',
            dataIndex: 'priceBoard',
            width: 150,
            slotName: 'priceBoard',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: 150,
        },
        {
            title: 'Hành động',
            dataIndex: 'operations',
            slotName: 'operations',
        },
    ]);

    const fetchData = async (page = 0, size = 10) => {
        // setLoading(true);
        try {
            const res = await getUserBranches();
            const data = 'data' in res && Array.isArray(res.data) ? (res.data as Branch[]) : [];
            branchData.value = data;
            if (!currentBranch.value) {
                currentBranch.value = data[0] ? data[0].id : '';
                courtManagementStore.selectedBranch = data[0] ? data[0].id : '';
            }
        } catch (err) {
            // you can report use errorHandler or other
        } finally {
            // setLoading(false);
        }
    };

    const fetchCourts = async () => {
        setLoading(true);
        const rs = await getAllCourtOfBranch(currentBranch.value);
        courts.value = rs;
        setLoading(false);
    };

    const onPageChange = (current: number) => {
        pagination.value.current = current;
        fetchData(current - 1, pagination.value.pageSize);
    };

    const handleSelectDensity = (val: string | number | Record<string, any> | undefined, e: Event) => {
        size.value = val as SizeProps;
    };

    const handleViewPriceList = (court: any) => {
        priceList.value = court.prices;
        displayPrice.value = true;
    };

    const handleClosePriceList = (court: any) => {
        displayPrice.value = false;
        priceList.value = [];
    };

    const handleEdit = (court: ItemPayload) => {
        courtManagementStore.selectedCourt = court;
        router.push({ name: 'court-edit' });
    };

    onMounted(() => {
        fetchData();
    });

    watch(currentBranch, (val) => {
        courtManagementStore.selectedBranch = currentBranch.value;
        if (val) fetchCourts();
    });
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

        & :deep(.arco-image-img) {
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
