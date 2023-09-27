import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import type { AuthProviderInfo, Chain } from "../../../helpers";
import type { SnowballPasskeyProvider } from "./SnowballPasskeyProvider";

export class TurkeyPasskey implements SnowballPasskeyProvider {
  chain: Chain;
  authProviderInfo: AuthProviderInfo;

  constructor(chain: Chain, authProviderInfo: AuthProviderInfo) {
    this.chain = chain;
    this.authProviderInfo = authProviderInfo;
  }

  registerPasskey(_username: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  authenticatePasskey(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getEthersWallet(): Promise<PKPEthersWallet> {
    throw new Error("Method not implemented.");
  }
  changeChain(_chain: Chain): Promise<PKPEthersWallet> {
    throw new Error("Method not implemented.");
  }
}
