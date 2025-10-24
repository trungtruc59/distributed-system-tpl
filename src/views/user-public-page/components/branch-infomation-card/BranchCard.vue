<template>
    <a-card class="branch-information--card" :body-style="{ padding: 0 }">
        <div class="relative">
            <a-image :src="branch.thumbnail" :alt="branch.name" :preview="false" fit="cover" class="branch-information--image" />
            <div class="rating-tag"> <i class="bx bxs-star"></i> 0 </div>
        </div>

        <div class="branch-information--content">
            <div class="branch-information--header">
                <img :src="branch.logo" class="branch-information--logo" style="width: 60px; height: auto" />
                <div>
                    <div class="branch-information--title">
                        {{ branch.name }}
                    </div>
                    <div class="branch-information--address-group">
                        <div>
                            <div class="branch-information--address">
                                {{ branch.address }}
                            </div>
                            <div class="branch-information--footer">
                                <div class="branch-information---hours">
                                    <i class="bx bx-clock-4"></i> {{ formatOpenAndCloseTimeOfBranch(branch.openTime, branch.closeTime) }}
                                </div>
                                <a-link><i class="bx bx-phone"></i> &nbsp; liên hệ </a-link>
                            </div>
                        </div>
                        <a-button type="primary" size="mini" shape="round" class="booking-btn" @click="handleClickSchedule"> ĐẶT LỊCH </a-button>
                    </div>
                </div>
            </div>
        </div>
    </a-card>
</template>

<script setup lang="ts">
    import { Branch } from '@/types/branchTypes';
    import { toRefs } from 'vue';
    import { formatOpenAndCloseTimeOfBranch } from '@/utils/timeUtils';
    import { useRouter } from 'vue-router';
    import useBranchStore from '@/store/modules/branches';

    const { setSelectedBranch } = useBranchStore();
    const router = useRouter();

    const props = withDefaults(
        defineProps<{
            branch: Branch;
        }>(),
        {
            branch: () => ({
                id: '',
                createdAt: '',
                updatedAt: '',
                name: '',
                address: '',
                phone: '',
                openTime: '',
                closeTime: '',
                logo: '',
                thumbnail: '',
            }),
        }
    );

    const { branch } = toRefs(props);

    const handleClickSchedule = () => {
        setSelectedBranch(branch.value);
        router.push({ name: 'schedule' });
    };
</script>

<style scoped>
    .branch-information--card {
        width: 470px;
        border-radius: 12px;
        overflow: hidden;
        position: relative;
        padding: 0 !important;
    }

    .branch-information--image {
        width: 100%;
        height: 160px;
        object-fit: cover;
    }
    .rating-tag {
        position: absolute;
        top: 10px;
        left: 10px;
        background: white;
        border-radius: 12px;
        padding: 2px 8px;
        font-weight: 600;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 0.2em;
        line-height: 14px;
    }
    .rating-tag i {
        color: orange;
    }
    .tag-container {
        position: absolute;
        top: 10px;
        left: 80px;
        display: flex;
        gap: 4px;
    }
    .favorite-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: white;
        color: #333;
    }
    .branch-information--content {
        padding: 12px 16px;
        position: relative;
        background: white;
    }
    .branch-information--header {
        display: flex;
        align-items: flex-start;
        gap: 8px;
    }
    .branch-information--logo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }
    .branch-information--title {
        font-weight: 600;
        font-size: 15px;
        display: flex;
        align-items: center;
    }
    .branch-information--distance {
        color: #f53f3f;
        font-size: 13px;
    }
    .branch-information--address {
        font-size: 13px;
        color: #555;
        margin-top: 6px;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .branch-information--footer {
        display: flex;
        /* justify-content: space-between; */
        align-items: center;
        font-size: 13px;
        gap: 1.5rem;
    }
    .branch-information--address-group {
        display: flex;
        gap: 1rem;
    }

    .branch-information---hours {
        display: flex;
        align-items: center;
        gap: 0.2em;
        line-height: 14px;
    }

    .branch-information--main-group {
        display: flex;
    }

    .booking-btn {
        font-weight: 600;
    }
</style>
