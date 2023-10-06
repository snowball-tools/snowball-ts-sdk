"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
class Auth {
    authProviderInfo;
    chain;
    constructor(chain, authProviderInfo) {
        this.chain = chain;
        this.authProviderInfo = authProviderInfo;
    }
    switchChain(chain) {
        this.chain = chain;
    }
}
exports.Auth = Auth;
//# sourceMappingURL=Auth.js.map