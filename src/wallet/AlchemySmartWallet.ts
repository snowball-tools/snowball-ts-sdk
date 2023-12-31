import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { Hash } from "viem";
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
import { AuthProviderInfo } from "../auth";
//import { SmartWallet } from "./SmartWallet";
export class AlchemySmartWallet
  extends LightSmartContractAccount
  implements ISmartWallet
{
  ethersWallet: PKPEthersWallet | undefined;
  provider: AlchemyProvider;
  authProviderInfo: AuthProviderInfo;

  constructor(
    chain: Chain,
    authProviderInfo: AuthProviderInfo,
    provider: AlchemyProvider,
    signer: SmartAccountSigner,
  ) {
    super({
      rpcClient: provider.rpcClient,
      owner: signer,
      chain: viemChain(chain),
      factoryAddress: getDefaultLightAccountFactoryAddress(viemChain(chain)),
    });
    this.provider = provider;
    this.authProviderInfo = authProviderInfo;
  }

  async switchChain(chain: Chain): Promise<void> {
    throw new Error("Method not implemented.");
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
}
