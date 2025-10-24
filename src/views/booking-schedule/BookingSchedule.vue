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
            </a-page-header>
            <div class="p-8">
                <TimeGrid :start="branch.openTime" :end="branch.closeTime" :time-scale="30" :items="items" :clear-line="false" @change="handleChange" />
            </div>
        </a-layout-content>
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
    import { ref } from 'vue';
    import TimeGrid from '@/components/time-grid/TimeGrid.vue';
    import PublicHeader from '@/views/user-public-page/components/public-page-header/index.vue';

    import useBranchStore from '@/store/modules/branches';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const { selectedBranch: branch, setSelectedBranch } = useBranchStore();

    const items = ref([
        {
            name: 'A',
            periods: [
                { start: '06:30', end: '11:00', color: '#ff6666', disabled: true },
                { start: '17:00', end: '21:00', color: '#ff6666' },
            ],
        },
        {
            name: 'B',
            periods: [
                { start: '07:00', end: '10:30', color: '#ff6666' },
                { start: '17:00', end: '21:00', color: '#ff6666' },
            ],
        },
        {
            name: 'C',
            periods: [
                { start: '09:30', end: '11:30', color: '#ff6666' },
                { start: '15:00', end: '21:00', color: 'cyan' },
            ],
        },
        {
            name: 'D',
            periods: [
                { start: '07:30', end: '11:30', color: '#ff6666' },
                { start: '13:00', end: '21:00', color: '#ff6666' },
            ],
        },
        {
            name: 'E',
            periods: [
                { start: '06:00', end: '10:30', color: '#ff6666' },
                { start: '17:00', end: '20:30', color: '#ff6666' },
            ],
        },
        {
            name: 'F',
            periods: [
                { start: '06:00', end: '09:30', color: '#ff6666' },
                { start: '14:00', end: '21:00', color: '#ff6666' },
            ],
        },
    ]);

    const handleBackToHomePage = () => {
        setSelectedBranch({});
        router.push({ name: 'home' });
    };
    const handleChange = (newItems) => {
        console.log('Items changed:', newItems);
        items.value = newItems;
    };
</script>
