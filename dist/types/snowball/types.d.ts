import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { AuthProviderInfo, Chain, SmartWalletProviderInfo } from "../helpers";
import { Address, Hex } from "viem";
export interface SnowballAuth {
    authProviderInfo: AuthProviderInfo;
    readonly chain: Chain;
    register(username: string): Promise<void>;
    authenticate(): Promise<void>;
    getEthersWallet(): Promise<PKPEthersWallet>;
    changeChain(chain: Chain): Promise<PKPEthersWallet>;
}
export interface SnowballSmartWallet {
    smartWalletProviderInfo: SmartWalletProviderInfo;
    auth: SnowballAuth;
    getAddress(): Promise<Address>;
    changeChain(ethersWallet: PKPEthersWallet): Promise<void>;
    sendUserOperation(targetAddress: Address, data: Hex, sponsorGas: Boolean): Promise<{
        hash: string;
    }>;
}
//# sourceMappingURL=types.d.ts.map