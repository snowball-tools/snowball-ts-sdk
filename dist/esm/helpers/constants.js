export var AlchemySmartWalletProviderKey;
(function (AlchemySmartWalletProviderKey) {
    AlchemySmartWalletProviderKey["goerli"] = "alchemyKey-goerli";
    AlchemySmartWalletProviderKey["sepolia"] = "alchemyKey-sepolia";
    AlchemySmartWalletProviderKey["goerli_gasPolicyId"] = "alchemyKey-goerli-gasPolicyId";
    AlchemySmartWalletProviderKey["sepolia_gasPolicyId"] = "alchemyKey-sepolia-gasPolicyId";
})(AlchemySmartWalletProviderKey || (AlchemySmartWalletProviderKey = {}));
export var FunSmartWalletProviderKey;
(function (FunSmartWalletProviderKey) {
    FunSmartWalletProviderKey["key"] = "funKey";
    FunSmartWalletProviderKey["gasPolicyId"] = "funKey-gasPolicyId";
})(FunSmartWalletProviderKey || (FunSmartWalletProviderKey = {}));
export var AuthProvider;
(function (AuthProvider) {
    AuthProvider["lit"] = "lit";
    AuthProvider["turnkey"] = "turnkey";
})(AuthProvider || (AuthProvider = {}));
export var SmartWalletProvider;
(function (SmartWalletProvider) {
    SmartWalletProvider["alchemy"] = "alchemy";
    SmartWalletProvider["fun"] = "fun";
})(SmartWalletProvider || (SmartWalletProvider = {}));
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
export const DEFAULT_EXP = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
//# sourceMappingURL=constants.js.map