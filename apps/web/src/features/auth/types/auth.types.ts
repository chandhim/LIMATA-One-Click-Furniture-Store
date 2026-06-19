export type AuthRole = "CUSTOMER" | "ADMIN";

export type AuthUser = {
  userId: string;
  name: string;
  email: string;
  role: AuthRole;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  district?: string | null;
  province?: string | null;
  postalCode?: string | null;
  dateOfBirth?: string | null;
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