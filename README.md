# zenit-sdk

## Introducción
`zenit-sdk` es una librería en TypeScript para consumir el backend de Zenit de forma sencilla. El core es agnóstico al framework y se enfoca en ofrecer clientes HTTP y helpers de autenticación. Además, incluye un componente React (`ZenitMap`) como peer dependency para integraciones de UI.

## Tecnologías
- **TypeScript** para tipado estático y DX.
- **tsup** para generar builds ESM/CJS y declaraciones de tipos (`.d.ts`).
- **React 18** como peerDependency para el componente `ZenitMap`.

## Instalación
```bash
npm install zenit-sdk
# o en desarrollo local del repo
npm install
npm run build
```

Recuerda que el proyecto donde uses `ZenitMap` debe tener React instalado.

## Uso básico – Cliente de usuario
```ts
import { ZenitClient } from 'zenit-sdk';

const client = new ZenitClient({
  baseUrl: 'https://mi-zenit.com/api/v1'
});

async function demo() {
  const login = await client.auth.login({
    email: '<EMAIL>',
    password: '<PASSWORD>'
  });

  console.log('User:', login.user);

  const me = await client.auth.me();
  console.log('Me:', me);

  const valid = await client.auth.validate();
  console.log('Validate:', valid);

  const refreshed = await client.auth.refresh(login.refreshToken);
  console.log('Refresh:', refreshed);
}
```

## Uso básico – SDK Token
```ts
import { ZenitClient } from 'zenit-sdk';

const client = new ZenitClient({
  baseUrl: 'https://mi-zenit.com/api/v1',
  sdkToken: '<SDK_TOKEN>'
});

async function demoSdk() {
  const validation = await client.sdkAuth.validateSdkToken();
  console.log('SDK token validation:', validation);

  const exchange = await client.sdkAuth.exchangeSdkToken();
  console.log('SDK exchange:', exchange);

  const me = await client.auth.me();
  console.log('Me using SDK access token:', me);
}
```

## Uso básico – Componente React `ZenitMap`
```tsx
import React from 'react';
import { ZenitClient, ZenitMap } from 'zenit-sdk';

const client = new ZenitClient({
  baseUrl: 'https://mi-zenit.com/api/v1',
  sdkToken: '<SDK_TOKEN>'
});

export function App() {
  return (
    <div>
      <h1>Demo ZenitMap</h1>
      <ZenitMap client={client} mapId={123} />
    </div>
  );
}
```

## Notas sobre entorno de pruebas
- `baseUrl` debe apuntar al backend Zenit (dev o prod); en local suele ser `http://localhost:3000/api/v1` (ajusta según tu proyecto).
- El SDK espera que el backend exponga los endpoints: `/auth/login`, `/auth/refresh`, `/auth/me`, `/auth/validate`, `/sdk-auth/validate`, `/sdk-auth/exchange`.
- Puedes ejecutar ejemplos rápidos con:

```bash
npm run examples:auth
npm run examples:sdk
```
