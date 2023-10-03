"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunSmartWallet = void 0;
class FunSmartWallet {
    chain;
    smartWalletProviderInfo;
    constructor(chain, smartWalletProviderInfo) {
        this.chain = chain;
        this.smartWalletProviderInfo = smartWalletProviderInfo;
    }
    sendUserOperation(_targetAddress, _data, _sponsorGas) {
        throw new Error("Method not implemented.");
    }
    changeChain(_chain) {
        throw new Error("Method not implemented.");
    }
    async waitForUserOperationTransaction(_hash) {
        throw new Error("Method not implemented.");
    }
    async getUserOperationByHash(_hash) {
        throw new Error("Method not implemented.");
    }
    async getUserOperationReceipt(_hash) {
        throw new Error("Method not implemented.");
    }
}
exports.FunSmartWallet = FunSmartWallet;
