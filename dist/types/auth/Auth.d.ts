import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { Chain } from "../helpers/chains";
import { type SnowballAuth } from "../snowball";
import { type AuthProviderInfo } from "../helpers";
export declare class Auth implements SnowballAuth {
    authProviderInfo: AuthProviderInfo;
    chain: Chain;
    authProvider: SnowballAuth;
    constructor(chain: Chain, authProviderInfo: AuthProviderInfo, snowballAPIKey: string);
    register(username: string): Promise<void>;
    authenticate(): Promise<void>;
    getEthersWallet(): Promise<PKPEthersWallet>;
    initAuthProvider(): SnowballAuth;
    changeChain(chain: Chain): Promise<PKPEthersWallet>;
}
//# sourceMappingURL=Auth.d.ts.map