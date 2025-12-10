export type SdkTokenValidateResponse = {
  valid: boolean;
  clientId?: string | number;
  clientName?: string;
  scopes?: string[];
  reason?: string;
};

export type SdkTokenExchangeResponse = {
  accessToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
};
