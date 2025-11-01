export type accountRequest = {
  id: string;
  full_name: string;
  avatar: string;
  gender: string;
  birthday: string;
  phone: string;
  email: string;
  role: string;
  roleId: string;
  userInfo: User;
  deleted: boolean;
};

export type User = {
    activeBranch: string;
    full_name: string;
    avatar: string;
    gender: string;
    birthday: string;
    createdAt: string;
    updatedAt: string;
}
