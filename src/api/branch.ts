import {
  CommonAPIErrorResponse,
  CommonAPIResponse,
  CommonSearchParams,
} from '@/types/CommonTypes';
import { Branch, BranchRequest } from '@/types/branchTypes';
import http from './http';

export const getBranches = (params?: CommonSearchParams) => {
  return http.get<CommonAPIResponse<Branch[]> | CommonAPIErrorResponse>(
    'api/branch',
    params
  );
};

export const getBranch = (branchId: string) => {
  return http.get<CommonAPIResponse<Branch> | CommonAPIErrorResponse>(
    `api/branch/${branchId}`
  );
};

export const createNewBranch = (payload: BranchRequest) => {
  return http.post<CommonAPIResponse<Branch> | CommonAPIErrorResponse>(
    'api/branch',
    payload
  );
};

export const updateBranch = (payload: BranchRequest) => {
  return http.put<CommonAPIResponse<Branch> | CommonAPIErrorResponse>(
    'api/branch',
    payload
  );
};

export const deleteBranch = (branchId: string) => {
  return http.get<CommonAPIResponse<boolean> | CommonAPIErrorResponse>(
    `api/branch/${branchId}`
  );
};
