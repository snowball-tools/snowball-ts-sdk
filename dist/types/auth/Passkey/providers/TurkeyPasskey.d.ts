import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { AuthProviderInfo, Chain } from "../../../helpers";
import type { SnowballPasskeyProvider } from "./SnowballPasskeyProvider";
export declare class TurkeyPasskey implements SnowballPasskeyProvider {
    chain: Chain;
    authProviderInfo: AuthProviderInfo;
    constructor(chain: Chain, authProviderInfo: AuthProviderInfo);
    registerPasskey(_username: string): Promise<void>;
    authenticatePasskey(): Promise<void>;
    getEthersWallet(): Promise<PKPEthersWallet>;
}
//# sourceMappingURL=TurkeyPasskey.d.ts.map