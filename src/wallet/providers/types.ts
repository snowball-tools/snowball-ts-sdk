import type { Address, Hash } from "viem";
import type { Chain, SmartWalletProviderInfo } from "../../helpers";
import { UserOperationReceipt, UserOperationResponse } from "@alchemy/aa-core";

export interface SnowballSmartWalletProvider {
  chain: Chain;
  smartWalletProviderInfo: SmartWalletProviderInfo;

  changeChain(chain: Chain): void;
  sendUserOperation(
    targetAddress: Address,
    data: Address,
    sponsorGas: Boolean
  ): Promise<{
    hash: string;
  }>;
  waitForUserOperationTransaction(hash: Hash): Promise<Hash>;
  getUserOperationByHash(hash: Hash): Promise<UserOperationResponse>;
  getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt>;
}
