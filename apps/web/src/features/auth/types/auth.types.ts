export type AuthRole = "CUSTOMER" | "ADMIN";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
};

export type LoginValues = {
  email: string;
  password: string;
};

export type RegisterValues = LoginValues & {
  name: string;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
};