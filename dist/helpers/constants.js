export var Auth;
(function (Auth) {
    Auth["lit"] = "lit";
    Auth["turnkey"] = "turnkey";
    Auth["privy"] = "privy";
})(Auth || (Auth = {}));
export var AA;
(function (AA) {
    AA["alchemy"] = "alchemy";
    AA["fun"] = "fun";
})(AA || (AA = {}));
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
export const DEFAULT_EXP = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
//# sourceMappingURL=constants.js.map