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

export enum AuthProvider {
  lit = "lit",
  turnkey = "turnkey",
}

export enum SmartWalletProvider {
  alchemy = "alchemy",
  fun = "fun",
}

export interface AuthProviderInfo {
  name: AuthProvider;
  apiKeys?: { [key: string]: string };
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

export const AuthProviders = {
  lit: {
    name: AuthProvider.lit,
    apiKeys: {},
  },
  turnkey: {
    name: AuthProvider.turnkey,
    apiKeys: {},
  },
};

export const DEFAULT_EXP = new Date(
  Date.now() + 1000 * 60 * 60 * 24 * 7
).toISOString();
