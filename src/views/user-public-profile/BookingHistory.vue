<template>
    <div class="mx-4 mt-2">
        <a-card :bordered="false" class="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <template #title>
                <h2 class="text-center text-2xl font-semibold text-gray-800"> Lịch sử đặt sân gần đây </h2>
            </template>

            <!-- Bảng lịch sử -->
            <a-table :loading="loading" :columns="columns" :data="data" :pagination="false" class="rounded-lg overflow-hidden mt-6">
                <template #paid="{ record }">
                    <a-tag v-if="record.paid" color="green">Đã thanh toán</a-tag>
                    <a-tag v-else color="red">Chưa thanh toán</a-tag>
                </template>
                <template #total="{ record }">
                    <span class="font-semibold text-blue-600">{{ record.total }}</span>
                </template>
                <template #actions="{ record }">
                    <div class="flex gap-2">
                        <a-button type="primary" size="small" @click="handleSelectBooking(record)"> Chi tiết </a-button>
                        <a-button v-if="!record.paid" type="text" size="small" status="danger"> hủy </a-button>
                    </div>
                </template>
            </a-table>
            <HistoryDetail v-if="selectedHistory.id" :key="drawerKey" :visible="drawerVisible" :booking="selectedHistory" @close="handleCloseDetail" />
        </a-card>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import useBookingStore from '@/store/modules/booking/bookingStore';
    import { useUserStore } from '@/store';
    import dayjs from 'dayjs';
    import HistoryDetail from './HistoryDetail.vue';

    const bookingStore = useBookingStore();
    const userStore = useUserStore();
    const drawerVisible = ref(false);
    const selectedHistory = ref({
        customerName: '',
        phone: '',
        bookingDate: '',
        paid: false,
        totalPrice: 0,
        details: [],
        id: '',
    });
    const drawerKey = ref(0);
    // Cấu hình cột bảng
    const columns = [
        { title: 'Thời gian đặt', dataIndex: 'bookingTime', slotName: 'bookingTime' },
        { title: 'Tên sân', dataIndex: 'field', slotName: 'field' },
        { title: 'Trạng thái', dataIndex: 'paid', slotName: 'paid' },
        { title: 'Tổng tiền', dataIndex: 'total', slotName: 'total' },
        { title: 'Thao tác', dataIndex: 'actions', slotName: 'actions', width: 140 },
    ];

    // Dữ liệu mẫu
    const data = ref<any>([]);
    const loading = ref(false);

    const parseDataToHistoryData = (histories: any) => {
        data.value = histories.map((history: any) => {
            return {
                bookingTime: dayjs(history.bookingDate).format('HH:mm DD/MM/YYYY'),
                field: '',
                paid: !!history.paid,
                total: history.totalPrice,
                raw: history,
            };
        });
    };

    onMounted(async () => {
        loading.value = true;
        const historyRs = await bookingStore.getUserBookingHistory(userStore.phone);
        parseDataToHistoryData(historyRs);
        loading.value = false;
    });

    const handleSelectBooking = (booking: any) => {
        // Reset và đóng drawer trước khi mở drawer mới
        if (drawerVisible.value) {
            drawerVisible.value = false;
            selectedHistory.value = { customerName: '', phone: '', bookingDate: '', paid: false, totalPrice: 0, details: [], id: '' };

            // Đợi drawer đóng hoàn toàn trước khi mở lại
            setTimeout(() => {
                selectedHistory.value = { ...booking.raw };
                drawerKey.value = Date.now();
                drawerVisible.value = true;
            }, 350);
        } else {
            // Nếu drawer chưa mở, mở ngay
            selectedHistory.value = { ...booking.raw };
            drawerKey.value = Date.now();
            drawerVisible.value = true;
        }
    };

    const handleCloseDetail = () => {
        drawerVisible.value = false;
        // Reset sau khi drawer đóng hoàn toàn để đảm bảo component được unmount
        setTimeout(() => {
            selectedHistory.value = { customerName: '', phone: '', bookingDate: '', paid: false, totalPrice: 0, details: [], id: '' };
        }, 300);
    };
</script>

<style scoped>
    /* Tùy chỉnh nhẹ bảng Arco bằng Tailwind */
    :deep(.arco-table-th) {
        @apply bg-blue-600 text-white font-medium;
    }

    :deep(.arco-table-tr:nth-child(even)) {
        @apply bg-blue-50;
    }

    :deep(.arco-table-tr:hover) {
        @apply bg-blue-100 transition-colors;
    }
</style>
