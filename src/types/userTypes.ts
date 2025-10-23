export type accountRequest = {
  id: string;
  phone: string;
  email: string;
  role: string;
  roleId: string;
};

export type User = {
    fullname: string;
    avatar: string;
    gender: string;
    birthday: string;
    createdAt: string;
    updatedAt: string;
} & accountRequest;
