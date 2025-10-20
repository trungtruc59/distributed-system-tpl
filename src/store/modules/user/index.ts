import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
  LoginRes,
} from '@/api/auth';
import { setToken, clearToken, setRefreshToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { RoleType, UserState } from './types';
import useAppStore from '../app';

interface DecodedToken {
  role?: string;
  email?: string;
  account_id?: string;
  exp?: number;
  iat?: number;
  details?: UserState;
}

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    // job: undefined,
    // organization: undefined,
    // location: undefined,
    email: undefined,
    // introduction: undefined,
    // personalWebsite: undefined,
    // jobName: undefined,
    // organizationName: undefined,
    // locationName: undefined,
    phone: undefined,
    // registrationDate: undefined,
    accountId: undefined,
    // certification: undefined,
    role: 'user', // Mặc định là 'user'
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // Chuyển vai trò demo (tạm thời, không dùng token)
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },

    // Gán thông tin user
    setInfo(partial: Partial<UserState>) {
      this.$patch({
        ...partial,
        role: partial.role ?? this.role ?? 'user', // fallback nếu chưa có role
      });
    },

    // Reset thông tin user
    resetInfo() {
      this.$reset();
    },

    // Gọi API lấy thông tin user

    // Đăng nhập
    async login(loginForm: LoginData) {
      try {
        const res = (await userLogin(loginForm)) as LoginRes;

        setToken(res.token);
        // Lưu refreshToken
        setRefreshToken(res.refreshToken);

        // Giải mã token để lấy role
        const decoded = jwtDecode<DecodedToken>(res.token);

        this.role = (decoded.role as RoleType) || '';
        this.email = decoded.email || '';
        this.accountId = decoded.account_id || '';
        // Lấy thông tin user
        this.setInfo((decoded?.details || {}) as Partial<UserState>);
        return Promise.resolve(res);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // Callback khi logout
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },

    // Đăng xuất
    async logout() {
      try {
        const getRefreshToken = localStorage.getItem('getRefreshToken') || '';
        const data = {
          getRefreshToken,
        };

        await userLogout({ ...data });
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
