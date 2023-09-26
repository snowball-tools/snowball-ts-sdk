import type { Chain } from "../../helpers/chains";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { type AuthProviderInfo } from "../../helpers";
import type { SnowballAuth } from "../../snowball";
import { LitPasskey, type SnowballPasskeyProvider } from "./providers";
export declare class SnowballPasskey implements SnowballAuth {
    chain: Chain;
    authProviderInfo: AuthProviderInfo;
    passkeyProvider: SnowballPasskeyProvider;
    constructor(chain: Chain, authProviderInfo: AuthProviderInfo);
    isWebAuthnSupported(): boolean;
    register(username: string): Promise<void>;
    authenticate(): Promise<void>;
    getEthersWallet(): Promise<PKPEthersWallet>;
    initPasskeyProvider(authProviderInfo: AuthProviderInfo): LitPasskey;
}
//# sourceMappingURL=SnowballPasskey.d.ts.map