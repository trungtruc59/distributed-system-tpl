// import qs from 'query-string';
import http from './http';

export interface User {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export interface UserParams {
  current: number;
  pageSize: number;
}

export const queryUserList = () => {
  return http.get('api/account');
};

export interface PolicyListRes {
  list: User[];
  total: number;
}
