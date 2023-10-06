"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProviders = exports.AuthProvider = void 0;
var AuthProvider;
(function (AuthProvider) {
    AuthProvider["lit"] = "lit";
    AuthProvider["turnkey"] = "turnkey";
})(AuthProvider || (exports.AuthProvider = AuthProvider = {}));
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
//# sourceMappingURL=types.js.map