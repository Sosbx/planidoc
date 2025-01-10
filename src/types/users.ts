export type UserRole = {
  isAdmin: boolean;
  isUser: boolean;
};

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  login: string;
  password: string;
  roles: UserRole;
  hasValidatedPlanning: boolean;
}