export declare enum SmartWalletProvider {
    alchemy = "alchemy",
    fun = "fun"
}
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
