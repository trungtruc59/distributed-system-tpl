<template>
    <a-drawer :visible="visible" :width="520" title="Chi tiết đơn đặt sân" unmount-on-close @cancel="handleClose">
        <template #footer>
            <a-space>
                <a-button v-if="booking && !booking.paid" type="primary" :loading="confirmLoading" @click="handleConfirmPaid"
                    >Xác nhận thanh toán</a-button
                >
                <a-button type="outline" @click="handleClose">Đóng</a-button>
            </a-space>
        </template>
        <div v-if="booking">
            <a-descriptions :column="1" size="medium" layout="horizontal" bordered>
                <a-descriptions-item label="Khách hàng">{{ booking.customerName }}</a-descriptions-item>
                <a-descriptions-item label="Số điện thoại">{{ booking.phone }}</a-descriptions-item>
                <a-descriptions-item label="Chi nhánh">
                    {{ booking.branch?.name || 'Không xác định' }}
                </a-descriptions-item>
                <a-descriptions-item label="Thời gian đặt">
                    {{ formatDateTime(booking.bookingDate) }}
                </a-descriptions-item>
                <a-descriptions-item label="Trạng thái">
                    <a-tag :color="statusColorMap[booking.status]">{{ statusLabelMap[booking.status] }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="Thanh toán">
                    <a-tag :color="booking.paid ? 'green' : 'orange'">
                        {{ booking.paid ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                    </a-tag>
                </a-descriptions-item>
                <a-descriptions-item v-if="booking.note" label="Ghi chú">
                    {{ booking.note }}
                </a-descriptions-item>
                <a-descriptions-item label="Tổng tiền">
                    <span class="text-indigo-600 font-semibold">{{ formatCurrency(booking.totalPrice) }}</span>
                </a-descriptions-item>
            </a-descriptions>

            <a-divider />
            <a-typography-title :heading="6">Danh sách sân</a-typography-title>
            <a-table
                row-key="id"
                :columns="detailColumns"
                :data="booking.details"
                :pagination="false"
                :scroll="{ y: 260 }"
                size="small"
            >
                <template #index="{ rowIndex }">
                    {{ rowIndex + 1 }}
                </template>
                <template #item="{ record }">
                    {{ record.item?.name || 'Sân' }}
                </template>
                <template #time="{ record }">
                    <div v-if="record.startTime && record.endTime">
                        {{ formatDateTime(record.startTime, 'HH:mm DD/MM/YYYY') }} -<br />
                        {{ formatDateTime(record.endTime, 'HH:mm DD/MM/YYYY') }}
                    </div>
                    <span v-else>--</span>
                </template>
                <template #price="{ record }">
                    {{ formatCurrency(record.price) }}
                </template>
            </a-table>
        </div>
        <a-empty v-else description="Không có dữ liệu đơn đặt sân" />
    </a-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import { BookingResponse, BookingStatus } from '@/types/bookingTypes';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

const props = defineProps<{
    visible: boolean;
    booking: BookingResponse | null;
    confirmLoading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'confirmPaid'): void;
}>();

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

const detailColumns = computed<TableColumnData[]>(() => [
    {
        title: '#',
        dataIndex: 'index',
        slotName: 'index',
        width: 50,
    },
    {
        title: 'Sân',
        dataIndex: 'item',
        slotName: 'item',
        ellipsis: true,
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        width: 100,
    },
    {
        title: 'Thời gian',
        dataIndex: 'time',
        slotName: 'time',
        width: 200,
    },
    {
        title: 'Giá',
        dataIndex: 'price',
        slotName: 'price',
        width: 140,
    },
]);

const formatDateTime = (value?: string, pattern = 'HH:mm DD/MM/YYYY') => {
    if (!value) return '--';
    return dayjs(value).format(pattern);
};

const formatCurrency = (value?: number | null) => {
    if (!value) return '0 đ';
    return `${new Intl.NumberFormat('vi-VN').format(value)} đ`;
};

const handleClose = () => {
    emit('close');
};

const handleConfirmPaid = () => {
    emit('confirmPaid');
};

const confirmLoading = computed(() => props.confirmLoading ?? false);
</script>

<style scoped>
.text-indigo-600 {
    color: #4f46e5;
}

.font-semibold {
    font-weight: 600;
}
</style>

