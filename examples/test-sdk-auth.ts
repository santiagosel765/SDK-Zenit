import { ZenitClient, ZenitSdkError } from '../src';

async function main() {
  const client = new ZenitClient({
    baseUrl: 'http://localhost:3200/api/v1',
    sdkToken:
      'znt_53402211aa63cffab2d5a39f3010087f77172f7d70a2ca8a0aa23ed374478d22',
  });

  try {
    const validation = await client.sdkAuth.validateSdkToken();
    console.log('validateSdkToken OK');

    const exchange = await client.sdkAuth.exchangeSdkToken();
    console.log('exchangeSdkToken OK');

    const me = await client.auth.me();
    console.log('me() OK usando el token del SDK');
  } catch (error) {
    const sdkError = error as ZenitSdkError;
    console.error('Zenit SDK error:', sdkError);
  }
}

main();
