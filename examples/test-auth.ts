import { ZenitClient, ZenitSdkError } from '../src';

async function main() {
  const client = new ZenitClient({
    baseUrl: '<BASE_URL>'
  });

  try {
    const login = await client.auth.login({ email: '<EMAIL>', password: '<PASSWORD>' });
    console.log('Login:', login);

    const me = await client.auth.me();
    console.log('Me:', me);

    const validate = await client.auth.validate();
    console.log('Validate:', validate);

    const refreshed = await client.auth.refresh(login.refreshToken);
    console.log('Refreshed:', refreshed);
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
