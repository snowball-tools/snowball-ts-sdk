import { SimpleSmartContractAccount, } from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { Auth } from "../helpers/constants";
import { viemChain, } from "..";
export class SmartContractWallet {
    auth;
    provider;
    simpleAccountOwner;
    address;
    aaProvider;
    constructor(auth, simpleAccountOwner, aaProvider) {
        this.auth = auth;
        this.simpleAccountOwner = simpleAccountOwner;
        this.aaProvider = aaProvider;
        this.provider = new AlchemyProvider({
            chain: viemChain(auth.chain),
            entryPointAddress: auth.chain.entryPointAddress,
            apiKey: aaProvider.apiKeys[`alchemyKey-${auth.chain.name.toLowerCase()}`],
        }).connect((rpcClient) => new SimpleSmartContractAccount({
            owner: simpleAccountOwner,
            entryPointAddress: this.auth.chain.entryPointAddress,
            chain: viemChain(this.auth.chain),
            factoryAddress: this.auth.chain.factoryAddress,
            rpcClient,
        }));
    }
    async getAddress() {
        if (this.address !== undefined) {
            return this.address;
        }
        try {
            this.address = await this.provider.getAddress();
            return this.address;
        }
        catch (e) {
            throw new Error("Error getting address");
        }
    }
    async sendUserOp(targetAddress, data, sponsorGas) {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=SmartContractWallet.js.map