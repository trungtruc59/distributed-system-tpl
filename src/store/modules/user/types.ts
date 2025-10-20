export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  name?: string;
  avatar?: string;
  email?: string;
  address?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  id?: string;
  role: RoleType;
}
