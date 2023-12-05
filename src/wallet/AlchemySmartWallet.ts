import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { Hash } from "viem";
import { Auth } from "../auth/Auth";
import { SmartWalletProviderInfo } from "./types";
import {
  SmartAccountSigner,
  UserOperationCallData,
  UserOperationReceipt,
  UserOperationResponse,
} from "@alchemy/aa-core";
import { Address, Hex } from "viem";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";

import { viemChain, Chain } from "../helpers/chains";
import { ISmartWallet } from "./ISmartWallet";
export class AlchemySmartWallet
  extends LightSmartContractAccount
  implements ISmartWallet
{
  ethersWallet: PKPEthersWallet | undefined;
  auth: Auth;
  smartWalletProviderInfo: SmartWalletProviderInfo;
  provider: AlchemyProvider;

  constructor(
    auth: Auth,
    smartWalletProviderInfo: SmartWalletProviderInfo,
    provider: AlchemyProvider,
    signer: SmartAccountSigner,
  ) {
    super({
      rpcClient: provider.rpcClient,
      owner: signer,
      chain: viemChain(auth.chain),
      factoryAddress: getDefaultLightAccountFactoryAddress(
        viemChain(auth.chain),
      ),
    });
    this.provider = provider;
    this.auth = auth;
    this.smartWalletProviderInfo = smartWalletProviderInfo;
  }

  async switchChain(chain: Chain): Promise<void> {
    try {
      this.auth.switchChain(chain);
    } catch (error) {
      throw new Error(
        `Failed to switch chain: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }

  async sendUserOperation(
    target: Address,
    data: Hex,
    value?: bigint,
  ): Promise<{ hash: string }> {
    try {
      const userOperationCallData: UserOperationCallData = {
        target: target,
        data: data,
        value: value,
      };
      const response = await this.provider.sendUserOperation(
        userOperationCallData,
      );
      return { hash: response.hash };
    } catch (error) {
      throw new Error(
        `Failed to send user operation: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }

  async waitForUserOperationTransaction(hash: Hash): Promise<Hash> {
    try {
      return await this.provider.waitForUserOperationTransaction(hash);
    } catch (error) {
      throw new Error(
        `Failed to wait for user operation transaction: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }

  async getUserOperationByHash(
    hash: Hash,
  ): Promise<UserOperationResponse | null> {
    try {
      return await this.provider.getUserOperationByHash(hash);
    } catch (error) {
      throw new Error(
        `Failed to get user operation by hash: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }

  async getUserOperationReceipt(
    hash: Hash,
  ): Promise<UserOperationReceipt | null> {
    try {
      return await this.provider.getUserOperationReceipt(hash);
    } catch (error) {
      throw new Error(
        `Failed to get user operation receipt: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }

  override async encodeExecute(
    target: string,
    value: bigint,
    data: string,
  ): Promise<Hash> {
    throw new Error("Method not implemented.");
  }

  override async signMessage(msg: string | Uint8Array): Promise<Hash> {
    throw new Error("Method not implemented.");
  }

  override async getAccountInitCode(): Promise<Hash> {
    throw new Error("Method not implemented.");
  }
}
