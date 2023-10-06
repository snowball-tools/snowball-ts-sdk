import type { Address } from "viem";
import { UserOperationResponse, UserOperationReceipt } from "@alchemy/aa-core";
import { SmartWallet } from "./SmartWallet";
import {
  FunWallet,
  Auth,
  GlobalEnvOption,
  configureEnvironment,
} from "@fun-xyz/core";

export class FunSmartWallet extends SmartWallet {
  private provider: FunWallet | undefined;
  private authProvider: Auth | undefined;
  private authId: Address | undefined;

  async sendUserOperation(
    targetAddress: Address,
    data: Address,
    _sponsorGas: Boolean
  ): Promise<{ hash: string }> {
    const address = await this.getAddress();

    const op = await this.provider!.createOperation(
      this.authProvider!,
      this.authId!,
      {
        to: targetAddress,
        data: data,
      }
    );
    const receipt = await this.provider!.executeOperation(
      this.authProvider!,
      op
    );
    return { hash: receipt.userOpHash };
  }

  async getAddress(): Promise<`0x${string}`> {
    const ethersWallet = await this.auth.getEthersWallet();
    this.authProvider = new Auth({ signer: ethersWallet });
    this.authId = await this.authProvider.getUserId();
    this.provider = new FunWallet({
      users: [{ userId: await this.authProvider.getUserId() }],
      uniqueId: await this.authProvider.getWalletUniqueId(),
    });
    const address = await this.provider.getAddress();
    return address;
  }

  async waitForUserOperationTransaction(
    _hash: `0x${string}`
  ): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }

  async getUserOperationByHash(
    _hash: `0x${string}`
  ): Promise<UserOperationResponse> {
    throw new Error("Method not implemented.");
  }

  async getUserOperationReceipt(
    _hash: `0x${string}`
  ): Promise<UserOperationReceipt> {
    throw new Error("Method not implemented.");
  }

  async switchChain(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
