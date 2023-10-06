"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurkeyPasskey = void 0;
class TurkeyPasskey {
    chain;
    authProviderInfo;
    constructor(chain, authProviderInfo) {
        this.chain = chain;
        this.authProviderInfo = authProviderInfo;
    }
    registerPasskey(_username) {
        throw new Error("Method not implemented.");
    }
    authenticatePasskey() {
        throw new Error("Method not implemented.");
    }
    getEthersWallet() {
        throw new Error("Method not implemented.");
    }
}
exports.TurkeyPasskey = TurkeyPasskey;
