import { Notification } from '@arco-design/web-vue';
import { CommonSearchParams } from '@/types/CommonTypes';
import { defineStore } from 'pinia';

import * as branchService from '@/api/branch';
import * as courtService from '@/api/court';
import { Branch, BranchRequest } from '@/types/branchTypes';
import dayjs from 'dayjs';
import { Price } from '@/types/itemTypes';
import { DayNumberToEnum } from './dayMapping.constant';

export type useBranchStoreProps = {
    branches: Branch[];
    total: number;
    totalPages: number;
    selectedBranch: Branch | undefined;
    isLoading: boolean;
    courts: any[];
};

const useBranchStore = defineStore('branch', {
    state: (): useBranchStoreProps => ({
        branches: [],
        total: 0,
        totalPages: 1,
        selectedBranch: undefined,
        isLoading: false,
        courts: [],
    }),

    getters: {},

    actions: {
        async getAllBranchWithParams(params?: CommonSearchParams) {
            try {
                this.isLoading = true;
                const rs = await branchService.getBranches(params);
                this.isLoading = false;
                if (rs && 'data' in rs) {
                    this.branches = rs.data;
                } else {
                    this.showNotify(rs);
                }
            } catch (e) {
                this.isLoading = false;
            }
        },

        async getBranchById(branchId: string) {
            this.isLoading = true;
            const rs = await branchService.getBranch(branchId);
            this.isLoading = false;
            if (rs && 'data' in rs) {
                this.selectedBranch = rs.data;
            } else {
                this.showNotify(rs);
            }
        },

        async createBranch(payload: BranchRequest) {
            this.isLoading = true;
            const rs = await branchService.createNewBranch(payload);
            this.isLoading = false;
            if (rs && 'data' in rs) {
                this.getAllBranchWithParams();
            } else {
                this.showNotify(rs);
            }
        },

        async updateBranch(payload: BranchRequest) {
            this.isLoading = true;
            const rs = await branchService.updateBranch(payload);
            this.isLoading = false;
            if (rs && 'data' in rs) {
                this.selectedBranch = rs.data;
            } else {
                this.showNotify(rs);
            }
        },

        async deleteBranch(branchId: string) {
            this.isLoading = true;
            const rs = await branchService.deleteBranch(branchId);
            this.isLoading = false;
            if (rs && 'data' in rs) {
                this.getAllBranchWithParams();
            } else {
                this.showNotify(rs);
            }
        },

        async getBookedCourt(branchId: string, day: number) {
            const rs = await branchService.getBookedCourtOfBranch(branchId, { day });
            if (rs && 'data' in rs) {
                return rs.data;
            }
            this.showNotify(rs);
            return [];
        },

        async getAllCourtOfBranch(branchId: string) {
            const rs = await courtService.getCourtOfBranch(branchId);
            if (rs && 'data' in rs) {
                console.log({ rs });

                this.courts = rs.data;
            } else {
                this.showNotify(rs);
            }
        },

        getPriceOfCourt(courtName: string, selectedDay: string) {
            const dayNumber = dayjs(selectedDay).day();
            const dayString = DayNumberToEnum[dayNumber];

            const selectedCourt = this.courts.find((c) => c.name === courtName);
            return selectedCourt.prices.filter((price: Price) => price.dayOfWeek === dayString);
        },

        setSelectedBranch(branch: Branch) {
            this.selectedBranch = branch;
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

export default useBranchStore;
