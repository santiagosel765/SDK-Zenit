import { HttpClient, ZenitSdkError } from '../http/HttpClient';
import { ZenitAuthClient } from '../auth/ZenitAuthClient';
import { ZenitSdkAuthClient } from '../sdkAuth/ZenitSdkAuthClient';

export interface ZenitSdkConfig {
  // baseUrl: debe apuntar al prefijo de API de Zenit (ej: https://api.mi-zenit.com/api/v1).
  baseUrl: string;
  // sdkToken: token SDK que se puede validar o intercambiar por JWT.
  sdkToken?: string;
  // accessToken y refreshToken: tokens de usuario en caso de que el integrador ya los tenga (opcional).
  accessToken?: string;
  refreshToken?: string;
  // onAuthError: callback para manejar errores de login.
  onAuthError?(error: ZenitSdkError): void;
  // onTokenRefreshed: callback para actualizar tokens en el cliente que consuma el SDK.
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
      resolveTokens: () => ({ accessToken: this.accessToken, sdkToken: this.sdkToken }),
      resolveAuthorizationHeader: this.getAuthorizationHeader.bind(this)
    });

    this.auth = new ZenitAuthClient(this.httpClient, this.updateTokens.bind(this), config);
    this.sdkAuth = new ZenitSdkAuthClient(
      this.httpClient,
      this.updateAccessTokenFromSdkExchange.bind(this),
      config
    );
  }

  /**
   * Update tokens in memory and propagate to config callbacks.
   */
  private updateTokens(tokens: { accessToken?: string; refreshToken?: string }) {
    if (tokens.accessToken) {
      this.setAccessToken(tokens.accessToken);
    }
    if (tokens.refreshToken) {
      this.setRefreshToken(tokens.refreshToken);
    }
    this.config.onTokenRefreshed?.({
      accessToken: this.accessToken || '',
      refreshToken: this.refreshToken
    });
  }

  // Se usa cuando /sdk-auth/exchange devuelve un accessToken; pasa a ser el accessToken principal del SDK.
  private updateAccessTokenFromSdkExchange(token?: string) {
    if (token) {
      this.setAccessToken(token);
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    this.config.accessToken = token;
  }

  setRefreshToken(token: string) {
    this.refreshToken = token;
    this.config.refreshToken = token;
  }

  getAuthorizationHeader(): Record<string, string> {
    const header: Record<string, string> = {};

    if (this.accessToken) {
      header.Authorization = `Bearer ${this.accessToken}`;
    }

    return header;
  }

  getHttpClient(): HttpClient {
    return this.httpClient;
  }
}
