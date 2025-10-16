import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import http from './http';

export interface LoginData {
  phone: string;
  password: string;
}

export interface LoginRes {
  token: string;
  refreshToken: string;
}
export function login(data: LoginData) {
  return http.post<LoginRes>('api/auth/login', data);
}

export function logout() {
  return http.post<LoginRes>('api/auth/logout');
}

export function getUserInfo() {
  return http.post<UserState>('api/auth/info');
}

export function getMenuList() {
  return http.post<RouteRecordNormalized[]>('api/user/menu');
}
