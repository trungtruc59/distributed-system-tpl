<template>
    <a-modal
        :visible="visible"
        title="Tạo đơn đặt sân mới"
        width="95%"
        :footer="false"
        :mask-closable="false"
        :body-style="{ maxHeight: '80vh', overflowY: 'auto', padding: '20px' }"
        @cancel="handleCancel"
    >
        <a-spin :loading="loading" style="width: 100%">
            <div class="create-booking-modal">
                <div class="modal-content-grid">
                    <!-- Cột trái: Form thông tin -->
                    <div class="left-column">
                        <div class="column-header">
                            <a-typography-title :heading="6">Thông tin đặt sân</a-typography-title>
                        </div>
                        <a-form ref="formRef" :model="form" layout="vertical" @submit="handleSubmit">
                            <a-form-item label="Chọn ngày" :rules="[{ required: true }]">
                                <a-date-picker
                                    v-model="selectedDate"
                                    style="width: 100%"
                                    :allow-clear="false"
                                    :disabled-date="disablePastDates"
                                    format="DD/MM/YYYY"
                                    @change="handleDateChange"
                                />
                            </a-form-item>

                            <a-form-item field="customerName" label="Tên khách hàng" :rules="[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]">
                                <a-input v-model="form.customerName" placeholder="Nhập tên khách hàng" />
                            </a-form-item>

                            <a-form-item field="phone" label="Số điện thoại" :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại' }]">
                                <a-input v-model="form.phone" placeholder="Nhập số điện thoại" />
                            </a-form-item>

                            <a-form-item field="note" label="Ghi chú">
                                <a-textarea v-model="form.note" placeholder="Ghi chú thêm (nếu có)" :auto-size="{ minRows: 2, maxRows: 4 }" />
                            </a-form-item>

                            <!-- Thông tin đã chọn -->
                            <div v-if="scheduleList.length > 0" class="selected-info">
                                <a-typography-title :heading="6" class="mb-3">Thông tin lịch đặt</a-typography-title>
                                <div class="schedule-list">
                                    <div v-for="(item, index) in scheduleList" :key="index" class="schedule-item">
                                        <div class="flex items-center justify-between text-sm">
                                            <span class="font-semibold text-indigo-600">{{ item.name }}</span>
                                            <span class="text-gray-700">{{ item.start }} - {{ item.end }}</span>
                                            <a-tag color="arcoblue" class="ml-2 whitespace-nowrap">{{ item.totalPrice }} đ</a-tag>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-end items-center text-lg font-semibold text-blue-600 border-t border-gray-200 pt-3 mt-3">
                                    Tổng tiền:
                                    <span class="ml-2 text-indigo-700">{{ totalPrice }} đ</span>
                                </div>
                            </div>

                            <div class="flex justify-end gap-3 mt-6">
                                <a-button @click="handleCancel">Hủy</a-button>
                                <a-button type="primary" :loading="submitting" :disabled="scheduleList.length === 0 || submitting" @click="handleSubmit">
                                    Tạo đơn đặt sân
                                </a-button>
                            </div>
                        </a-form>
                    </div>

                    <!-- Cột phải: TimeGrid -->
                    <div class="right-column">
                        <div class="column-header">
                            <a-typography-title :heading="6">Chọn sân và thời gian</a-typography-title>
                        </div>
                        <div v-if="branchId && courts.length > 0" class="timegrid-container">
                            <div class="flex gap-2 items-center mb-4">
                                <div class="border border-gray-500 w-6 h-6 rounded-sm" />
                                <span>Trống</span>
                                <div class="border border-gray-500 bg-red-300 w-6 h-6 rounded-sm ml-4" />
                                <span>Đã đặt</span>
                                <div class="border border-gray-500 bg-[#4CAF50] w-6 h-6 rounded-sm ml-4" />
                                <span>Đang chọn</span>
                            </div>
                            <div class="timegrid-wrapper">
                                <TimeGrid
                                    :labels="courts.map((court) => court.name)"
                                    :start="branchInfo?.openTime"
                                    :end="branchInfo?.closeTime"
                                    :time-scale="30"
                                    :items="timeGridItems"
                                    :clear-line="false"
                                    select-color="#4CAF50"
                                    @change="handleTimeGridChange"
                                />
                            </div>
                        </div>
                        <div v-else class="empty-state">
                            <a-empty description="Đang tải danh sách sân..." />
                        </div>
                    </div>
                </div>
            </div>
        </a-spin>
    </a-modal>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref, watch } from 'vue';
    import dayjs from 'dayjs';
    import { Message } from '@arco-design/web-vue';
    import type { FormInstance } from '@arco-design/web-vue';
    import TimeGrid from '@/components/time-grid/TimeGrid.vue';
    import useBookingStore from '@/store/modules/booking/bookingStore';
    import useBookingManagementStore from '@/store/modules/booking/bookingManagementStore';
    import { getBranch } from '@/api/branch';
    import { Branch } from '@/types/branchTypes';

    const props = defineProps<{
        visible: boolean;
        branchId: string;
    }>();

    const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'success'): void;
    }>();

    const bookingStore = useBookingStore();
    const bookingManagementStore = useBookingManagementStore();

    const loading = ref(false);
    const submitting = ref(false);
    const formRef = ref<FormInstance>();
    const selectedDate = ref<dayjs.Dayjs>(dayjs());
    const selectedDay = ref(dayjs().unix());
    const timeGridItems = ref<any[]>([]);
    const bookedCourts = ref<any[]>([]);
    const courts = ref<any[]>([]);
    const branchInfo = ref<Branch | null>(null);

    const form = ref({
        customerName: '',
        phone: '',
        note: '',
    });

    const scheduleList = computed(() => {
        const selected: any[] = [];
        timeGridItems.value.forEach((court) => {
            court.periods?.forEach((period: any) => {
                if (!period.disabled) {
                    const currentCourt = courts.value.find((c) => c.name === court.name);
                    if (currentCourt) {
                        const totalPrice = bookingStore.getPriceOfCourt(court.name, period);
                        selected.push({
                            courtId: currentCourt.id,
                            name: court.name,
                            ...period,
                            totalPrice,
                        });
                    }
                }
            });
        });
        return selected;
    });

    const totalPrice = computed(() => {
        return scheduleList.value.reduce((sum, item) => sum + item.totalPrice, 0);
    });

    const disablePastDates = (current: Date) => {
        return dayjs(current).isBefore(dayjs().startOf('day'));
    };

    const handleRenewItems = (bookedList: any[]) => {
        const bookedCourtsMerged = bookedList.reduce((acc: any, b: any) => {
            if (acc[b.courtName]) {
                acc[b.courtName].periods.push({
                    start: dayjs(b.startTime).format('HH:mm'),
                    end: dayjs(b.endTime).format('HH:mm'),
                    color: '#ff6666',
                    disabled: true,
                });
            } else {
                acc[b.courtName] = {
                    name: b.courtName,
                    periods: [
                        {
                            start: dayjs(b.startTime).format('HH:mm'),
                            end: dayjs(b.endTime).format('HH:mm'),
                            color: '#ff6666',
                            disabled: true,
                        },
                    ],
                };
            }
            return acc;
        }, {});

        timeGridItems.value = Object.values(bookedCourtsMerged);
    };
    const loadBookedCourts = async () => {
        if (!props.branchId) return;
        try {
            const res = await bookingStore.getBookedCourt(props.branchId, selectedDay.value);
            bookedCourts.value = res || [];
            handleRenewItems(bookedCourts.value);
        } catch (error) {
            console.error('Failed to load booked courts:', error);
        }
    };

    const handleDateChange = (value: any) => {
        if (value) {
            const dateValue = dayjs(value);
            selectedDate.value = dateValue;
            selectedDay.value = dateValue.unix();
            loadBookedCourts();
        }
    };

    const handleTimeGridChange = (newItems: any[]) => {
        timeGridItems.value = newItems;
    };

    const loadBranchInfo = async () => {
        if (!props.branchId) return;
        try {
            const response = await getBranch(props.branchId);
            if (response && 'data' in response) {
                branchInfo.value = response.data as Branch;
            }
        } catch (error) {
            console.error('Failed to load branch info:', error);
        }
    };

    const loadCourts = async () => {
        if (!props.branchId) return;
        loading.value = true;
        try {
            const courtsData = await bookingStore.getAllCourtOfBranch(props.branchId);
            courts.value = courtsData || [];
        } catch (error) {
            Message.error('Không thể tải danh sách sân');
        } finally {
            loading.value = false;
        }
    };

    const handleCancel = () => {
        form.value = {
            customerName: '',
            phone: '',
            note: '',
        };
        timeGridItems.value = [];
        selectedDate.value = dayjs();
        selectedDay.value = dayjs().unix();
        formRef.value?.resetFields();
        emit('close');
    };

    const handleSubmit = async (e?: Event) => {
        if (e) {
            e.preventDefault();
        }

        if (!formRef.value) {
            Message.warning('Form chưa sẵn sàng');
            return;
        }

        // try {
        //     const valid = await formRef.value.validate();
        //     if (!valid) {
        //         Message.warning('Vui lòng điền đầy đủ thông tin bắt buộc');
        //         return;
        //     }
        // } catch (error) {
        //     Message.warning('Vui lòng kiểm tra lại thông tin đã nhập');
        //     return;
        // }

        if (scheduleList.value.length === 0) {
            Message.warning('Vui lòng chọn ít nhất một sân và thời gian');
            return;
        }

        if (!props.branchId) {
            Message.warning('Vui lòng chọn chi nhánh');
            return;
        }

        submitting.value = true;
        try {
            const payload = {
                customerName: form.value.customerName,
                phone: form.value.phone,
                bookingDate: dayjs().toISOString(),
                paid: false,
                branchId: props.branchId,
                details: scheduleList.value.map((schedule) => {
                    const [sHour, sMinute] = schedule.start.split(':').map(Number);
                    const [eHour, eMinute] = schedule.end.split(':').map(Number);
                    return {
                        itemId: schedule.courtId,
                        quantity: 1,
                        startTime: dayjs(selectedDay.value * 1000)
                            .hour(sHour)
                            .minute(sMinute)
                            .second(0)
                            .millisecond(0)
                            .add(7, 'hours')
                            .toISOString(),
                        endTime: dayjs(selectedDay.value * 1000)
                            .hour(eHour)
                            .minute(eMinute)
                            .second(0)
                            .millisecond(0)
                            .add(7, 'hours')
                            .toISOString(),
                    };
                }),
                note: form.value.note || '',
            };

            console.log('Creating booking with payload:', payload);
            const result = await bookingManagementStore.createBooking(payload);
            console.log('Booking created:', result);
            Message.success('Tạo đơn đặt sân thành công');
            emit('success');
            handleCancel();
        } catch (error: any) {
            console.error('Error creating booking:', error);
            const message = error?.message || 'Không thể tạo đơn đặt sân';
            Message.error(message);
        } finally {
            submitting.value = false;
        }
    };

    watch(
        () => props.visible,
        (newVal) => {
            if (newVal && props.branchId) {
                const today = dayjs();
                selectedDate.value = today;
                selectedDay.value = today.unix();
                loadBranchInfo();
                loadCourts();
                loadBookedCourts();
            } else if (!newVal) {
                handleCancel();
            }
        }
    );

    watch(bookedCourts, (newValue) => {
        handleRenewItems(newValue);
    });

    onMounted(() => {
        if (props.visible) {
            loadBranchInfo();
            loadCourts();
            loadBookedCourts();
        }
    });
