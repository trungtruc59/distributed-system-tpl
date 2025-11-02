import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { login as userLogin, register as userRegister, getUserInfo, LoginData, RegisterData, LoginRes } from '@/api/auth';
import { setToken, clearToken, setRefreshToken, isLogin, getToken } from '@/utils/auth';
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
    isLogin: boolean;
    isDeleted?: boolean;
    is_deleted?: boolean;
}

const useUserStore = defineStore('user', {
    state: (): UserState => ({
        full_name: undefined,
        avatar: undefined,
        email: undefined,
        phone: undefined,
        accountId: undefined,
        role: 'user', // Mặc định là 'user'
        isLogin: isLogin(),
    }),

    getters: {
        userInfo(state: UserState): UserState {
            return { ...state };
        },
    },

    actions: {
        // Khởi tạo thông tin người dùng từ token lưu trong localStorage
        async hydrateFromToken() {
            try {
                const token = getToken();
                if (!token) return;
                const decoded = jwtDecode<DecodedToken>(token);
                this.role = ((decoded.role as string) || '').toLowerCase() as RoleType;
                this.email = decoded.email || '';
                this.accountId = decoded.account_id || '';
                this.isLogin = true;
                // Nếu chưa có details trong token, gọi API lấy thông tin chi tiết
                if (!decoded.details && this.accountId) {
                    const user = await getUserInfo({ accountId: this.accountId });
                    this.setInfo(user as unknown as Partial<UserState>);
                } else {
                    this.setInfo((decoded.details || {}) as Partial<UserState>);
                }
            } catch (err) {
                this.logoutCallBack();
            }
        },
        // Chuyển vai trò demo (tạm thời, không dùng token)
        switchRoles() {
            return new Promise((resolve) => {
                this.role = this.role === 'user' ? 'admin' : 'user';
                resolve(this.role);
            });
        },

        // Gán thông tin user
        setInfo(partial: Partial<UserState>) {
            const normalizedRole = (partial.role as string | undefined)?.toLowerCase() as RoleType | undefined;
            this.$patch({
                ...partial,
                role: normalizedRole ?? this.role ?? 'user', // fallback nếu chưa có role
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
                if (decoded.isDeleted === true || decoded.is_deleted === true) {
                    clearToken();
                    sessionStorage.clear();
                    this.isLogin = false;
                    this.logoutCallBack();
                    throw new Error('Tài khoản không tồn tại hoặc đã bị xóa');
                }
                this.role = ((decoded.role as string) || '').toLowerCase() as RoleType;
                this.email = decoded.email || '';
                this.accountId = decoded.account_id || '';
                // Lấy thông tin user

                this.setInfo((decoded?.details || {}) as Partial<UserState>);
                this.isLogin = true;
                return Promise.resolve(res);
            } catch (err) {
                clearToken();
                throw err;
            }
        },
        // Đăng ký
        async register(registerForm: RegisterData) {
            try {
                const payload = {
                    ...registerForm,
                    role: '7557a307-2190-40a6-8a2d-56d67a665b6d', // Mặc định vai trò là 'user' khi đăng ký
                };
                await userRegister(payload);
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
            clearToken();
            sessionStorage.clear();
            document.body.setAttribute('arco-theme', 'dark');
            this.isLogin = false;
            this.logoutCallBack();
        },
    },
});

export default useUserStore;
