export enum Auth {
  lit = "lit",
  turnkey = "turnkey",
  privy = "privy",
}

export enum AA {
  alchemy = "alchemy",
  fun = "fun",
}

export interface AuthProvider {
  name: Auth;
  apiKeys: { [key: string]: string };
}
export interface AAProvider {
  name: AA;
  apiKeys: { [key: string]: string };
}

export const AAProviders = {
  alchemy: {
    name: AA.alchemy,
    apiKeys: {},
  },
  fun: {
    name: AA.fun,
    apiKeys: {},
  },
};

export const AuthProviders = {
  lit: {
    name: Auth.lit,
    apiKeys: {},
  },
  turnkey: {
    name: Auth.turnkey,
    apiKeys: {},
  },
  privy: {
    name: Auth.privy,
    apiKeys: {},
  },
};

export const DEFAULT_EXP = new Date(
  Date.now() + 1000 * 60 * 60 * 24 * 7
).toISOString();
