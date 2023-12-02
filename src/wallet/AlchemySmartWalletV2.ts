import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { BaseSmartContractAccountWrapper } from "./BaseSmartContractAccountWrapper";
import { Hash } from "viem";
import { Auth } from "../auth/Auth";
import { SmartWalletProviderInfo } from "./types";
import {
  SmartAccountSigner,
  UserOperationReceipt,
  UserOperationResponse,
} from "@alchemy/aa-core";
import { LightSmartContractAccount } from "@alchemy/aa-accounts";
import { viemChain } from "../helpers/chains";
import { getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts";
import { ISmartWalletV2 } from "./ISmartWalletV2";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
export class AlchemySmartWalletV2
  extends BaseSmartContractAccountWrapper
  implements ISmartWalletV2
{
  ethersWallet: PKPEthersWallet | undefined;
  constructor(
    auth: Auth,
    smartWalletProviderInfo: SmartWalletProviderInfo,
    provider: AlchemyProvider,
    signer: SmartAccountSigner
  ) {
    super(auth, smartWalletProviderInfo, provider, signer);

    // creates a light account instance
    async () => {
      provider.connect(
        (rpcClient) =>
          new LightSmartContractAccount({
            chain: viemChain(this.chain),
            owner: signer,
            factoryAddress: getDefaultLightAccountFactoryAddress(
              viemChain(this.chain)
            ),
            rpcClient: rpcClient,
          })
      );

      this.provider = provider;
      this.ethersWallet = await auth.getEthersWallet();
    };
  }

  address: `0x${string}` | undefined;
  switchChain(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendUserOperation(
    targetAddress: `0x${string}`,
    data: `0x${string}`,
    sponsorGas: boolean
  ): Promise<{ hash: string }> {
    throw new Error("Method not implemented.");
  }
  waitForUserOperationTransaction(hash: `0x${string}`): Promise<`0x${string}`> {
    throw new Error("Method not implemented.");
  }
  getUserOperationByHash(hash: `0x${string}`): Promise<UserOperationResponse> {
    throw new Error("Method not implemented.");
  }
  getUserOperationReceipt(hash: `0x${string}`): Promise<UserOperationReceipt> {
    throw new Error("Method not implemented.");
  }

  // Implementing or overriding methods from BaseSmartContractAccountWrapper
  override async encodeExecute(
    target: string,
    value: bigint,
    data: string
  ): Promise<Hash> {
    // Specific implementation for AlchemySmartWalletV2
    // TODO: Provide the logic to encode the execute method call for AlchemySmartWalletV2
    return "0x"; // Placeholder implementation
  }

  override async signMessage(msg: string | Uint8Array): Promise<Hash> {
    // Specific implementation for AlchemySmartWalletV2
    // TODO: Provide the logic to sign a message for AlchemySmartWalletV2
    return "0x"; // Placeholder implementation
  }

  override async getAccountInitCode(): Promise<Hash> {
    // Specific implementation for AlchemySmartWalletV2
    // TODO: Provide the logic to return the account init code for AlchemySmartWalletV2
    return "0x"; // Placeholder implementation
  }

  // Implement additional methods specific to AlchemySmartWalletV2, if necessary
  // Example:
  async performCustomOperation(): Promise<void> {
    // Custom operation logic specific to AlchemySmartWalletV2
  }
}