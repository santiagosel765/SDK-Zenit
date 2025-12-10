import { HttpClient } from '../http/HttpClient';
import type { ZenitSdkConfig } from '../config/ZenitSdkConfig';
import type { SdkTokenExchangeResponse, SdkTokenValidateResponse } from './SdkAuthTypes';

/**
 * Client to manage SDK token validation and exchange endpoints.
 */
export class ZenitSdkAuthClient {
  constructor(
    private readonly http: HttpClient,
    private readonly updateAccessToken: (token?: string) => void,
    private readonly config: ZenitSdkConfig
  ) {}

  /**
   * Validate an SDK token. If no token argument is provided, it falls back to config.sdkToken.
   */
  async validateSdkToken(token?: string): Promise<SdkTokenValidateResponse> {
    const sdkToken = token || this.config.sdkToken;
    return this.http.post<SdkTokenValidateResponse>('/sdk-auth/validate', { token: sdkToken });
  }

  /**
   * Exchange an SDK token for an access token. Token can come from method args or config.sdkToken.
   */
  async exchangeSdkToken(token?: string): Promise<SdkTokenExchangeResponse> {
    const sdkToken = token || this.config.sdkToken;
    const response = await this.http.post<SdkTokenExchangeResponse>('/sdk-auth/exchange', { token: sdkToken });
    this.updateAccessToken(response.accessToken);
    return response;
  }
}
