import { Notification } from '@arco-design/web-vue';
import { CommonSearchParams } from '@/types/CommonTypes';
import { defineStore } from 'pinia';

import * as branchService from '@/api/branch';
import * as courtService from '@/api/court';
import { Branch, BranchRequest } from '@/types/branchTypes';
import dayjs from 'dayjs';
import { Price } from '@/types/itemTypes';
import { DayNumberToEnum } from '../booking/dayMapping.constant';

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
            }
        },

        async createBranch(payload: BranchRequest) {
            this.isLoading = true;
            const rs = await branchService.createNewBranch(payload);
            this.isLoading = false;
            if (rs && 'data' in rs) {
                this.getAllBranchWithParams();
            }
        },

        async updateBranch(branchId:string,payload: BranchRequest) {
            this.isLoading = true;
            const rs = await branchService.updateBranch(branchId,payload);
            this.isLoading = false;
            if (rs && 'data' in rs) {
                this.selectedBranch = rs.data;
            }
        },

        async deleteBranch(branchId: string) {
            this.isLoading = true;
            const rs = await branchService.deleteBranch(branchId);
            this.isLoading = false;
            if (rs && 'data' in rs) {
                this.getAllBranchWithParams();
            }
        },

        setSelectedBranch(branch: Branch) {
            this.selectedBranch = branch;
        },
    },
});

export default useBranchStore;
