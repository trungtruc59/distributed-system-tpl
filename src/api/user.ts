// import qs from 'query-string';
import { User, accountRequest } from '@/types/userTypes';
import { CommonAPIErrorResponse, CommonAPIResponse, CommonSearchParams } from '@/types/CommonTypes';
import http from './http';

export interface UserParams {
    current: number;
    pageSize: number;
}
export interface RoleRes {
    id: string;
    title: string;
}
export interface PolicyListRes {
    data: accountRequest[];
    totalPages: number;
    totalElements: number;
}

export const getUsers = (params?: CommonSearchParams) => {
    return http.get<CommonAPIResponse<PolicyListRes>>('api/account', params);
};
export const getUsersByAccountId = (accountId: string) => {
    return http.get<CommonAPIResponse<User[]>>(`api/user/${accountId}`);
};

export const getRoles = () => {
    return http.get<CommonAPIResponse<RoleRes[]>>('api/role');
};

export const addAccount = (data: Partial<accountRequest>) => {
    return http.post<CommonAPIResponse<accountRequest>>('api/auth/register', data);
};
export const updateAccount = (id: string, data: Partial<accountRequest>) => {
    return http.put<CommonAPIResponse<accountRequest>>(`api/account/${id}`, data);
};
export const updateUser = (id: string, data: Partial<User>) => {
    return http.put<CommonAPIResponse<User>>(`api/user/${id}`, data);
};
export const deleteAccount = (id: string) => {
    return http.delete<CommonAPIResponse<void>>(`api/account/${id}`);
};
export const activeAccount = (accountId: string, type: 'active') => {
    return http.post<CommonAPIResponse<void>>('api/auth/verify', { accountId, type });
};
export const updateRole = (accountId: string, role: string) => {
    return http.put<CommonAPIResponse<void>>(`api/account/${accountId}`, { role });
}
export const deleteUser = (id: string) => {
    return http.delete<CommonAPIResponse<void>>(`api/user/${id}`);
};

