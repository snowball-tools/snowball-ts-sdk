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
    constructor(apiKey, authProvider, chain) {
        this.apiKey = apiKey;
        this.authProvider = authProvider;
        this.chain = chain;
        this.auth = this.initAuthProvider(authProvider);
    }
    initAuthProvider(authProvider = this.authProvider) {
        this.authProvider = authProvider;
        switch (authProvider.name) {
            case Auth.lit:
                return new LitPasskey(this.chain, authProvider);
            case Auth.turnkey:
            case Auth.privy:
            default:
                throw new Error("Auth Provider has not been impl yet");
        }
    }
    async initAAProvider(aaProvider) {
        this.aaProvider = aaProvider;
        switch (aaProvider.name) {
            case AA.alchemy:
                try {
                    const simpleAccountOwner = await this.auth.getSimpleAccountOwner();
                    this.smartWallet = new AlchemyAA(this.auth, simpleAccountOwner, aaProvider);
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
    async sendUserOperation(targetAddress, data, sponsorGas) {
        if (this.smartWallet === undefined) {
            throw new Error("Smart wallet not initialized");
        }
        return await this.smartWallet.sendUserOp(targetAddress, data, sponsorGas);
    }
}
//# sourceMappingURL=Snowball.js.map