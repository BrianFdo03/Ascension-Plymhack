import { axiosInstance } from "@/lib/axios";

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

export interface SignupResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  message?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  message?: string;
}

export const signup = (data: SignupPayload) => {
  return axiosInstance.post<SignupResponse>("/auth/register", data);
};

export const login = (data: LoginPayload) => {
  return axiosInstance.post<LoginResponse>("/auth/login", data);
};
