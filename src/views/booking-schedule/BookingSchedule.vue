<template>
    <a-layout>
        <PublicHeader />
        <a-layout-content v-if="branch?.id">
            <a-page-header :style="{ background: 'var(--color-bg-2)' }" class="border-b border-gray-200" @back="handleBackToHomePage">
                <template #title>
                    <div class="flex gap-4 items-center border-b-px">
                        <img :src="branch?.logo" class="rounded-full" style="width: 45px; height: auto" />
                        {{ branch?.name }}
                    </div>
                </template>
                <template #extra>
                    <a-date-picker
                        style="width: 200px"
                        :default-value="bookingStore.selectedDay * 1000"
                        :allow-clear="false"
                        :disabled-date="disablePastDates"
                        @change="handleChangeTime"
                    />
                </template>
            </a-page-header>
            <a-spin :loading="isLoading" style="width: 100%">
                <div class="p-8">
                    <div class="flex gap-2 items-center mb-8">
                        <div class="border border-gray-500 w-6 h-6 rounded-sm" />
                        Trống
                        <div class="border border-gray-500 bg-red-300 w-6 h-6 rounded-sm" />
                        Đã đặt
                        <div class="border border-gray-500 bg-[#4CAF50] w-6 h-6 rounded-sm" />
                        Đang chọn
                    </div>
                    <TimeGrid
                        :labels="bookingStore.courts.map((court) => court.name)"
                        :start="branch.openTime"
                        :end="branch.closeTime"
                        :time-scale="30"
                        :items="items"
                        :clear-line="false"
                        select-color="#4CAF50"
                        @change="handleChange"
                    />
                </div>
            </a-spin>
        </a-layout-content>
        <a-layout-footer v-if="branch?.id" class="flex justify-end px-4">
            <a-button :disabled="isDisablePayButton" type="outline" @click="handlePaymentCourt">Tiếp theo</a-button>
        </a-layout-footer>
        <a-result v-if="!branch?.id" status="404" subtitle="Whoops, that page is gone.">
            <template #extra>
                <a-space>
                    <a-button type="primary" @click="handleBackToHomePage">Back</a-button>
                </a-space>
            </template>
        </a-result>
    </a-layout>
</template>

<script setup>
    import dayjs from 'dayjs';
    import { ref, onMounted, watch, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import TimeGrid from '@/components/time-grid/TimeGrid.vue';
    import PublicHeader from '@/views/user-public-page/components/public-page-header/index.vue';

    import useBranchStore from '@/store/modules/branches';
    import useBookingStore from '@/store/modules/booking/bookingStore';

    const router = useRouter();

    const bookingStore = useBookingStore();
    const { selectedBranch: branch, setSelectedBranch } = useBranchStore();
    const items = ref([]);
    const bookedCourts = ref([]);
    const isLoading = ref(false);

    const handleRenewItems = (bookedList) => {
        const bookedCourtsMerged = bookedList.reduce((a, b) => {
            if (a[b.courtName]) {
                a[b.courtName].periods.push({ start: dayjs(b.startTime).format('HH:mm'), end: dayjs(b.endTime).format('HH:mm'), color: '#ff6666', disabled: true });
            } else {
                a[b.courtName] = {
                    name: b.courtName,
                    periods: [{ start: dayjs(b.startTime).format('HH:mm'), end: dayjs(b.endTime).format('HH:mm'), color: '#ff6666', disabled: true }],
                };
            }

            return a;
        }, {});

        items.value = Object.values(bookedCourtsMerged);
    };

    const handlePaymentCourt = () => {
        bookingStore.selectedCourt = items;
        router.push({ name: 'payment' });
    };

    const handleBackToHomePage = () => {
        setSelectedBranch({});
        bookingStore.resetStore();
        router.push({ name: 'home' });
    };
    const handleChange = (newItems) => {
        items.value = newItems;
    };

    const disablePastDates = (current) => {
        return dayjs(current).isBefore(dayjs().startOf('day'));
    };

    const handleChangeTime = (value) => {
        bookingStore.selectedDay = dayjs(value).unix();
    };

    onMounted(async () => {
        if (!branch?.id) return;
        isLoading.value = true;
        await bookingStore.getAllCourtOfBranch(branch.id);
        const res = await bookingStore.getBookedCourt(branch.id, bookingStore.selectedDay);
        bookedCourts.value = res;
        isLoading.value = false;
    });

    watch(bookingStore.selectedDay, async (newVal, oldVal) => {
        if (newVal !== oldVal) {
            isLoading.value = true;
            bookedCourts.value = await bookingStore.getBookedCourt(branch.id, bookingStore.selectedDay);
            isLoading.value = false;
        }
    });

    watch(bookedCourts, (newValue) => {
        if (bookingStore.selectedCourt.length) {
            items.value = bookingStore.selectedCourt;
            return;
        }
        handleRenewItems(newValue);
    });

    const isDisablePayButton = computed(() => {
        const selectedCourts = [];
        items.value.forEach((item) => {
            item.periods.forEach((period) => {
                if (!period.disabled) {
                    selectedCourts.push(period);
                }
            });
        });

        return selectedCourts.length === 0;
    });
</script>
