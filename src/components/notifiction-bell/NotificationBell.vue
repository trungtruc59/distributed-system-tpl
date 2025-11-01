<template>
    <a-tooltip :content="$t('settings.navbar.alerts')">
        <div class="message-box-trigger">
            <a-badge :count="unreadCount" :max-count="99">
                <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setPopoverVisible">
                    <icon-notification />
                </a-button>
            </a-badge>
        </div>
    </a-tooltip>
    <a-popover
        trigger="click"
        position="bottom"
        :arrow-style="{ display: 'none' }"
        :content-style="{ padding: 0, maxWidth: '400px', maxHeight: '500px' }"
        content-class="message-popover"
    >
        <div ref="refBtn" class="ref-btn"></div>
        <template #content>
            <message-box :messages="messages" @read="handleReadMessage" />
        </template>
    </a-popover>
</template>

<script setup>
    import { computed, onMounted, ref } from 'vue';
    import { getToken } from '@/utils/auth';
    import notificationSound from '@/assets/sounds/news-ting-6832.mp3';
    import { Notification } from '@arco-design/web-vue';
    import MessageBox from '../message-box/index.vue';

    const messages = ref([]);
    const refBtn = ref();

    const token = getToken();

    const audio = new Audio(notificationSound);

    const socket = new WebSocket(`${import.meta.env.VITE_API_BASE_URL}api/ws?token=${token}`);

    onMounted(() => {
        socket.onopen = () => {
            console.log('✅ WebSocket connected');
            socket.send(JSON.stringify({ cmd: 'GET_NOTIFICATIONS' }));
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.latest) {
                    const oldValue = [...messages.value];
                    oldValue.unshift(data.latest);
                    messages.value = oldValue;

                    Notification.info({
                        title: data.latest.title,
                        content: data.latest.message,
                        closable: true,
                        style: { width: '350px' },
                        duration: 5 * 1000,
                    });
                    audio.currentTime = 0; // tua về đầu nếu đang phát
                    audio.play().catch((err) => {
                        console.warn('⚠️ Không thể phát âm thanh:', err);
                    });
                } else {
                    messages.value = data.data;
                }
            } catch (err) {
                console.error('Lỗi parse JSON:', err);
            }
        };

        socket.onclose = () => {
            console.log('❌ Disconnected');
        };

        socket.onerror = (err) => {
            console.error('⚠️ WebSocket error', err);
        };
    });

    const unreadCount = computed(() => {
        return messages.value.reduce((a, b) => a + !b.read, 0);
    });

    const handleReadMessage = (item) => {
        socket.send(JSON.stringify({ cmd: 'READ_MESSAGE', msgId: item.id }));
        if (!item.read) {
            const readMsg = messages.value.find((msg) => msg.id === item.id);
            readMsg.read = true;
        }
    };

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

<style lang="less">
    .message-popover {
        .arco-popover-content {
            margin-top: 0;
        }
    }
</style>
