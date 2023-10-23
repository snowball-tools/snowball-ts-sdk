"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartWallet = void 0;
class SmartWallet {
    ethersWallet;
    auth;
    _simpleAccountOwner;
    address;
    smartWalletProviderInfo;
    constructor(auth, smartWalletProviderInfo) {
        this.auth = auth;
        this.smartWalletProviderInfo = smartWalletProviderInfo;
    }
    async getSimpleAccountOwner() {
        if (this._simpleAccountOwner !== undefined) {
            return this._simpleAccountOwner;
        }
        try {
            if (this.ethersWallet === undefined) {
                this.ethersWallet = await this.auth.getEthersWallet();
            }
            const owner = {
                signMessage: async (msg) => {
                    return (await this.ethersWallet.signMessage(msg));
                },
                getAddress: async () => {
                    return (await this.ethersWallet.getAddress());
                },
                signTypedData: async (params) => {
                    const types = {
                        [params.primaryType]: params.types["x"].map((value) => ({
                            name: value.name,
                            type: value.type,
                        })),
                    };
                    return (await this.ethersWallet._signTypedData(params.domain ? params.domain : {}, types, params.message));
                },
            };
            this._simpleAccountOwner = owner;
            return owner;
        }
        catch (error) {
            return Promise.reject(`Get Simple Account Owner failed ${JSON.stringify(error)}`);
        }
    }
    get chain() {
        return this.auth.chain;
    }
}
exports.SmartWallet = SmartWallet;
//# sourceMappingURL=SmartWallet.js.map