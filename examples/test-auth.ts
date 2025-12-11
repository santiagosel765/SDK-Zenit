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
    console.log('Login OK');

    const me = await client.auth.me();
    console.log('me() OK');

    const validate = await client.auth.validate();
    console.log('validate() OK');

    await client.auth.refresh();
    console.log('refresh() OK');
  } catch (error) {
    const sdkError = error as ZenitSdkError;
    console.error('Zenit SDK error:', sdkError);
  }
}

main();
