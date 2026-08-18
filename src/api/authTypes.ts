export interface AuthUser {
  username: string;
  name?: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}
