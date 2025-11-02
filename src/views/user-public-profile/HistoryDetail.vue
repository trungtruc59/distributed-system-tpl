<template>
    <a-drawer :visible="visible" :width="500" title="Chi tiết đặt sân" unmount-on-close @cancel="onClose">
        <template v-if="visible && booking">
            <div class="space-y-4">
                <!-- Thông tin khách hàng -->
                <a-card title="Thông tin khách hàng" size="small">
                    <div class="grid grid-cols-2 gap-y-2 text-sm">
                        <span class="text-gray-500">Họ tên:</span>
                        <span class="font-medium">{{ booking.customerName }}</span>

                        <span class="text-gray-500">Số điện thoại:</span>
                        <span class="font-medium">{{ booking.phone }}</span>

                        <span class="text-gray-500">Ngày đặt:</span>
                        <span class="font-medium">
                            {{ formatDate(booking.bookingDate) }}
                        </span>

                        <span class="text-gray-500">Trạng thái:</span>
                        <a-tag v-if="booking.paid" color="green">Đã thanh toán</a-tag>
                        <a-tag v-else color="red">Chưa thanh toán</a-tag>
                    </div>
                </a-card>

                <!-- Chi tiết đặt sân -->
                <a-card title="Chi tiết sân" size="small">
                    <div v-for="detail in booking.details" :key="detail.id" class="border-b border-gray-100 pb-3 mb-3 last:border-none last:pb-0 last:mb-0">
                        <div class="flex justify-between">
                            <div>
                                <p class="font-semibold">{{ detail.item.name }}</p>
                                <p class="text-xs text-gray-500"> {{ formatTime(detail.startTime) }} - {{ formatTime(detail.endTime) }} </p>
                            </div>
                            <span class="font-semibold text-blue-600">
                                {{ formatCurrency(detail.price) }}
                            </span>
                        </div>
                        <p class="text-xs text-gray-400 mt-1">
                            {{ detail.item.description }}
                        </p>
                    </div>
                </a-card>

                <!-- Tổng tiền -->
                <div class="flex justify-between items-center mt-4 px-2">
                    <span class="text-gray-600 font-medium">Tổng cộng:</span>
                    <span class="text-lg font-bold text-green-600">
                        {{ formatCurrency(booking.totalPrice) }}
                    </span>
                </div>
            </div>
        </template>
        <!-- Footer -->
        <template v-if="visible && booking" #footer>
            <div class="flex justify-end space-x-2">
                <a-button @click="onClose">Đóng</a-button>
            </div>
        </template>
    </a-drawer>
</template>

<script setup>
    import { defineProps, defineEmits } from 'vue';

    // Props
    const props = defineProps({
        visible: { type: Boolean, default: false },
        booking: { type: Object, required: true },
    });
    const emit = defineEmits(['close']);

    // Sự kiện đóng
    const onClose = () => {
        emit('close');
    };

    // Helper: định dạng ngày giờ và tiền tệ
    const formatDate = (iso) => {
        if (!iso) return '-';
        const d = new Date(iso);
        return d.toLocaleString('vi-VN', { hour12: false });
    };

    const formatTime = (iso) => {
        if (!iso) return '-';
        const d = new Date(iso);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatCurrency = (value) => {
        if (value == null) return '-';
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };
</script>
