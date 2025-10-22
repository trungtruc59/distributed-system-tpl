export type BranchRequest = {
  name: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  logo: string;
  thumbnail: string;
};

export type Branch = {
  id: string;
  createdAt: string;
  updatedAt: string;
} & BranchRequest;
