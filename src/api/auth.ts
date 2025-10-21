import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import http from './http';


export interface LoginData {
  phone: string;
  password: string;
}
export interface RegisterData {
  phone: string;
  password: string;
  repassword: string;
  email: string;
}
export interface LoginRes {
  token: string;
  refreshToken: string;
}

export interface Logout {
  getRefreshToken: string;
}
export function login(data: LoginData) {
  return http.post<LoginRes>('api/auth/login', data);
}
export function register(data: RegisterData) {
  return http.post('api/auth/register', data);
}
export function logout() {
  return Promise.resolve();
}

export function getUserInfo(data: { accountId: string }) {
  return http.post<UserState>('api/auth/info', data);
}

export function getMenuList() {
  return http.post<RouteRecordNormalized[]>('api/user/menu');
}

