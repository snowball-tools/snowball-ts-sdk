export class Snowball {
    constructor(smartWallet) {
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "smartWallet", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.auth = smartWallet.auth;
        this.smartWallet = smartWallet;
    }
    async getSmartWalletAddress() {
        return this.smartWallet.getAddress();
    }
    async sendUserOperation(targetAddress, data, sponsorGas) {
        return this.smartWallet.sendUserOp(targetAddress, data, sponsorGas);
    }
}
//# sourceMappingURL=snowball.js.map