</script>

<style scoped lang="less">
    .create-booking-modal {
        padding: 0;
        min-width: 100%;
        width: 100%;
    }

    .modal-content-grid {
        display: flex;
        gap: 0;
        align-items: flex-start;
        width: 100%;
    }

    .left-column {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 350px;
        flex-shrink: 0;
        padding-right: 24px;
        border-right: 1px solid #e5e5e5;
    }

    .column-header {
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e5e5e5;
    }

    .right-column {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 500px;
        padding-left: 24px;
        padding-right: 0;
        min-width: 0;
    }

    .selected-info {
        padding: 16px;
        background-color: #f5f5f5;
        border-radius: 8px;
        margin-top: 8px;
    }

    .schedule-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .schedule-item {
        padding: 8px;
        background-color: white;
        border-radius: 4px;
        border: 1px solid #e5e5e5;
    }

    .timegrid-container {
        width: 100%;
        overflow-x: auto;
        padding-right: 0;
    }

    .timegrid-wrapper {
        width: 100%;
        min-width: 800px;
        overflow-x: auto;
        padding-right: 0;
    }

    .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
    }

    @media (max-width: 1200px) {
        .modal-content-grid {
            grid-template-columns: 1fr;
        }

        .right-column {
            order: -1;
        }
    }
</style>
