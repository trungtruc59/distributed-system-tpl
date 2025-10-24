<template>
    <a-layout-header class="user-public--header">
        <div class="header-left">
            <img src="http://res.cloudinary.com/dnrxsjo5r/image/upload/v1761142948/btn-logo.png.png" alt="Logo" class="logo" />
        </div>

        <div class="header-search-box">
            <a-input-search placeholder="Tìm sân..." />
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
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const handleRedirectToLoginPage = () => {
        router.push({ name: 'login' });
    };

    const handleRedirectToRegisterPage = () => {
        router.push({ name: 'register' });
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
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

    .header-search-box .arco-input-search {
        width: 40%;
        height: 32px;
        border-radius: 32px;
    }

    :deep(.arco-menu) {
        border: none;
    }
</style>
