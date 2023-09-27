export declare enum AlchemySmartWalletProviderKey {
    goerli = "alchemyKey-goerli",
    sepolia = "alchemyKey-sepolia",
    goerli_gasPolicyId = "alchemyKey-goerli-gasPolicyId",
    sepolia_gasPolicyId = "alchemyKey-sepolia-gasPolicyId"
}
export declare enum FunSmartWalletProviderKey {
    key = "funKey",
    gasPolicyId = "funKey-gasPolicyId"
}
export declare enum AuthProvider {
    lit = "lit",
    turnkey = "turnkey"
}
export declare enum SmartWalletProvider {
    alchemy = "alchemy",
    fun = "fun"
}
export interface AuthProviderInfo {
    name: AuthProvider;
    apiKeys?: {
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
};
export declare const DEFAULT_EXP: string;
//# sourceMappingURL=constants.d.ts.map