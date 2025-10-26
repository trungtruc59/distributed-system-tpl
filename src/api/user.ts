// import qs from 'query-string';
import { User } from '@/types/userTypes';
import { CommonAPIErrorResponse, CommonAPIResponse, CommonSearchParams } from '@/types/CommonTypes';
import http from './http';

export interface UserParams {
    current: number;
    pageSize: number;
}
export interface PolicyListRes {
    data: User[];
    totalPages: number;
    totalElements: number;
}

export const getUsers = (params?: CommonSearchParams) => {
    return http.get<CommonAPIResponse<PolicyListRes>>('api/account', params);
};
export const getUsersByAccountId = (accountId: string) => {
    return http.get<CommonAPIResponse<User[]>>(`api/user/${accountId}`);
};
export const addAccount = (data: Partial<User>) => {
    return http.post<CommonAPIResponse<User>>('api/auth/register', data);
};
export const updateAccount = (id: string, data: Partial<User>) => {
    return http.put<CommonAPIResponse<User>>(`api/account/${id}`, data);
};
export const updateUser = (id: string, data: Partial<User>) => {
    return http.put<CommonAPIResponse<User>>(`api/user/${id}`, data);
};
export const deleteAccount = (id: string) => {
    return http.delete<CommonAPIResponse<void>>(`api/account/${id}`);
};
export const deleteUser = (id: string) => {
    return http.delete<CommonAPIResponse<void>>(`api/user/${id}`);
};

