import { HttpClient, ZenitSdkError } from '../http/HttpClient';
import { ZenitAuthClient } from '../auth/ZenitAuthClient';
import { ZenitSdkAuthClient } from '../sdkAuth/ZenitSdkAuthClient';

export interface ZenitSdkConfig {
  baseUrl: string;
  sdkToken?: string;
  accessToken?: string;
  refreshToken?: string;
  onAuthError?(error: ZenitSdkError): void;
  onTokenRefreshed?(tokens: { accessToken: string; refreshToken?: string }): void;
}

export class ZenitClient {
  private accessToken?: string;
  private refreshToken?: string;
  private sdkToken?: string;
  private readonly httpClient: HttpClient;

  readonly auth: ZenitAuthClient;
  readonly sdkAuth: ZenitSdkAuthClient;

  constructor(private readonly config: ZenitSdkConfig) {
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
    this.sdkToken = config.sdkToken;
    this.httpClient = new HttpClient({
      baseUrl: config.baseUrl,
      resolveTokens: () => ({ accessToken: this.accessToken, sdkToken: this.sdkToken })
    });

    this.auth = new ZenitAuthClient(this.httpClient, this.updateTokens.bind(this), config);
    this.sdkAuth = new ZenitSdkAuthClient(this.httpClient, this.updateSdkToken.bind(this), config);
  }

  /**
   * Update tokens in memory and propagate to config callbacks.
   */
  private updateTokens(tokens: { accessToken?: string; refreshToken?: string }) {
    if (tokens.accessToken) {
      this.accessToken = tokens.accessToken;
      this.config.accessToken = tokens.accessToken;
    }
    if (tokens.refreshToken) {
      this.refreshToken = tokens.refreshToken;
      this.config.refreshToken = tokens.refreshToken;
    }
    this.config.onTokenRefreshed?.({
      accessToken: this.accessToken || '',
      refreshToken: this.refreshToken
    });
  }

  private updateSdkToken(token?: string) {
    if (token) {
      this.accessToken = token;
      this.config.accessToken = token;
    }
  }

  getHttpClient(): HttpClient {
    return this.httpClient;
  }
}
