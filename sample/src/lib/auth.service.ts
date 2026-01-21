import { api, setAuthToken } from "./api";

export interface User {
  id: number;
  phone_number: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequestOtpResponse {
  message: string;
}

export interface VerifyOtpResponse {
  token: string;
  user: User;
}

export const authService = {
  async requestOtp(phoneNumber: string): Promise<RequestOtpResponse> {
    const { data } = await api.post<RequestOtpResponse>("/auth/request-otp", {
      phone_number: phoneNumber,
    });
    return data;
  },

  async verifyOtp(phoneNumber: string, otp: string): Promise<VerifyOtpResponse> {
    const { data } = await api.post<VerifyOtpResponse>("/auth/verify-otp", {
      phone_number: phoneNumber,
      otp,
    });
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>("/me");
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
    this.removeToken();
  },

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  setToken(token: string): void {
    localStorage.setItem("auth_token", token);
    setAuthToken(token);
  },

  removeToken(): void {
    localStorage.removeItem("auth_token");
    setAuthToken(null);
  },
};
