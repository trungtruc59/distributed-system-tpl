<template>
    <a-spin style="display: block" :loading="false">
        <a-tabs v-model:activeKey="messageType" type="rounded" destroy-on-hide>
            <a-tab-pane v-for="item in tabList" :key="item.key">
                <template #title>
                    <span> {{ item.title }}{{ formatUnreadLength(item.key) }} </span>
                </template>
                <a-result v-if="!messages.length" status="404">
                    <template #subtitle> {{ $t('messageBox.noContent') }} </template>
                </a-result>
                <List :render-list="messages" :unread-count="unreadCount" @item-click="handleNotificationsClick" />
            </a-tab-pane>
            <template #extra>
                <a-button type="text" @click="emptyList">
                    {{ $t('messageBox.allRead') }}
                </a-button>
            </template>
        </a-tabs>
    </a-spin>
</template>

<script lang="ts" setup>
    import { ref, toRefs, computed, defineProps } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { NotificationMessageProps } from '@/api/message';
    import List from './list.vue';

    interface TabItem {
        key: string;
        title: string;
        avatar?: string;
    }
    const messageType = ref('notice');
    const { t } = useI18n();
    const emit = defineEmits(['read']);
    const props = withDefaults(defineProps<{ messages: NotificationMessageProps[] }>(), {
        messages: () => [],
    });

    const { messages } = toRefs(props);

    const tabList: TabItem[] = [
        {
            key: 'notice',
            title: t('messageBox.tab.title.notice'),
        },
    ];
    const handleNotificationsClick = (notification: NotificationMessageProps) => {
        emit('read', notification);
    };

    const unreadCount = computed(() => {
        return 0;
    });

    const formatUnreadLength = (type: string) => {};
    const emptyList = () => {};
</script>

<style scoped lang="less">
    :deep(.arco-popover-popup-content) {
        padding: 0;
    }

    :deep(.arco-list-item-meta) {
        align-items: flex-start;
    }
    :deep(.arco-tabs-nav) {
        padding: 14px 0 12px 16px;
        border-bottom: 1px solid var(--color-neutral-3);
    }
    :deep(.arco-tabs-content) {
        padding-top: 0;
        .arco-result-subtitle {
            color: rgb(var(--gray-6));
        }
    }
</style>
