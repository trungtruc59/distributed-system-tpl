import { CommonAPIResponse, CommonSearchParams } from '@/types/CommonTypes';
import { Branch, BranchRequest } from '@/types/branchTypes';
import { BookingItem } from '@/types/bookingTypes';
import http from './http';

export const getBranches = (params?: CommonSearchParams) => {
    return http.get<CommonAPIResponse<Branch[]>>('api/branch', params);
};

export const getBranch = (branchId: string) => {
    return http.get<CommonAPIResponse<Branch>>(`api/branch/${branchId}`);
};

export const getBookedCourtOfBranch = (branchId: string, params: any) => {
    return http.get<CommonAPIResponse<BookingItem[]>>(`api/branch/${branchId}/booked-court`, params);
};

export const createNewBranch = (payload: BranchRequest) => {
    return http.post<CommonAPIResponse<Branch>>('api/branch', payload);
};

export const updateBranch = (payload: BranchRequest) => {
    return http.put<CommonAPIResponse<Branch>>('api/branch', payload);
};

export const deleteBranch = (branchId: string) => {
    return http.get<CommonAPIResponse<boolean>>(`api/branch/${branchId}`);
};
