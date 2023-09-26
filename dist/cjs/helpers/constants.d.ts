export declare enum AuthProvider {
    lit = "lit",
    turnkey = "turnkey",
    privy = "privy"
}
export declare enum SmartWalletProvider {
    alchemy = "alchemy",
    fun = "fun"
}
export interface AuthProviderInfo {
    name: AuthProvider;
    apiKeys: {
        [key: string]: string;
    };
}
export interface SmartWalletProviderInfo {
    name: SmartWalletProvider;
    apiKeys: {
        [key: string]: string;
    };
}
export declare const SmartWalletProviders: {
    alchemy: {
        name: SmartWalletProvider;
        apiKeys: {};
    };
    fun: {
        name: SmartWalletProvider;
        apiKeys: {};
    };
};
export declare const AuthProviders: {
    lit: {
        name: AuthProvider;
        apiKeys: {};
    };
    turnkey: {
        name: AuthProvider;
        apiKeys: {};
    };
    privy: {
        name: AuthProvider;
        apiKeys: {};
    };
};
export declare const DEFAULT_EXP: string;
