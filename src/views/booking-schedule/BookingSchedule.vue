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
                    <a-date-picker style="width: 200px" :default-value="dayjs()" :allow-clear="false" :disabled-date="disablePastDates" @change="handleChangeTime" />
                </template>
            </a-page-header>
            <a-spin :loading="isLoading" style="width: 100%">
                <div class="p-8">
                    <TimeGrid
                        :labels="branchStore.courts.map((court) => court.name)"
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
            <a-button :disabled="isDisablePayButton" type="outline">Tiếp theo</a-button>
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
    import TimeGrid from '@/components/time-grid/TimeGrid.vue';
    import PublicHeader from '@/views/user-public-page/components/public-page-header/index.vue';

    import useBranchStore from '@/store/modules/branches';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const branchStore = useBranchStore();
    const { selectedBranch: branch, setSelectedBranch, getBookedCourt, getAllCourtOfBranch } = useBranchStore();
    const items = ref([]);
    const bookedCourts = ref([]);
    const selectedDay = ref(dayjs().unix());
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

    const handleBackToHomePage = () => {
        setSelectedBranch({});
        router.push({ name: 'home' });
    };
    const handleChange = (newItems) => {
        items.value = newItems;
    };

    const disablePastDates = (current) => {
        return dayjs(current).isBefore(dayjs().startOf('day'));
    };

    const handleChangeTime = (value) => {
        selectedDay.value = dayjs(value).unix();
    };

    onMounted(async () => {
        if (!branch?.id) return;
        isLoading.value = true;
        await getAllCourtOfBranch(branch.id);
        const res = await getBookedCourt(branch.id, selectedDay.value);
        bookedCourts.value = res;
        isLoading.value = false;
    });

    watch(selectedDay, async (newVal, oldVal) => {
        if (newVal !== oldVal) {
            isLoading.value = true;
            bookedCourts.value = await getBookedCourt(branch.id, selectedDay.value);
            isLoading.value = false;
        }
    });

    watch(bookedCourts, (newValue) => {
        handleRenewItems(newValue);
    });

    // watch(items, (v) => {
    //     console.log({ items: v });
    // });

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
