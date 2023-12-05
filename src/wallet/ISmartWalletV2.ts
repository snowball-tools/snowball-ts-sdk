import {
  UserOperationReceipt,
  UserOperationResponse,
  type Address,
} from "@alchemy/aa-core";
import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Hash, Hex } from "viem";
import { Auth } from "../auth/Auth";
import { SmartWalletProviderInfo } from "./types";
import { Chain } from "../helpers/chains";

export interface ISmartWalletV2 {
  ethersWallet: PKPEthersWallet | undefined;
  auth: Auth;
  smartWalletProviderInfo: SmartWalletProviderInfo;

  getAddress(): Promise<Address>;

  switchChain(chain: Chain): Promise<void>;

  sendUserOperation(
    target: Address,
    data: Hex,
    value?: bigint,
  ): Promise<{
    hash: string;
  }>;

  waitForUserOperationTransaction(hash: Hash): Promise<Hash>;

  getUserOperationByHash(hash: Hash): Promise<UserOperationResponse | null>;

  getUserOperationReceipt(hash: Hash): Promise<UserOperationReceipt | null>;
}
