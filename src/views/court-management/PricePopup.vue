<template>
    <a-modal :visible="visible" title="Bảng giá sân" width="700px" :footer="false" @cancel="handleCancel">
        <div v-if="hasData" class="overflow-x-auto">
            <table class="w-full border border-gray-300 border-collapse text-sm">
                <thead class="bg-gray-100">
                    <tr class="text-gray-700 font-semibold text-center">
                        <th class="border border-gray-300 px-3 py-2 w-1/4">Ngày</th>
                        <th class="border border-gray-300 px-3 py-2 w-1/2">Khung giờ</th>
                        <th class="border border-gray-300 px-3 py-2 w-1/4">Giá (VNĐ)</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(items, day) in groupedPrices" :key="day">
                        <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-blue-50 transition text-center">
                            <td v-if="index === 0" :rowspan="items.length" class="border border-gray-300 font-medium text-blue-700 capitalize">
                                {{ dayLabels[day] || day }}
                            </td>
                            <td class="border border-gray-300 px-3 py-2"> {{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }} </td>
                            <td class="border border-gray-300 px-3 py-2 font-semibold text-gray-800">
                                {{ formatPrice(item.price) }}
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <div v-else class="text-gray-500 text-center py-6"> Không có dữ liệu giá sân. </div>
    </a-modal>
</template>

<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        visible: Boolean,
        priceList: {
            type: Array,
            default: () => [],
        },
    });
    const emit = defineEmits(['cancel']);

    const handleCancel = () => {
        emit('cancel');
    };

    // Map thứ sang tiếng Việt
    const dayLabels = {
        MONDAY: 'Thứ Hai',
        TUESDAY: 'Thứ Ba',
        WEDNESDAY: 'Thứ Tư',
        THURSDAY: 'Thứ Năm',
        FRIDAY: 'Thứ Sáu',
        SATURDAY: 'Thứ Bảy',
        SUNDAY: 'Chủ Nhật',
    };

    const hasData = computed(() => props.priceList?.length > 0);

    const groupedPrices = computed(() => {
        const grouped = props.priceList.reduce((acc, item) => {
            const key = item.dayOfWeek || 'UNKNOWN';
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});

        const order = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

        const ordered = {};
        order.forEach((day) => {
            if (grouped[day]) {
                ordered[day] = grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
            }
        });
        Object.keys(grouped).forEach((key) => {
            if (!ordered[key]) ordered[key] = grouped[key];
        });
        return ordered;
    });

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price ?? 0);
    const formatTime = (time) => (time ? time.slice(0, 5) : '');
</script>
