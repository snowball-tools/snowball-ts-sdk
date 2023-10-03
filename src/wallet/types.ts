export enum SmartWalletProvider {
  alchemy = "alchemy",
  fun = "fun",
}

export enum AlchemySmartWalletProviderKey {
  goerli = "alchemyKey-goerli",
  sepolia = "alchemyKey-sepolia",
  goerli_gasPolicyId = "alchemyKey-goerli-gasPolicyId",
  sepolia_gasPolicyId = "alchemyKey-sepolia-gasPolicyId",
}

export enum FunSmartWalletProviderKey {
  key = "funKey",
  gasPolicyId = "funKey-gasPolicyId",
}

export interface SmartWalletProviderInfo {
  name: SmartWalletProvider;
  apiKeys: { [key: string]: string };
}

export const SmartWalletProviders = {
  alchemy: {
    name: SmartWalletProvider.alchemy,
    apiKeys: {},
  },
  fun: {
    name: SmartWalletProvider.fun,
    apiKeys: {},
  },
};
