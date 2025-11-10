<template>
    <div class="booking-management">
        <Breadcrumb :items="['menu.booking', 'menu.booking.management']" />
        <a-card class="booking-card" :bordered="false">
            <template #title>
                <div class="title-bar">
                    <span class="title-text">Quản lý đơn đặt sân</span>
                    <a-select v-model="selectedBranch" placeholder="Chọn chi nhánh" allow-clear class="branch-select" @change="handleFilterChange">
                        <a-option v-for="branch in branchOptions" :key="branch.id" :value="branch.id">
                            {{ branch.name }}
                        </a-option>
                    </a-select>
                </div>
            </template>
            <div class="filters">
                <a-row :gutter="16">
                    <a-col :xs="24" :sm="12" :md="6">
                        <a-input-search v-model="searchKey" placeholder="Tìm theo tên khách, số điện thoại" allow-clear @search="handleSearch" @press-enter="handleSearch" />
                    </a-col>
                    <a-col :xs="24" :sm="12" :md="6">
                        <a-range-picker v-model="dateRange" format="DD/MM/YYYY" value-format="YYYY-MM-DD" @change="handleFilterChange" />
                    </a-col>
                    <a-col :xs="24" :sm="12" :md="6">
                        <a-select v-model="statusFilter" @change="handleFilterChange">
                            <a-option value="ALL">Tất cả trạng thái</a-option>
                            <a-option value="PENDING">Chờ xác nhận</a-option>
                            <a-option value="CONFIRMED">Đã xác nhận</a-option>
                            <a-option value="CANCELED">Đã hủy</a-option>
                        </a-select>
                    </a-col>
                </a-row>
                <div class="filter-actions">
                    <a-space>
                        <a-button type="primary" @click="handleOpenCreateModal">
                            <template #icon>
                                <icon-plus />
                            </template>
                            Tạo đơn mới
                        </a-button>
                        <a-button type="primary" @click="handleSearch">
                            <template #icon>
                                <icon-search />
                            </template>
                            Tìm kiếm
                        </a-button>
                        <a-button @click="handleResetFilters">Đặt lại</a-button>
                        <a-button type="outline" @click="loadBookings">
                            <template #icon>
                                <icon-refresh />
                            </template>
                            Làm mới
                        </a-button>
                    </a-space>
                </div>
            </div>

            <a-table
                row-key="id"
                :loading="loading"
                :data="filteredBookings"
                :columns="columns"
                :pagination="pagination"
                @page-change="handlePageChange"
                @page-size-change="handlePageSizeChange"
            >
                <template #index="{ rowIndex }">
                    {{ (pagination.current - 1) * pagination.pageSize + rowIndex + 1 }}
                </template>
                <template #bookingDate="{ record }">
                    {{ formatDateTime(record.bookingDate) }}
                </template>
                <template #branch="{ record }">
                    {{ record.branch?.name || '—' }}
                </template>
                <template #paid="{ record }">
                    <a-tag :color="record.paid ? 'green' : 'orange'">
                        {{ record.paid ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                    </a-tag>
                </template>
                <template #status="{ record }">
                    <a-tag :color="statusColorMap[record.status]">{{ statusLabelMap[record.status] }}</a-tag>
                </template>
                <template #totalPrice="{ record }">
                    <span class="text-indigo-600 font-semibold">{{ formatCurrency(record.totalPrice) }}</span>
                </template>
                <template #operations="{ record }">
                    <a-space>
                        <a-tooltip content="Xem chi tiết">
                            <a-button shape="circle" type="primary" size="small" @click="handleViewDetail(record)">
                                <icon-eye />
                            </a-button>
                        </a-tooltip>
                        <a-popconfirm v-if="record.status !== 'CANCELED'" content="Bạn có chắc muốn hủy đơn đặt sân này?" type="warning" @ok="handleCancelBooking(record.id)">
                            <a-tooltip content="Hủy đặt sân">
                                <a-button shape="circle" status="danger" size="small">
                                    <icon-stop />
                                </a-button>
                            </a-tooltip>
                        </a-popconfirm>
                        <a-popconfirm content="Xóa đơn đặt sân sẽ không thể khôi phục. Tiếp tục?" type="warning" @ok="handleDeleteBooking(record.id)">
                            <a-tooltip content="Xóa đơn">
                                <a-button shape="circle" status="danger" size="small">
                                    <icon-delete />
                                </a-button>
                            </a-tooltip>
                        </a-popconfirm>
                    </a-space>
                </template>
            </a-table>
        </a-card>

        <BookingDetailDrawer
            v-if="detailVisible"
            :visible="detailVisible"
            :booking="drawerBooking"
            :confirm-loading="confirmLoading"
            @close="handleCloseDetail"
            @confirm-paid="handleConfirmPaid"
        />

        <CreateBookingModal
            v-if="createModalVisible"
            :visible="createModalVisible"
            :branch-id="selectedBranch"
            @close="handleCloseCreateModal"
            @success="handleCreateSuccess"
        />
    </div>
</template>

<script setup lang="ts">
    import { nextTick, computed, onMounted, reactive, ref, watch } from 'vue';
    import dayjs from 'dayjs';
    import { Message } from '@arco-design/web-vue';
    import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
    import Breadcrumb from '@/components/breadcrumb/index.vue';
    import { getUserBranches } from '@/api/branch';
    import useBookingManagementStore from '@/store/modules/booking/bookingManagementStore';
    import { BookingResponse, BookingStatus } from '@/types/bookingTypes';
import { Branch } from '@/types/branchTypes';
import BookingDetailDrawer from './components/BookingDetailDrawer.vue';
import CreateBookingModal from './components/CreateBookingModal.vue';

    type StatusFilter = BookingStatus | 'ALL';

    const bookingManagementStore = useBookingManagementStore();

    const loading = computed(() => bookingManagementStore.loading);
    const bookings = computed(() => bookingManagementStore.bookings);
    const drawerBooking = computed(() => bookingManagementStore.selectedBooking);

    const branchOptions = ref<Branch[]>([]);
    const searchKey = ref('');
    const selectedBranch = ref('');
    const statusFilter = ref<StatusFilter>('ALL');
    const dateRange = ref<string[]>([dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);

const detailVisible = ref(false);
const confirmLoading = ref(false);
const createModalVisible = ref(false);

    const pagination = reactive({
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: true,
    });

    const columns = computed<TableColumnData[]>(() => [
        {
            title: '#',
            dataIndex: 'index',
            slotName: 'index',
            width: 60,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            ellipsis: true,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: 150,
        },
        {
            title: 'Chi nhánh',
            dataIndex: 'branch',
            slotName: 'branch',
            width: 180,
        },
        {
            title: 'Thời gian đặt',
            dataIndex: 'bookingDate',
            slotName: 'bookingDate',
            width: 180,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            slotName: 'status',
            width: 140,
        },
        {
            title: 'Thanh toán',
            dataIndex: 'paid',
            slotName: 'paid',
            width: 150,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            slotName: 'totalPrice',
            width: 160,
        },
        {
            title: 'Thao tác',
            dataIndex: 'operations',
            slotName: 'operations',
            width: 160,
            align: 'center',
            fixed: 'right',
        },
    ]);

    const statusLabelMap: Record<BookingStatus, string> = {
        PENDING: 'Chờ xác nhận',
        CONFIRMED: 'Đã xác nhận',
        CANCELED: 'Đã hủy',
    };

    const statusColorMap: Record<BookingStatus, string> = {
        PENDING: 'arcoblue',
        CONFIRMED: 'green',
        CANCELED: 'red',
    };

    const filteredBookings = computed<BookingResponse[]>(() => {
        if (statusFilter.value === 'ALL') {
            return bookings.value;
        }
        return bookings.value.filter((booking) => booking.status === statusFilter.value);
    });

    const loadBranches = async () => {
        const response = await getUserBranches();
        if (response && 'data' in response) {
            branchOptions.value = Array.isArray(response.data) ? (response.data as Branch[]) : [];
            if (!selectedBranch.value && branchOptions.value.length) {
                selectedBranch.value = branchOptions.value[0].id;
            }
        }
    };

    const buildFilterParams = () => {
        const range = Array.isArray(dateRange.value) ? dateRange.value : [];
        const [from, to] = range;
        const fromIso = from ? dayjs(from, 'YYYY-MM-DD').startOf('day').toISOString() : '';
        const toIso = to ? dayjs(to, 'YYYY-MM-DD').endOf('day').toISOString() : '';
        return {
            page: pagination.current - 1,
            pageSize: pagination.pageSize,
            searchKey: searchKey.value.trim(),
            branch: selectedBranch.value,
            from: fromIso,
            to: toIso,
            sortProperty: 'bookingDate',
            sortOrder: 'desc' as const,
        };
    };

    const loadBookings = async () => {
        await bookingManagementStore.fetchBookings(buildFilterParams());
        pagination.total = bookingManagementStore.totalElements;
    };

    const handleSearch = () => {
        pagination.current = 1;
        loadBookings();
    };

    const handleFilterChange = () => {
        pagination.current = 1;
        loadBookings();
    };

    const handleResetFilters = () => {
        searchKey.value = '';
        statusFilter.value = 'ALL';
        dateRange.value = [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')];
        if (branchOptions.value.length) {
            selectedBranch.value = branchOptions.value[0].id;
        }
        pagination.current = 1;
        loadBookings();
    };

    const handlePageChange = (page: number) => {
        pagination.current = page;
        loadBookings();
    };

    const handlePageSizeChange = (pageSize: number) => {
        pagination.pageSize = pageSize;
        pagination.current = 1;
        loadBookings();
    };

    const handleViewDetail = (booking: BookingResponse) => {
        bookingManagementStore.setSelectedBooking(booking);
        nextTick(() => {
            detailVisible.value = true;
        });
    };

    const handleCloseDetail = () => {
        bookingManagementStore.setSelectedBooking(null);
        detailVisible.value = false;
    };

    const handleOpenCreateModal = () => {
        if (!selectedBranch.value) {
            Message.warning('Vui lòng chọn chi nhánh trước');
            return;
        }
        createModalVisible.value = true;
    };

    const handleCloseCreateModal = () => {
        createModalVisible.value = false;
    };

    const handleCreateSuccess = () => {
        loadBookings();
    };

    const handleCancelBooking = async (bookingId: string) => {
        try {
            await bookingManagementStore.cancelBooking(bookingId);
            Message.success('Đã hủy đơn đặt sân.');
        } catch (error) {
            Message.error('Hủy đơn không thành công.');
        }
    };

    const handleDeleteBooking = async (bookingId: string) => {
        try {
            await bookingManagementStore.deleteBooking(bookingId);
            Message.success('Đã xóa đơn đặt sân.');
        } catch (error) {
            Message.error('Xóa đơn không thành công.');
        }
    };

    const handleConfirmPaid = async () => {
        if (!drawerBooking.value) return;
        confirmLoading.value = true;
        try {
            await bookingManagementStore.markBookingAsPaid(drawerBooking.value);
            Message.success('Đã xác nhận thanh toán.');
            detailVisible.value = false;
            bookingManagementStore.setSelectedBooking(null);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể cập nhật thanh toán.';
            Message.error(message);
        } finally {
            confirmLoading.value = false;
        }
    };

    const formatDateTime = (value?: string) => {
        if (!value) return '--';
        return dayjs(value).format('HH:mm DD/MM/YYYY');
    };

    const formatCurrency = (value?: number | null) => {
        if (!value) return '0 đ';
        return `${new Intl.NumberFormat('vi-VN').format(value)} đ`;
    };

    onMounted(async () => {
        await loadBranches();
        await loadBookings();
    });

    watch(
        () => bookingManagementStore.totalElements,
        (total) => {
            pagination.total = total;
        }
    );

    watch(
        () => [statusFilter.value, filteredBookings.value],
        () => {
            pagination.total = statusFilter.value === 'ALL' ? bookingManagementStore.totalElements : filteredBookings.value.length;
        }
    );
</script>

<style scoped lang="less">
    .booking-management {
        padding: 0 20px 20px;
    }

    .booking-card {
        border-radius: 8px;
    }

    .title-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }

    .title-text {
        font-size: 18px;
        font-weight: 600;
    }

    .branch-select {
        min-width: 220px;
    }

    .filters {
        margin-bottom: 16px;
    }

    .filter-actions {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
    }

    .text-indigo-600 {
        color: #4f46e5;
    }

    .font-semibold {
        font-weight: 600;
    }
</style>
