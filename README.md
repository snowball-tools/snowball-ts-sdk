# Snowball TS Auth

This is a simple library to authenticate with the Snowball SDK

## Installation

```sh
npm i @snowballtools/snowball-ts-auth
```

```sh
yarn add @snowballtools/snowball-ts-auth
```

## Usage

```ts
import { SnowballAuth } from '@snowballtools/snowball-ts-auth';

const snowball = SnowballAuth('token');

const register = await snowball.registerPasskey('username').then(...).catch(...);
const login = await snowball.authenticatePasskey().then(...).catch(...);

```
