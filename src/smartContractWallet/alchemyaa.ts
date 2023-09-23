import {
  type Address,
  type SendUserOperationResult,
  type Hex,
  type SimpleSmartAccountOwner,
  BaseSmartContractAccount,
  type BatchUserOperationCallData,
  type FeeDataMiddleware,
  type GasEstimatorMiddleware,
  type PaymasterAndDataMiddleware,
  type SignTypedDataParams,
  type UserOperationCallData,
  type UserOperationReceipt,
  type UserOperationResponse,
  type UserOperationStruct,
  type AccountMiddlewareFn,
  type PublicErc4337Client,
} from "@alchemy/aa-core";
import { retry } from "../helpers/promise";
import type { SnowballAuth } from "../main/Snowball";
import type { Transport, RpcTransactionRequest } from "viem";
import type { SignTypedDataParameters } from "viem/accounts";
import { SmartContractWallet } from "./SmartContractWallet";
import type { AAProvider } from "../helpers/constants";

export class AlchemyAA extends SmartContractWallet {
  private gasPolicyId: string | undefined;

  constructor(
    auth: SnowballAuth,
    simpleAccountOwner: SimpleSmartAccountOwner,
    aaProvider: AAProvider
  ) {
    super(auth, simpleAccountOwner, aaProvider);
    this.auth = auth;
    this.gasPolicyId =
      this.aaProvider.apiKeys[
        `alchemyKey-${auth.chain.name.toLowerCase()}-gasPolicyId`
      ];
    console.log(
      this.aaProvider.apiKeys[
        `alchemyKey-${auth.chain.name.toLowerCase()}-gasPolicyId`
      ]
    );
  }

  async sendUserOp(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult> {
    try {
      if (this.gasPolicyId !== undefined && sponsorGas) {
        this.provider = this.provider.withAlchemyGasManager({
          policyId: this.gasPolicyId,
          entryPoint: this.auth.chain.entryPointAddress,
        });
      }

      const result: SendUserOperationResult =
        await this.provider.sendUserOperation({
          target: targetAddress,
          data: data,
        });

      if (result === undefined || result.hash === undefined) {
        return Promise.reject("Transaction failed");
      }

      // wait for user op
      await retry(
        this.provider.waitForUserOperationTransaction,
        [result.hash as Address],
        10
      );

      let userOpReceipt = await retry(
        this.provider.getUserOperationReceipt,
        [result.hash as Address],
        10
      );

      if (userOpReceipt === null) {
        return Promise.reject("Transaction failed");
      }

      return result;
    } catch (error) {
      return Promise.reject(`Transaction failed ${error}`);
    }
  }
}
