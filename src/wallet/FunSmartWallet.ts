import type { Address } from "viem";
import { UserOperationResponse, UserOperationReceipt } from "@alchemy/aa-core";
import { SmartWallet } from "./SmartWallet";
import {
  FunWallet,
  Auth as FunAuth,
  GlobalEnvOption,
  configureEnvironment,
} from "@fun-xyz/core";
import { FunSmartWalletProviderKey, SmartWalletProviderInfo } from "./types";
import { Auth } from "../auth";

export class FunSmartWallet extends SmartWallet {
  private provider: FunWallet | undefined;
  private authProvider: FunAuth | undefined;

  constructor(auth: Auth, smartWalletProviderInfo: SmartWalletProviderInfo) {
    super(auth, smartWalletProviderInfo);

    if (smartWalletProviderInfo.apiKeys[FunSmartWalletProviderKey.key] === "") {
      throw new Error("Please provide an api key for Fun.xyz");
    }
  }

  async sendUserOperation(
    targetAddress: Address,
    data: Address,
    _sponsorGas: Boolean
  ): Promise<{ hash: string }> {
    try {
      this.provider = this.provider ? this.provider : await this.initProvider();

      const authId = await this.authProvider!.getUserId();

      const op = await this.provider.createOperation(
        this.authProvider!,
        authId,
        {
          to: targetAddress,
          data: data,
        }
      );
      const receipt = await this.provider.executeOperation(
        this.authProvider!,
        op
      );
      return { hash: receipt.userOpHash };
    } catch (error) {
      return Promise.reject(
        `sendUserOperation failed ${JSON.stringify(error)}`
      );
    }
  }

  async getAddress(): Promise<`0x${string}`> {
    this.provider = this.provider ? this.provider : await this.initProvider();

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
    try {
      await this.initProvider();

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(`[FunSmartWallet] changeChain failed ${error}`);
    }
  }

  async initProvider(): Promise<FunWallet> {
    try {
      const config: GlobalEnvOption = {
        chain: this.chain.chainId,
        gasSponsor: {
          sponsorAddress: this.smartWalletProviderInfo.apiKeys[
            FunSmartWalletProviderKey.gasPolicyId
          ] as Address,
        },
        apiKey:
          this.smartWalletProviderInfo.apiKeys[FunSmartWalletProviderKey.key],
      };

      this.ethersWallet = await this.auth.getEthersWallet(async () => {
        await configureEnvironment(config);
      });

      this.authProvider = new FunAuth({ signer: this.ethersWallet });
      this.provider = new FunWallet({
        users: [{ userId: await this.authProvider.getUserId() }],
        uniqueId: await this.authProvider.getWalletUniqueId(),
      });
      return this.provider;
    } catch (error) {
      return Promise.reject(
        `[FunSmartWallet] initProvider failed ${JSON.stringify(error)}`
      );
    }
  }
}
