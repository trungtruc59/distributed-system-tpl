<template>
    <div class="wrap-main">
        <Breadcrumb :items="['menu.list', 'menu.list.searchTable']" />
        <a-card class="branch-card" :title="!selectedCourt.id ? 'Thêm sân mới' : 'Chỉnh sửa thông tin sân'">
            <a-form :model="form" layout="vertical" @submit="handleSubmitCourt">
                <a-row :gutter="20">
                    <a-col :span="10">
                        <a-form-item field="name" label="Tên sân">
                            <a-input v-model="form.name" placeholder="Nhập tên sân" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="10">
                        <a-form-item field="description" label="Mô tả">
                            <a-input v-model="form.description" placeholder="Nhập mô tả" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row v-for="(price, index) of form.prices" :key="index" :gutter="24" align="end">
                    <a-col :span="5">
                        <a-form-item :field="`prices[${index}].dayOfWeek`" :label="index === 0 ? `Thứ` : undefined">
                            <a-select v-model="price.dayOfWeek">
                                <a-option value="SUNDAY">Chủ nhật</a-option>
                                <a-option value="MONDAY">Thứ hai</a-option>
                                <a-option value="TUESDAY">Thứ ba</a-option>
                                <a-option value="WEDNESDAY">Thứ tư</a-option>
                                <a-option value="THURSDAY">Thứ năm</a-option>
                                <a-option value="FRIDAY">Thứ sáu</a-option>
                                <a-option value="SATURDAY">Thứ bảy</a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-item :field="`prices[${index}].startTime`" :label="index === 0 ? `Giờ bắt đầu` : undefined">
                            <a-time-picker v-model="price.startTime" :allow-clear="false" placeholder="Chọn giờ bắt đầu" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-item :field="`prices[${index}].endTime`" :label="index === 0 ? `Giờ kết thúc` : undefined">
                            <a-time-picker v-model="price.endTime" :allow-clear="false" placeholder="Chọn giờ kết thúc" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="5">
                        <a-form-item :field="`prices[${index}].price`" :label="index === 0 ? `Giá` : undefined">
                            <a-input-number v-model="price.price" :min="0" placeholder="Nhập giá" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="1">
                        <a-form-item :field="`prices[${index}].isDefault`" :label="index === 0 ? `Mặc định` : undefined">
                            <a-checkbox v-model="price.isDefault" :disabled="true"></a-checkbox>
                        </a-form-item>
                    </a-col>
                    <a-col :span="3" style="margin-bottom: 20px">
                        <a-button :disabled="price.isDefault" :style="{ marginLeft: '10px' }" @click="handleRemovePrice(index)">Delete</a-button>
                    </a-col>
                </a-row>
                <a-button html-type="button" :loading="loading" @click="handleAddPrice">Thêm giá</a-button>
                <a-row justify="end" class="mt-4">
                    <a-button type="primary" :loading="loading" html-type="submit">Lưu</a-button>
                </a-row>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
    import { reactive } from 'vue';
    import useLoading from '@/hooks/loading';
    import useCourtManagementStore from '@/store/modules/court-management/courtManagementStore';
    import { useRouter } from 'vue-router';

    const { loading, setLoading } = useLoading(false);
    const { saveCourt, selectedCourt } = useCourtManagementStore();
    const router = useRouter();

    const getDefaultPrice = (isDefault = false) => {
        return {
            dayOfWeek: 'SUNDAY',
            startTime: '06:00:00',
            endTime: '22:00:00',
            price: 30000,
            isDefault,
        };
    };

    const form = reactive(
        selectedCourt.id
            ? selectedCourt
            : {
                  name: '',
                  type: 'COURT',
                  status: 'available',
                  unit: 'Sân',
                  capacity: 4,
                  description: '',
                  prices: [getDefaultPrice(true)],
              }
    );

    const handleAddPrice = () => {
        form.prices.push(getDefaultPrice());
    };

    const handleRemovePrice = (index) => {
        form.prices.splice(index, 1);
    };

    const handleSubmitCourt = async () => {
        setLoading(true);
        const res = await saveCourt(form);
        setLoading(false);
        if (res) {
            router.push({ name: 'court-listing' });
        }
    };
</script>

<style scoped lang="less">
    .wrap-main {
        padding: 0 20px 20px 20px;
    }
    .branch-card {
        border-radius: 8px;
        padding-top: 20px;
    }
    .branch-information--image {
        width: 80px;
        height: 50px;

        & :deep(.arco-image-img) {
            width: auto;
            height: 60px;
            border-radius: 4px;
        }
    }
    :deep(.arco-table-th) {
        &:last-child {
            .arco-table-th-item-title {
                margin-left: 16px;
            }
        }
    }
    .action-icon {
        margin-left: 12px;
        cursor: pointer;
    }
    .active {
        color: #0960bd;
        background-color: #e3f4fc;
    }
    .setting {
        display: flex;
        align-items: center;
        width: 200px;
        .title {
            margin-left: 12px;
            cursor: pointer;
        }
    }
</style>
