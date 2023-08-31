import { SnowballAuth, SnowballSmartWallet } from "..";
import { getAlchemyNetwork, viemChain } from "../helpers/chains";
import {
  SimpleSmartContractAccount,
  SimpleSmartAccountOwner,
  Address,
  SendUserOperationResult,
  Hex,
} from "@alchemy/aa-core";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { retry } from "../helpers/promise";
import { Alchemy } from "alchemy-sdk";

class AlchemyAA implements SnowballSmartWallet {
  private auth: SnowballAuth;
  private simpleAccountOwner: SimpleSmartAccountOwner | undefined;
  private provider: AlchemyProvider | undefined;
  private address: Address | undefined;
  private apiKey: string;
  private alchemy: Alchemy;

  constructor(auth: SnowballAuth, apiKey: string) {
    this.auth = auth;
    this.apiKey = apiKey;

    this.alchemy = new Alchemy({
      apiKey: apiKey,
      network: getAlchemyNetwork(this.auth.chain),
    });
  }

  async getSmartWalletAddress(): Promise<Address> {
    try {
      this.simpleAccountOwner = await this.auth.getSimpleAccountOwner(
        this.auth.chain
      );

      const owner = this.simpleAccountOwner;

      if (owner === undefined) {
        return Promise.reject("SimpleAccountOwner is undefined");
      }

      this.provider = new AlchemyProvider({
        chain: viemChain(this.auth.chain),
        entryPointAddress: this.auth.chain.entryPointAddress,
        apiKey: this.apiKey,
      }).connect(
        (rpcClient) =>
          new SimpleSmartContractAccount({
            owner,
            entryPointAddress: this.auth.chain.entryPointAddress,
            chain: viemChain(this.auth.chain),
            factoryAddress: this.auth.chain.factoryAddress,
            rpcClient,
          })
      );

      const address = await this.provider.getAddress();

      if (address === undefined) {
        return Promise.reject("Getting Counterfactual Address failed");
      }

      this.address = address;

      return address;
    } catch (error) {
      return Promise.reject("Getting Counterfactual Address failed");
    }
  }

  async sendUserOperation(
    gasPolicyId: string,
    targetAddress: Address,
    data: Hex
  ): Promise<Boolean> {
    try {
      if (this.provider === undefined) {
        await this.getSmartWalletAddress().catch((error) => {
          return Promise.reject(error);
        });
      }

      this.provider = this.provider!.withAlchemyGasManager({
        policyId: gasPolicyId,
        entryPoint: this.auth.chain.entryPointAddress,
      });

      const result: SendUserOperationResult =
        await this.provider.sendUserOperation({
          target: targetAddress,
          data: data,
        });

      if (result === undefined || result.hash === undefined) {
        return Promise.reject("Transaction failed");
      }

      // wait for user op
      let receipt = await retry(
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

      return true;
    } catch (error) {
      return Promise.reject(`Transaction failed ${error}`);
    }
  }
}

export default AlchemyAA;
