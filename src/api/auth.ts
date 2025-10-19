import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import http from './http';

export interface LoginData {
  phone: string;
  password: string;
}

export interface LoginRes {
  data: {
    token: string;
    refreshToken: string;
  }
}

export interface Logout {
  getRefreshToken: string;
}
export function login(data: LoginData) {
  return http.post<LoginRes>('api/auth/login', data);
}

export function logout(data: Logout) {
  return http.post<Logout>('api/auth/logout', data);
}

export function getUserInfo(data: { accountId: string }) {
  return http.post<UserState>('api/auth/info', data);
}

export function getMenuList() {
  return http.post<RouteRecordNormalized[]>('api/user/menu');
}
