import { defineStore } from 'pinia';

import * as branchService from '@/api/branch';
import * as courtService from '@/api/court';
import dayjs from 'dayjs';
import { Price } from '@/types/itemTypes';
import { postBooking, getBookingHistory } from '@/api/booking';
import { ItemPayload } from '@/types/courtType';

export type useCourtManagementStoreProps = {
    selectedCourt: Record<string, any>;
    selectedBranch: string;
};

const useCourtManagementStore = defineStore('court-management', {
    state: (): useCourtManagementStoreProps => ({
        selectedCourt: {},
        selectedBranch: '',
    }),

    getters: {},

    actions: {
        resetStore() {
            this.selectedCourt = {};
            this.selectedBranch = '';
        },

        async saveCourt(data: ItemPayload) {
            const res = await courtService.postCourt(this.selectedBranch, data);
            if (res && 'data' in res) {
                return true;
            }
            return false;
        },
    },
});

export default useCourtManagementStore;
