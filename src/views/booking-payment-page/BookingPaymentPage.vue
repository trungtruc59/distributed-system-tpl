<template>
    <div v-if="branch?.id">
        <a-scrollbar style="height: calc(100dvh - 64px); overflow: auto; width: 100%">
            <div class="container mx-auto flex flex-col gap-6 p-4">
                <!-- <a-breadcrumb :routes="routes" /> -->
                <div class="w-full bg-white rounded-2xl shadow p-8 space-y-10">
                    <!-- Thông tin sân -->
                    <section>
                        <a-typography-title :heading="5" class="mb-2 flex items-center gap-3"><i class="bxr bx-shuttlecock text-3xl"></i> Thông tin sân</a-typography-title>
                        <a-typography-paragraph>
                            <span class="font-medium">Tên sân:</span> CLB Cầu Lông TPT Sport - Làng Đại Học <br />
                            <span class="font-medium">Địa chỉ:</span> Đ. Tôn Đức Thắng, Đông Hòa, Dĩ An, Bình Dương
                        </a-typography-paragraph>
                    </section>

                    <a-divider />

                    <!-- Thông tin lịch đặt -->
                    <section>
                        <a-typography-title :heading="5" class="mb-4 flex items-center gap-3"><i class="bxr bx-calendar-alt text-3xl"></i> Thông tin lịch đặt</a-typography-title>
                        <p class="text-sm text-gray-600 mb-4">
                            Ngày:
                            <span class="font-medium text-gray-800">
                                {{ dayjs(selectedDay * 1000).format('DD/MM/YYYY') }}
                            </span>
                        </p>

                        <!-- Danh sách lịch -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <a-card
                                v-for="(item, index) in scheduleList"
                                :key="index"
                                hoverable
                                :body-style="{ display: 'none' }"
                                class="rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200"
                            >
                                <template #title>
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="font-semibold text-indigo-600 truncate max-w-[120px]">{{ item.name }}</span>
                                        <span class="text-gray-700">{{ item.start }} - {{ item.end }}</span>
                                        <a-tag color="arcoblue" class="ml-2 whitespace-nowrap">{{ item.totalPrice }} đ</a-tag>
                                    </div>
                                </template>
                            </a-card>
                        </div>

                        <!-- Tổng tiền -->
                        <div class="flex justify-end items-center text-lg font-semibold text-blue-600 mt-6 border-t border-gray-200 pt-4">
                            Tổng tiền:
                            <span class="ml-2 text-indigo-700">{{ totalPrice }} đ</span>
                        </div>
                    </section>

                    <a-divider />

                    <!-- Thông tin khách hàng -->
                    <section>
                        <a-typography-title :heading="5" class="mb-4 flex items-center gap-3"><i class="bxr bx-user text-3xl"></i> Thông tin khách hàng</a-typography-title>

                        <a-form :model="form" layout="vertical" class="space-y-4" @submit="handleSubmit">
                            <a-form-item field="name" label="Tên của bạn" :rules="[{ required: true, message: 'Vui lòng nhập tên' }]">
                                <a-input v-model="form.name" placeholder="Nhập tên của bạn" />
                            </a-form-item>

                            <a-form-item field="phone" label="Số điện thoại" :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại' }]">
                                <a-input v-model="form.phone" placeholder="Nhập số điện thoại" />
                            </a-form-item>

                            <a-form-item field="note" label="Ghi chú">
                                <a-textarea v-model="form.note" placeholder="Ghi chú thêm (nếu có)" auto-size />
                            </a-form-item>

                            <div class="flex justify-end gap-3">
                                <a-button :disabled="isCreateBookingLoading" html-type="button" @click="handleBackToSchedule">Quay lại</a-button>
                                <a-button :loading="isCreateBookingLoading" type="primary" html-type="submit">Xác nhận đặt lịch</a-button>
                            </div>
                        </a-form>
                    </section>
                </div>
            </div>
        </a-scrollbar>
    </div>

    <!-- Khi không có branch -->
    <a-result v-else status="404" subtitle="Whoops, that page is gone.">
        <template #extra>
            <a-space>
                <a-button type="primary" @click="handleBackToHomePage">Back</a-button>
            </a-space>
        </template>
    </a-result>
