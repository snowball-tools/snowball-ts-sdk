"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_EXP = exports.AuthProviders = exports.SmartWalletProviders = exports.SmartWalletProvider = exports.AuthProvider = exports.FunSmartWalletProviderKey = exports.AlchemySmartWalletProviderKey = void 0;
var AlchemySmartWalletProviderKey;
(function (AlchemySmartWalletProviderKey) {
    AlchemySmartWalletProviderKey["goerli"] = "alchemyKey-goerli";
    AlchemySmartWalletProviderKey["sepolia"] = "alchemyKey-sepolia";
    AlchemySmartWalletProviderKey["goerli_gasPolicyId"] = "alchemyKey-goerli-gasPolicyId";
    AlchemySmartWalletProviderKey["sepolia_gasPolicyId"] = "alchemyKey-sepolia-gasPolicyId";
})(AlchemySmartWalletProviderKey || (exports.AlchemySmartWalletProviderKey = AlchemySmartWalletProviderKey = {}));
var FunSmartWalletProviderKey;
(function (FunSmartWalletProviderKey) {
    FunSmartWalletProviderKey["key"] = "funKey";
    FunSmartWalletProviderKey["gasPolicyId"] = "funKey-gasPolicyId";
})(FunSmartWalletProviderKey || (exports.FunSmartWalletProviderKey = FunSmartWalletProviderKey = {}));
var AuthProvider;
(function (AuthProvider) {
    AuthProvider["lit"] = "lit";
    AuthProvider["turnkey"] = "turnkey";
})(AuthProvider || (exports.AuthProvider = AuthProvider = {}));
var SmartWalletProvider;
(function (SmartWalletProvider) {
    SmartWalletProvider["alchemy"] = "alchemy";
    SmartWalletProvider["fun"] = "fun";
})(SmartWalletProvider || (exports.SmartWalletProvider = SmartWalletProvider = {}));
exports.SmartWalletProviders = {
    alchemy: {
        name: SmartWalletProvider.alchemy,
        apiKeys: {},
    },
    fun: {
        name: SmartWalletProvider.fun,
        apiKeys: {},
    },
};
exports.AuthProviders = {
    lit: {
        name: AuthProvider.lit,
        apiKeys: {},
    },
    turnkey: {
        name: AuthProvider.turnkey,
        apiKeys: {},
    },
};
exports.DEFAULT_EXP = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
//# sourceMappingURL=constants.js.map