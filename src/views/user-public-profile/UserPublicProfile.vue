<template>
    <div class="flex h-screen bg-gray-50">
        <!-- Sidebar -->
        <div class="w-full md:w-96 lg:w-[28rem] xl:w-[30rem] bg-white shadow-lg overflow-y-auto flex-shrink-0">
            <!-- Activity Section -->
            <div class="p-6">
                <h2 class="text-green-600 font-bold mb-4">Hoạt động</h2>
                <a-space direction="vertical" :size="8" class="w-full">
                    <div
                        v-for="item in activityItems"
                        :key="item.id"
                        :class="[
                            'w-full flex items-center justify-between p-4 rounded-lg transition cursor-pointer group',
                            activeSection === item.id ? 'bg-green-50' : 'hover:bg-gray-50',
                        ]"
                        @click="activeSection = item.id"
                    >
                        <div class="flex items-center gap-3">
                            <i :class="[item.icon, 'text-xl text-gray-600']"></i>
                            <span class="text-gray-700">{{ item.label }}</span>
                        </div>
                        <i class="bx bx-chevron-right text-xl text-gray-400 group-hover:text-gray-600"></i>
                    </div>
                </a-space>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <!-- Top Bar -->
            <UserProfile v-if="activeSection === 'profile'" />
            <BookingHistory v-else-if="activeSection === 'history'" />
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import UserProfile from './UserProfile.vue';
    import BookingHistory from './BookingHistory.vue';

    // State
    const activeSection = ref('profile');

    // Data
    const activityItems = [
        {
            id: 'profile',
            icon: 'bx bx-user',
            label: 'Thông tin người dùng',
        },
        {
            id: 'history',
            icon: 'bx bx-calendar',
            label: 'Danh sách lịch đã đặt',
        },
    ];
</script>

<style scoped>
    /* Custom styles for Arco Design buttons */
    :deep(.arco-btn) {
        font-weight: 600;
        border-radius: 0.5rem;
        padding: 0.5rem 1.5rem;
    }

    :deep(.arco-space-item) {
        width: 100%;
    }
</style>
