"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunSmartWallet = void 0;
const SmartWallet_1 = require("./SmartWallet");
class FunSmartWallet extends SmartWallet_1.SmartWallet {
    async sendUserOperation(_targetAddress, _data, _sponsorGas) {
        throw new Error("Method not implemented.");
    }
    async getAddress() {
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
    async switchChain() {
        throw new Error("Method not implemented.");
    }
}
exports.FunSmartWallet = FunSmartWallet;
