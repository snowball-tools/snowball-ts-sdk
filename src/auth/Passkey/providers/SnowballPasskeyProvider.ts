import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { AuthProviderInfo, Chain } from "../../../helpers";

export interface SnowballPasskeyProvider {
  chain: Chain;
  authProviderInfo: AuthProviderInfo;

  registerPasskey(username: string): Promise<void>;
  authenticatePasskey(): Promise<void>;
  getEthersWallet(): Promise<PKPEthersWallet>;
}
