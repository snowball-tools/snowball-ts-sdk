export enum AuthProvider {
  lit = "lit",
  turnkey = "turnkey",
}

export interface AuthProviderInfo {
  name: AuthProvider;
  apiKeys?: { [key: string]: string };
}

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
