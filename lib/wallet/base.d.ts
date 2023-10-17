export declare enum SmartWalletProvider {
    alchemy = "alchemy",
    fun = "fun"
}
export declare enum AlchemySmartWalletProviderKey {
    ethereumGoerli = "alchemyKey-goerli",
    ethereumGoerli_gasPolicyId = "alchemyKey-goerli-gasPolicyId",
    ethereumSepolia = "alchemyKey-sepolia",
    ethereumSepolia_gasPolicyId = "alchemyKey-sepolia-gasPolicyId",
    baseMainnet = "alchemyKey-baseMainnet",
    baseMainnet_gasPolicyId = "alchemyKey-baseMainnet-gasPolicyId",
    baseGoerli = "alchemyKey-baseGoerli",
    baseGoerli_gasPolicyId = "alchemyKey-baseGoerli-gasPolicyId"
}
export declare enum FunSmartWalletProviderKey {
    key = "funKey",
    gasPolicyId = "funKey-gasPolicyId"
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
