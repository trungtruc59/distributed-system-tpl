<template>
    <div class="mx-4">
        <a-card class="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300" :bordered="false">
            <template #title>
                <h2 class="text-center text-2xl font-semibold text-gray-800">Thông tin người dùng</h2>
            </template>

            <!-- Profile -->
            <div class="flex gap-6 pb-6 border-b border-gray-200">
                <div class="w-1/3 border-r flex items-center flex-col border-gray-200">
                    <a-avatar :size="100" class="border-4 border-blue-500">
                        <img :src="user.avatar" alt="Avatar người dùng" />
                    </a-avatar>
                    <div class="text-gray-900 text-xl font-bold mt-2">{{ user.full_name }}</div>
                </div>
                <div class="flex-1">
                    <h4 class="text-xl font-semibold text-gray-800">Thông tin chi tiết</h4>
                    <a-form :model="user">
                        <div v-if="isEditing" class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span class="font-medium text-gray-600">Họ và tên:</span>
                            <span class="text-gray-900"><a-input v-model="user.full_name" placeholder="please enter your post..." /></span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span class="font-medium text-gray-600">Số điện thoại:</span>
                            <span v-if="!isEditing" class="text-gray-900">{{ user.phone }}</span>
                            <span v-else><a-input v-model="user.phone" readonly placeholder="please enter your post..." /></span>
                        </div>
                        <a-input v-model="user.avatar" hidden />
                        <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span class="font-medium text-gray-600">Email:</span>
                            <span v-if="!isEditing" class="text-gray-900">{{ user.email }}</span>
                            <span v-else><a-input v-model="user.email" readonly placeholder="please enter your post..." /></span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span class="font-medium text-gray-600">Ngày tham gia:</span>
                            <span class="text-gray-900">{{ user.joinDate }}</span>
                        </div>
                    </a-form>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end mt-8">
                <a-button type="primary" shape="round" @click="onEdit">
                    <template #icon>
                        <icon-edit />
                    </template>
                    Chỉnh sửa thông tin
                </a-button>
            </div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
    import { IconEdit } from '@arco-design/web-vue/es/icon';

    import { useUserStore } from '@/store';
    import dayjs from 'dayjs';
    import { reactive, ref } from 'vue';

    const isEditing = ref(false);
    const userStore = useUserStore();

    const user = reactive({
        avatar: userStore.avatar,
        full_name: userStore.full_name,
        email: userStore.email,
        phone: userStore.phone,
        joinDate: dayjs(userStore.created_at).format('DD/MM/YYYY'),
        level: 'Vàng',
        countBookings: 5,
        hoursBooked: 12,
    });

    const onEdit = () => {
        // isEditing.value = !isEditing.value;
    };
</script>
