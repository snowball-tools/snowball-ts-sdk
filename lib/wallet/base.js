"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartWalletProviders = exports.FunSmartWalletProviderKey = exports.AlchemySmartWalletProviderKey = exports.SmartWalletProvider = void 0;
var SmartWalletProvider;
(function (SmartWalletProvider) {
    SmartWalletProvider["alchemy"] = "alchemy";
    SmartWalletProvider["fun"] = "fun";
})(SmartWalletProvider || (exports.SmartWalletProvider = SmartWalletProvider = {}));
var AlchemySmartWalletProviderKey;
(function (AlchemySmartWalletProviderKey) {
    AlchemySmartWalletProviderKey["ethereumGoerli"] = "alchemyKey-goerli";
    AlchemySmartWalletProviderKey["ethereumGoerli_gasPolicyId"] = "alchemyKey-goerli-gasPolicyId";
    AlchemySmartWalletProviderKey["ethereumSepolia"] = "alchemyKey-sepolia";
    AlchemySmartWalletProviderKey["ethereumSepolia_gasPolicyId"] = "alchemyKey-sepolia-gasPolicyId";
    AlchemySmartWalletProviderKey["baseMainnet"] = "alchemyKey-baseMainnet";
    AlchemySmartWalletProviderKey["baseMainnet_gasPolicyId"] = "alchemyKey-baseMainnet-gasPolicyId";
    AlchemySmartWalletProviderKey["baseGoerli"] = "alchemyKey-baseGoerli";
    AlchemySmartWalletProviderKey["baseGoerli_gasPolicyId"] = "alchemyKey-baseGoerli-gasPolicyId";
})(AlchemySmartWalletProviderKey || (exports.AlchemySmartWalletProviderKey = AlchemySmartWalletProviderKey = {}));
var FunSmartWalletProviderKey;
(function (FunSmartWalletProviderKey) {
    FunSmartWalletProviderKey["key"] = "funKey";
    FunSmartWalletProviderKey["gasPolicyId"] = "funKey-gasPolicyId";
})(FunSmartWalletProviderKey || (exports.FunSmartWalletProviderKey = FunSmartWalletProviderKey = {}));
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
//# sourceMappingURL=base.js.map