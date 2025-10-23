// import qs from 'query-string';
import { User } from '@/types/userTypes';
import { CommonAPIErrorResponse, CommonAPIResponse, CommonSearchParams } from '@/types/CommonTypes';
import http from './http';

export interface UserParams {
  current: number;
  pageSize: number;
}

export const getUsers = (params?: CommonSearchParams) => {
  return http.get<CommonAPIResponse<User[]> | CommonAPIErrorResponse>(
    'api/account',
    params
  );
};
export const getUsersByAccountId = (accountId: string) => {
  return http.get<CommonAPIResponse<User[]> | CommonAPIErrorResponse>(
    `api/user/${accountId}`
  );
};

export interface PolicyListRes {
  list: User[];
  total: number;
}
