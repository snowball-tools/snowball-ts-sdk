"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunSmartWallet = void 0;
class FunSmartWallet {
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
}
exports.FunSmartWallet = FunSmartWallet;
//# sourceMappingURL=FunSmartWallet.js.map