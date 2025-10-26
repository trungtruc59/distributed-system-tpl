export type accountRequest = {
  id: string;
  phone: string;
  email: string;
  role: string;
  roleId: string;
  userInfo: User;
};

export type User = {
    full_name: string;
    avatar: string;
    gender: string;
    birthday: string;
    createdAt: string;
    updatedAt: string;
}
