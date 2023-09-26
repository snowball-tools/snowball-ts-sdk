import {} from "@alchemy/aa-core";
import { AlchemySmartWallet } from "./providers/AlchemySmartWallet";
import { SmartWalletProvider } from "../helpers";
export class SmartWallet {
    constructor(ethersWallet, auth, smartWalletProviderInfo) {
        Object.defineProperty(this, "smartWalletProvider", {
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
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "simpleAccountOwner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "address", {
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
        this.auth = auth;
        this.smartWalletProviderInfo = smartWalletProviderInfo;
        this.ethersWallet = ethersWallet;
        this.getSimpleAccountOwner()
            .then((owner) => {
            this.simpleAccountOwner = owner;
            owner
                .getAddress()
                .catch((error) => {
                console.log(error);
            })
                .then(() => {
                this.smartWalletProvider = this.initSmartWalletProvider(owner);
            });
        })
            .catch((error) => {
            console.log(error);
        });
    }
    async getSimpleAccountOwner() {
        if (this.simpleAccountOwner) {
            return this.simpleAccountOwner;
        }
        try {
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
            this.simpleAccountOwner = owner;
            return owner;
        }
        catch (error) {
            return Promise.reject(`Get Simple Account Owner failed ${error}`);
        }
    }
    async getAddress() {
        if (this.address) {
            return this.address;
        }
        try {
            const owner = await this.getSimpleAccountOwner();
            this.address = await owner.getAddress();
            return this.address;
        }
        catch (e) {
            throw new Error("Error getting address");
        }
    }
    async sendUserOperation(targetAddress, data, sponsorGas) {
        switch (this.smartWalletProviderInfo.name) {
            case SmartWalletProvider.alchemy:
                return this.sendUserOperation(targetAddress, data, sponsorGas);
            case SmartWalletProvider.fun:
            default:
                throw new Error("Auth Provider has not been impl yet");
        }
    }
    initSmartWalletProvider(simpleAccountOwner) {
        switch (this.smartWalletProviderInfo.name) {
            case SmartWalletProvider.alchemy:
                return new AlchemySmartWallet(simpleAccountOwner, this.smartWalletProviderInfo, this.auth.chain);
            case SmartWalletProvider.fun:
            default:
                throw new Error("Auth Provider has not been impl yet");
        }
    }
}
//# sourceMappingURL=SmartWallet.js.map