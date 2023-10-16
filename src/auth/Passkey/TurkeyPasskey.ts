/* eslint-disable */
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { SnowballPasskey } from "./SnowballPasskey";

export class TurkeyPasskey extends SnowballPasskey {
  registerPasskey(_username: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  authenticatePasskey(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getEthersWallet(): Promise<PKPEthersWallet> {
    throw new Error("Method not implemented.");
  }
}
