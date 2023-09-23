import { Auth, AA, } from "../helpers/constants";
import { AlchemyAA } from "../SmartContractWallet/AlchemyAA";
import { LitPasskey } from "../Auth/LitPasskey";
export class Snowball {
    apiKey;
    chain;
    authProvider;
    aaProvider;
    auth;
    smartWallet;
    address;
    constructor(apiKey, authProvider, aaProvider, chain) {
        this.apiKey = apiKey;
        this.authProvider = authProvider;
        this.aaProvider = aaProvider;
        this.chain = chain;
        this.auth = this.initAuthProvider(authProvider);
        this.initAAProvider(aaProvider)
            .catch((e) => {
            throw e;
        })
            .then((smartWallet) => {
            this.smartWallet = smartWallet;
            smartWallet
                .getAddress()
                .catch((e) => {
                throw e;
            })
                .then((address) => {
                this.address = address;
            });
        });
    }
    initAuthProvider(authProvider = this.authProvider) {
        switch (authProvider.name) {
            case Auth.lit:
                return new LitPasskey(this.chain, authProvider);
            case Auth.turnkey:
            case Auth.privy:
            default:
                throw new Error("Auth Provider has not been impl yet");
        }
    }
    async initAAProvider(aaProvider = this.aaProvider) {
        switch (aaProvider.name) {
            case AA.alchemy:
                try {
                    const simpleAccountOwner = await this.auth.getSimpleAccountOwner();
                    this.smartWallet = new AlchemyAA(this.auth, simpleAccountOwner, aaProvider);
                    this.address = await this.smartWallet.getAddress();
                    return this.smartWallet;
                }
                catch (e) {
                    throw e;
                }
            case AA.fun:
            default:
                throw new Error("Invalid auth provider");
        }
    }
    async getSmartWalletAddress() {
        try {
            if (this.smartWallet === undefined) {
                this.smartWallet = await this.initAAProvider();
            }
            return this.address;
        }
        catch (e) {
            throw e;
        }
    }
    async sendUserOperation(targetAddress, data, sponsorGas) {
        if (this.smartWallet === undefined) {
            this.smartWallet = await this.initAAProvider();
        }
        return await this.smartWallet.sendUserOp(targetAddress, data, sponsorGas);
    }
}
//# sourceMappingURL=Snowball.js.map