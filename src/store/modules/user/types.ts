export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
    full_name?: string;
    avatar?: string;
    email?: string;
    address?: string;
    locationName?: string;
    phone?: string;
    registrationDate?: string;
    accountId?: string;
    role: RoleType;
    isLogin: boolean;
}
