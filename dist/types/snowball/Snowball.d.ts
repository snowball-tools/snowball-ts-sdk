import type { Address, Hex } from "@alchemy/aa-core";
import type { Chain } from "../helpers/chains";
import { type SmartWalletProviderInfo, type AuthProviderInfo } from "../helpers/constants";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { SnowballAuth, SnowballSmartWallet } from "./types";
export declare class Snowball {
    private chain;
    private authProviderInfo;
    private smartWalletProviderInfo;
    auth: SnowballAuth;
    smartWallet: SnowballSmartWallet | undefined;
    ethersWallet: PKPEthersWallet | undefined;
    constructor(_apiKey: string, chain: Chain, authProviderInfo: AuthProviderInfo, smartWalletProviderInfo: SmartWalletProviderInfo);
    register(username: string): Promise<void>;
    authenticate(): Promise<void>;
    getEthersWallet(): Promise<PKPEthersWallet>;
    changeChain(chain: Chain): Promise<void>;
    getAddress(): Promise<Address>;
    private initSmartWallet;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
}
//# sourceMappingURL=Snowball.d.ts.map