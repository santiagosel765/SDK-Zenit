import { HttpClient } from '../http/HttpClient';
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshResponse,
  ValidateResponse
} from './AuthTypes';
import type { ZenitSdkConfig } from '../config/ZenitSdkConfig';

/**
 * Client to manage user authentication endpoints.
 */
export class ZenitAuthClient {
  constructor(
    private readonly http: HttpClient,
    private readonly updateTokens: (tokens: { accessToken?: string; refreshToken?: string }) => void,
    private readonly config: ZenitSdkConfig
  ) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.http.post<LoginResponse>('/auth/login', credentials);
      const accessToken = (response as any)?.accessToken ?? (response as any)?.data?.accessToken;
      const refreshToken = (response as any)?.refreshToken ?? (response as any)?.data?.refreshToken;
      this.updateTokens({ accessToken, refreshToken });
      return response;
    } catch (error) {
      this.config.onAuthError?.(error as any);
      throw error;
    }
  }

  async refresh(refreshToken?: string): Promise<RefreshResponse> {
    // Zenit allows refresh via httpOnly cookie or Authorization header; the SDK uses the header when a token is available.
    const tokenToUse = refreshToken || this.config.refreshToken;
    const headers = tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : undefined;
    const response = await this.http.post<RefreshResponse>('/auth/refresh', undefined, { headers });
    const accessToken = (response as any)?.accessToken ?? (response as any)?.data?.accessToken;
    const nextRefreshToken = (response as any)?.refreshToken ?? (response as any)?.data?.refreshToken;
    this.updateTokens({ accessToken, refreshToken: nextRefreshToken });
    return response;
  }

  async me(): Promise<MeResponse> {
    return this.http.get<MeResponse>('/auth/me');
  }

  async validate(): Promise<ValidateResponse> {
    return this.http.get<ValidateResponse>('/auth/validate');
  }
}
