import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Passkey } from "./Passkey";

export class TurkeyPasskey extends Passkey {
  registerPasskey(_username: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  authenticatePasskey(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getEthersWallet(config?: () => Promise<any>): Promise<PKPEthersWallet> {
    throw new Error("Method not implemented.");
  }
}
