export class Snowball {
    auth;
    smartWallet;
    constructor(smartWallet) {
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
//# sourceMappingURL=Snowball.js.map