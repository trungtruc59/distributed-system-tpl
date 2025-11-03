import { Item } from '@/types/itemTypes';
import { CommonAPIResponse, CommonSearchParams } from '@/types/CommonTypes';
import { ItemPayload } from '@/types/courtType';
import http from './http';

export const getCourtOfBranch = (branchId: string, params?: CommonSearchParams) => {
    return http.get<CommonAPIResponse<Item[]>>(`api/branch/${branchId}/court`, params);
};

export const postCourt = (branchId: string, payload: ItemPayload) => {
    return http.post<CommonAPIResponse<Item[]>>(`api/branch/${branchId}/court`, payload);
};
