<template>
    <a-tooltip :content="$t('settings.navbar.alerts')">
        <div class="message-box-trigger">
            <a-badge :count="9" dot>
                <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setPopoverVisible">
                    <icon-notification />
                </a-button>
            </a-badge>
        </div>
    </a-tooltip>
    <a-popover trigger="click" :arrow-style="{ display: 'none' }" :content-style="{ padding: 0, minWidth: '400px' }" content-class="message-popover">
        <div ref="refBtn" class="ref-btn"></div>
        <template #content>
            <message-box />
        </template>
    </a-popover>
</template>

<script setup>
    import { ref } from 'vue';
    import { getToken } from '@/utils/auth';
    import MessageBox from '../message-box/index.vue';

    const token = getToken();

    const socket = new WebSocket(`${import.meta.env.VITE_API_BASE_URL}api/ws?token=${token}`);

    socket.onopen = () => {
        console.log('✅ WebSocket connected');
        socket.send(JSON.stringify({ type: 'HELLO', content: 'Hi server!' }));
    };

    socket.onmessage = (event) => {
        console.log('📩 Received from server:', event.data);
    };

    socket.onclose = () => {
        console.log('❌ Disconnected');
    };

    socket.onerror = (err) => {
        console.error('⚠️ WebSocket error', err);
    };

    const refBtn = ref();
    const setPopoverVisible = () => {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        refBtn.value.dispatchEvent(event);
    };
</script>

<style lang="less" scoped>
    .nav-btn {
        border-color: var(--color-border);
        color: rgb(var(--gray-8));
        font-size: 14px;
        :deep(.arco-link-icon) {
            font-size: 21px;
        }
    }
</style>
