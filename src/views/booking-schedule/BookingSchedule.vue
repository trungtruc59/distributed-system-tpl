<template>
    <div class="p-8">
        <TimeGrid start="2025-01-01T06:00:00" end="2025-01-01T22:00:00" :time-scale="30" :items="items" :clear-line="false" @change="handleChange" />
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import TimeGrid from '@/components/time-grid/TimeGrid.vue';

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

    const handleChange = (newItems) => {
        console.log('Items changed:', newItems);
        items.value = newItems;
    };
</script>
