export class FunSmartWallet {
    constructor(chain, smartWalletProviderInfo) {
        Object.defineProperty(this, "chain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "smartWalletProviderInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.chain = chain;
        this.smartWalletProviderInfo = smartWalletProviderInfo;
    }
    sendUserOperation(_targetAddress, _data, _sponsorGas) {
        throw new Error("Method not implemented.");
    }
    changeChain(_chain) {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=FunSmartWallet.js.map