export class TurkeyPasskey {
    constructor(chain, authProviderInfo) {
        Object.defineProperty(this, "chain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "authProviderInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
//# sourceMappingURL=TurkeyPasskey.js.map