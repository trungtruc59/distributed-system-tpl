import { Notification } from '@arco-design/web-vue';
import { defineStore } from 'pinia';

import * as branchService from '@/api/branch';
import * as courtService from '@/api/court';
import dayjs from 'dayjs';
import { Price } from '@/types/itemTypes';
import { postBooking } from '@/api/booking';
import { DayNumberToEnum, DayOfWeek } from './dayMapping.constant';

export type useBookingStoreProps = {
    selectedCourt: any[];
    courts: any[];
    selectedDay: number;
};

const useBookingStore = defineStore('booking', {
    state: (): useBookingStoreProps => ({
        selectedCourt: [],
        courts: [],
        selectedDay: dayjs().unix(),
    }),

    getters: {},

    actions: {
        resetStore() {
            this.selectedCourt = [];
            this.courts = [];
            this.selectedDay = dayjs().unix();
        },
        async getBookedCourt(branchId: string, day: number) {
            const rs = await branchService.getBookedCourtOfBranch(branchId, { day });
            if (rs && 'data' in rs) {
                return rs.data;
            }
            this.showNotify(rs);
            return [];
        },

        async createNewBooking(payload: any) {
            const rs = await postBooking(payload);
            if (rs && 'data' in rs) {
                return rs.data;
            }
            this.showNotify(rs);
            return null;
        },

        async getAllCourtOfBranch(branchId: string) {
            const rs = await courtService.getCourtOfBranch(branchId);
            if (rs && 'data' in rs) {
                this.courts = rs.data;
            } else {
                this.showNotify(rs);
            }
        },

        getPriceOfCourt(courtName: string, period: any) {
            const dayNumber = dayjs(this.selectedDay).day();
            const dayString = DayNumberToEnum[dayNumber];

            const selectedCourt = this.courts.find((c) => c.name === courtName);
            if (!selectedCourt?.prices) return 0;
            return this.calculatePeriodPrice(period, selectedCourt.prices, dayString);
        },

        calculatePeriodPrice(period: any, priceList: Price[], dayOfWeek: keyof typeof DayOfWeek, opts: any = {}) {
            const { priceUnit = 'perHour' } = opts;

            const toMinutes = (t) => {
                const [h, m] = t.split(':').map(Number);
                return h * 60 + m;
            };

            const start = toMinutes(period.start);
            const end = toMinutes(period.end);
            if (end <= start) return 0;

            const dayPrices = priceList.filter((p) => p.dayOfWeek === dayOfWeek);
            if (!dayPrices.length) return 0;

            let total = 0;

            dayPrices.forEach((p) => {
                const pStart = toMinutes(p.startTime);
                const pEnd = toMinutes(p.endTime);
                if (pEnd <= pStart) return;

                const overlapStart = Math.max(start, pStart);
                const overlapEnd = Math.min(end, pEnd);
                if (overlapEnd <= overlapStart) return;

                const overlapMinutes = overlapEnd - overlapStart;

                let pricePerMinute;
                if (priceUnit === 'perHour') {
                    pricePerMinute = p.price / 60;
                } else {
                    pricePerMinute = p.price / (pEnd - pStart);
                }

                total += overlapMinutes * pricePerMinute;
            });

            return Math.round(total);
        },

        showNotify(rs: any) {
            Notification.error({
                title: 'Error',
                content: rs.message,
                closable: true,
                style: { width: '500px' },
            });
        },
    },
});

export default useBookingStore;
