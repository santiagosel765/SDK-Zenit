import { ZenitClient, ZenitSdkError } from '../src';

async function main() {
  const client = new ZenitClient({
    baseUrl: '<BASE_URL>',
    sdkToken: '<SDK_TOKEN>'
  });

  try {
    const validation = await client.sdkAuth.validateSdkToken();
    console.log('SDK validate:', validation);

    const exchange = await client.sdkAuth.exchangeSdkToken();
    console.log('SDK exchange:', exchange);

    const me = await client.auth.me();
    console.log('Me with SDK-based access token:', me);
  } catch (error) {
    const sdkError = error as ZenitSdkError;
    if (sdkError && typeof sdkError.status !== 'undefined') {
      console.error('Zenit SDK error:', sdkError);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

main();
