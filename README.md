# Snowball TS Auth

This is a simple library to authenticate with the Snowball SDK

## Installation

```sh
npm i @snowballtools/snowball-ts-sdk
```

```sh
yarn add @snowballtools/snowball-ts-sdk
```

## Usage

```ts
import {
  Snowball,
  CHAINS,
  AuthProvider,
  SmartWalletProvider,
  AlchemySmartWalletProviderKey,
} from "@snowballtools/snowball-ts-sdk";
import {
  ALCHEMY_GOERLI_API_KEY,
  ALCHEMY_GOERLI_GAS_POLICY_ID,
  ALCHEMY_SEPOLIA_API_KEY,
  ALCHEMY_SEPOLIA_GAS_POLICY_ID,
} from "./env";

export const snowball = new Snowball(
  "snowball-api-key", 
  CHAINS.goerli,
  {
    name: AuthProvider.lit,
  },
  {
    name: SmartWalletProvider.alchemy,
    apiKeys: {
      [AlchemySmartWalletProviderKey.goerli]: ALCHEMY_GOERLI_API_KEY,
      [AlchemySmartWalletProviderKey.goerli_gasPolicyId]:
        ALCHEMY_GOERLI_GAS_POLICY_ID,
      [AlchemySmartWalletProviderKey.sepolia]: ALCHEMY_SEPOLIA_API_KEY,
      [AlchemySmartWalletProviderKey.sepolia_gasPolicyId]:
        ALCHEMY_SEPOLIA_GAS_POLICY_ID,
    },
  }
);
```

### Methods 

```ts
register(username: string): Promise<void>; // passkey
authenticate(): Promise<void>; // passkey
getEthersWallet(): Promise<PKPEthersWallet>;
changeChain(chain: Chain): void;
sendUserOperation(targetAddress: Address, data: Address, sponsorGas: Boolean): Promise<{ hash: string; }>
getAddress(): Promise<Address>; // smart wallet (incl counterfactual)
waitForUserOperationTransaction(hash: Hash): Promise<Hash>;
getUserOperationByHash(hash: Hash): Promise<UserOperationResponse>;
getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt>;
```