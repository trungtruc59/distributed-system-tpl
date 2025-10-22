import { Notification } from '@arco-design/web-vue';
import { CommonSearchParams } from '@/types/CommonTypes';
import { defineStore } from 'pinia';

import * as branchService from '@/api/branch';
import { Branch, BranchRequest } from '@/types/branchTypes';

export type useBranchStoreProps = {
  branches: Branch[];
  total: number;
  totalPages: number;
  selectedBranch: Branch | undefined;
  loading: boolean;
};

const useBranchStore = defineStore('branch', {
  state: (): useBranchStoreProps => ({
    branches: [],
    total: 0,
    totalPages: 1,
    selectedBranch: undefined,
    loading: false,
  }),

  getters: {},

  actions: {
    async getAllBranchWithParams(params?: CommonSearchParams) {
      try {
        this.loading = true;
        const rs = await branchService.getBranches(params);
        this.loading = false;
        if (rs && 'data' in rs) {
          this.branches = rs.data;
        } else {
          this.showNotify(rs);
        }
      } catch (e) {
        this.loading = false;
      }
    },

    async getBranchById(branchId: string) {
      this.loading = true;
      const rs = await branchService.getBranch(branchId);
      this.loading = false;
      if (rs && 'data' in rs) {
        this.selectedBranch = rs.data;
      } else {
        this.showNotify(rs);
      }
    },

    async createBranch(payload: BranchRequest) {
      this.loading = true;
      const rs = await branchService.createNewBranch(payload);
      this.loading = false;
      if (rs && 'data' in rs) {
        this.getAllBranchWithParams();
      } else {
        this.showNotify(rs);
      }
    },

    async updateBranch(payload: BranchRequest) {
      this.loading = true;
      const rs = await branchService.updateBranch(payload);
      this.loading = false;
      if (rs && 'data' in rs) {
        this.selectedBranch = rs.data;
      } else {
        this.showNotify(rs);
      }
    },

    async deleteBranch(branchId: string) {
      this.loading = true;
      const rs = await branchService.deleteBranch(branchId);
      this.loading = false;
      if (rs && 'data' in rs) {
        this.getAllBranchWithParams();
      } else {
        this.showNotify(rs);
      }
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
