export type LoginRequest = {
  email: string;
  password: string;
};

export type UserSummary = {
  id: number | string;
  email: string;
  roles: string[];
  employeeCode?: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserSummary;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export type MeResponse = UserSummary;

export type ValidateResponse = {
  valid: boolean;
};
