export var AuthProvider;
(function (AuthProvider) {
    AuthProvider["lit"] = "lit";
    AuthProvider["turnkey"] = "turnkey";
    AuthProvider["privy"] = "privy";
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
    privy: {
        name: AuthProvider.privy,
        apiKeys: {},
    },
};
export const DEFAULT_EXP = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
//# sourceMappingURL=constants.js.map