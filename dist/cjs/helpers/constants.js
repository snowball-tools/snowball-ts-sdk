"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_EXP = exports.AuthProviders = exports.SmartWalletProviders = exports.SmartWalletProvider = exports.AuthProvider = void 0;
var AuthProvider;
(function (AuthProvider) {
    AuthProvider["lit"] = "lit";
    AuthProvider["turnkey"] = "turnkey";
    AuthProvider["privy"] = "privy";
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
    privy: {
        name: AuthProvider.privy,
        apiKeys: {},
    },
};
exports.DEFAULT_EXP = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
//# sourceMappingURL=constants.js.map