import { SnowballAuth, SnowballSmartWallet } from "..";
import { getAlchemyNetwork, viemChain } from "../helpers/chains";
import {
  SimpleSmartContractAccount,
  SimpleSmartAccountOwner,
  Address,
  SendUserOperationResult,
  Hex,
  SmartAccountProvider,
  HttpTransport,
  UserOperationStruct,
  Deferrable,
} from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { retry } from "../helpers/promise";
import { Alchemy } from "alchemy-sdk";

class AlchemyAA extends AlchemyProvider implements SnowballSmartWallet {
  public auth: SnowballAuth;
  private simpleAccountOwner: SimpleSmartAccountOwner | undefined;
  private address: Address | undefined;
  private apiKey: string;
  private alchemy: Alchemy;
  private gasPolicyId: string | undefined;

  constructor(
    auth: SnowballAuth,
    apiKey: string,
    gasPolicyId: string | undefined
  ) {
    super({
      chain: viemChain(auth.chain),
      entryPointAddress: auth.chain.entryPointAddress,
      apiKey: apiKey,
    });
    this.auth = auth;
    this.apiKey = apiKey;
    this.gasPolicyId = gasPolicyId;

    this.alchemy = new Alchemy({
      apiKey: apiKey,
      network: getAlchemyNetwork(this.auth.chain),
    });
  }

  async sendUserOp(
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<SendUserOperationResult> {
    try {
      if (this.gasPolicyId !== undefined && sponsorGas) {
        this.withAlchemyGasManager({
          policyId: this.gasPolicyId,
          entryPoint: this.auth.chain.entryPointAddress,
        });
      }

      const result: SendUserOperationResult = await this.sendUserOperation({
        target: targetAddress,
        data: data,
      });

      if (result === undefined || result.hash === undefined) {
        return Promise.reject("Transaction failed");
      }

      // wait for user op
      let receipt = await retry(
        this.waitForUserOperationTransaction,
        [result.hash as Address],
        10
      );

      let userOpReceipt = await retry(
        this.getUserOperationReceipt,
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

export default AlchemyAA;
