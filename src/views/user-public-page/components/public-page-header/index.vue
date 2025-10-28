<template>
    <a-layout-header class="user-public--header shadow-lg">
        <div class="header-left">
            <img src="http://res.cloudinary.com/dnrxsjo5r/image/upload/v1761142948/btn-logo.png.png" alt="Logo" class="logo" @click="handleRedirectToHome" />
        </div>

        <div class="header-search-box">
            <a-button-group v-if="route.name === 'home'">
                <a-input placeholder="Tìm sân..." @press-enter="handleSearchBranch" />
                <a-button shape="circle">
                    <template #icon>
                        <icon-search />
                    </template>
                </a-button>
            </a-button-group>
        </div>

        <div class="header-right">
            <a-button-group>
                <a-button type="text" @click="handleRedirectToLoginPage"> Đăng nhập </a-button>
                <a-button type="text" @click="handleRedirectToRegisterPage"> Đăng ký </a-button>
            </a-button-group>
        </div>
    </a-layout-header>
</template>

<script setup lang="ts">
    import { useRouter, useRoute } from 'vue-router';
    import { IconSearch } from '@arco-design/web-vue/es/icon';
    import useBranchStore from '@/store/modules/branches';
    import useBookingStore from '@/store/modules/booking/bookingStore';

    const { getAllBranchWithParams } = useBranchStore();
    const bookingStore = useBookingStore();
    const router = useRouter();
    const route = useRoute();
    const handleRedirectToLoginPage = () => {
        router.push({ name: 'login' });
    };

    const handleRedirectToHome = () => {
        bookingStore.resetStore();
        router.push({ name: 'home' });
    };

    const handleRedirectToRegisterPage = () => {
        router.push({ name: 'register' });
    };

    const handleSearchBranch = (evt: KeyboardEvent) => {
        const { value } = evt.target;
        getAllBranchWithParams({ searchKey: value });
    };
</script>

<style scoped>
    .user-public--header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 64px;
        background: #fff;
        padding: 0 32px;
        margin-bottom: 1rem;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .logo {
        height: 32px;
        width: auto;
    }

    .app-name {
        font-weight: 600;
        font-size: 18px;
        color: #1d2129;
    }

    .header-right {
        display: flex;
        align-items: center;
    }
    .header-search-box {
        display: flex;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
    }

    .header-search-box .arco-btn-group {
        width: 30%;
        height: 32px;
    }

    .header-search-box .arco-input-wrapper {
        border-radius: 32px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    :deep(.arco-menu) {
        border: none;
    }
</style>