</template>

<script setup>
    import { computed, reactive, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import dayjs from 'dayjs';
    import useBranchStore from '@/store/modules/branches';
    import { Modal } from '@arco-design/web-vue';
    import useBookingStore from '@/store/modules/booking/bookingStore';
    import { useUserStore } from '@/store';

    const router = useRouter();
    const branchStore = useBranchStore();
    const userStore = useUserStore();
    const { selectedBranch: branch } = branchStore;
    const { selectedDay, selectedCourt, getPriceOfCourt, createNewBooking, courts, resetStore } = useBookingStore();

    const isCreateBookingLoading = ref(false);
    const routes = [{ label: 'Trang chủ' }, { path: '/payment', label: 'Thanh toán' }];

    // Danh sách lịch đặt
    const scheduleList = computed(() => {
        const selected = [];
        selectedCourt.forEach((court) => {
            court.periods.forEach((period) => {
                if (!period.disabled) {
                    const currentCourt = courts.find((c) => c.name === court.name);
                    const totalPrice = getPriceOfCourt(court.name, period);
                    selected.push({ courtId: currentCourt.id, name: court.name, ...period, totalPrice });
                }
            });
        });
        return selected;
    });

    // Tính tổng tiền
    const totalPrice = computed(() => scheduleList.value.reduce((a, b) => a + b.totalPrice, 0));

    const form = reactive({
        name: userStore.full_name || '',
        phone: userStore.phone || '',
        note: '',
    });

    const handleBackToHomePage = () => {
        branchStore.selectedBranch = {};
        resetStore();
        router.push({ name: 'home' });
    };
    const handleBackToSchedule = () => {
        router.push({ name: 'schedule' });
    };

    const handleSubmit = async () => {
        isCreateBookingLoading.value = true;

        const payload = {
            customerName: form.name,
            phone: form.phone,
            bookingDate: dayjs().toISOString(),
            paid: false,
            branchId: branch.id,
            details: scheduleList.value.map((schedule) => {
                const [sHour, sMinute] = schedule.start.split(':').map(Number);
                const [eHour, eMinute] = schedule.end.split(':').map(Number);
                return {
                    itemId: schedule.courtId,
                    quantity: 1,
                    startTime: dayjs(selectedDay * 1000)
                        .hour(sHour)
                        .minute(sMinute)
                        .second(0)
                        .millisecond(0)
                        .add(7, 'hour')
                        .toISOString(),
                    endTime: dayjs(selectedDay * 1000)
                        .hour(eHour)
                        .minute(eMinute)
                        .second(0)
                        .millisecond(0)
                        .add(7, 'hour')
                        .toISOString(),
                };
            }),
        };

        const rs = await createNewBooking(payload);
        isCreateBookingLoading.value = false;
        if (rs) {
            Modal.success({
                title: 'Đặt lịch thành công',
                content: `Đơn đặt sân của bạn đã được xác nhận. \n 
                        Vui lòng đến sân đúng giờ và thực hiện thanh toán trực tiếp tại quầy. \n
                        Xin cảm ơn quý khách!`,
                okText: 'Quay về trang chủ',
                onOk: handleBackToHomePage,
            });
        } else {
            Modal.error({
                title: 'Đặt lịch thất bại',
                content: `Đặt sân thất bại do hệ thống không thể xử lý yêu cầu. \n
                        Quý khách vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ để được trợ giúp.\n
                        Xin lỗi vì sự bất tiện này.`,
                okText: 'Xác nhận',
            });
        }
    };
</script>

<style scoped>
    .a-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .a-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .arco-card-body {
        display: none !important;
    }
</style>
