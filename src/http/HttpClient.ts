export interface ZenitSdkError {
  success: false;
  statusCode: number;
  timestamp?: string;
  path?: string;
  method?: string;
  error?: string;
  message: string;
}

type TokenResolver = () => { accessToken?: string; sdkToken?: string };

export interface HttpClientOptions {
  baseUrl: string;
  resolveTokens: TokenResolver;
}

/**
 * Minimal fetch-based HTTP client for the Zenit SDK.
 * Responsible for setting base URL, auth headers and error normalization.
 *
 * - El header `Authorization` se usa para JWT de usuario o JWT obtenido vía `/sdk-auth/exchange`.
 * - El header `X-SDK-Token` se usa para enviar el token SDK crudo a endpoints como
 *   `/sdk-auth/validate` y `/sdk-auth/exchange`.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly resolveTokens: TokenResolver;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.resolveTokens = options.resolveTokens;
  }

  async get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    return this.request<T>(path, {
      ...options,
      method: 'POST',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const tokenState = this.resolveTokens();

    // Usamos Record<string, string> para que TypeScript permita indexar con 'Authorization' y 'X-SDK-Token'
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> | undefined),
    };

    if (tokenState.accessToken) {
      headers['Authorization'] = `Bearer ${tokenState.accessToken}`;
    }

    if (tokenState.sdkToken) {
      headers['X-SDK-Token'] = tokenState.sdkToken;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const normalizedError: ZenitSdkError = {
        success: false,
        statusCode: response.status,
        message: typeof payload === 'string' ? payload : payload?.message || 'Unknown error',
        timestamp: typeof payload === 'object' ? payload.timestamp : undefined,
        path: typeof payload === 'object' ? payload.path : undefined,
        method: typeof payload === 'object' ? payload.method : undefined,
        error: typeof payload === 'object' ? payload.error : undefined,
      };
      throw normalizedError;
    }

    return payload as T;
  }
}
