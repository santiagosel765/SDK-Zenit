import { ZenitClient, ZenitSdkError } from '../src';

async function main() {
  const client = new ZenitClient({
    baseUrl: 'http://localhost:3200/api/v1',
  });

  try {
    const login = await client.auth.login({
      email: 'japu@genesisempresarial.com',
      password: 'password123',
    });
    console.log('Login:', login);

    const me = await client.auth.me();
    console.log('Me:', me);

    const validate = await client.auth.validate();
    console.log('Validate:', validate);

    const refreshed = await client.auth.refresh(login.refreshToken);
    console.log('Refreshed:', refreshed);
  } catch (error) {
    const sdkError = error as ZenitSdkError;
    console.error('Zenit SDK error:', sdkError);
  }
}

main();
