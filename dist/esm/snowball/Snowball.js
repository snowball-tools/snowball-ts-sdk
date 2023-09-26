import {} from "../helpers/constants";
import { SmartWallet } from "../wallet";
import { SnowballPasskey } from "../auth/Passkey";
export class Snowball {
    constructor(_apiKey, chain, authProviderInfo, smartWalletProviderInfo) {
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
        Object.defineProperty(this, "smartWalletProviderInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        Object.defineProperty(this, "ethersWallet", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.chain = chain;
        this.authProviderInfo = authProviderInfo;
        this.smartWalletProviderInfo = smartWalletProviderInfo;
        this.auth = new SnowballPasskey(this.chain, this.authProviderInfo);
        this.getEthersWallet()
            .then((ethersWallet) => {
            this.smartWallet = new SmartWallet(ethersWallet, this.auth, this.smartWalletProviderInfo);
        })
            .catch((error) => {
            console.log(error);
        });
    }
    async getEthersWallet() {
        try {
            return await this.auth.getEthersWallet();
        }
        catch (error) {
            return Promise.reject(`getEthersWallet failed ${error}`);
        }
    }
    async changeChain(chain) {
        try {
            this.chain = chain;
            this.auth.chain = chain;
        }
        catch (error) {
            return Promise.reject(`changeChain failed ${error}`);
        }
    }
    async getAddress() {
        try {
            if (this.smartWallet === undefined) {
                this.ethersWallet = await this.getEthersWallet();
                this.smartWallet = new SmartWallet(this.ethersWallet, this.auth, this.smartWalletProviderInfo);
            }
            return await this.smartWallet.getAddress();
        }
        catch (error) {
            return Promise.reject(`getAddress failed ${error}`);
        }
    }
    async sendUserOperation(targetAddress, data, sponsorGas) {
        try {
            if (this.smartWallet === undefined) {
                this.ethersWallet = await this.getEthersWallet();
                this.smartWallet = new SmartWallet(this.ethersWallet, this.auth, this.smartWalletProviderInfo);
            }
            return await this.smartWallet.sendUserOperation(targetAddress, data, sponsorGas);
        }
        catch (error) {
            return Promise.reject(`sendUserOperation failed ${error}`);
        }
    }
}
//# sourceMappingURL=Snowball.js.map