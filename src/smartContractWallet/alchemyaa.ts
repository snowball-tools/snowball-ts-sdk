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

class AlchemyAA implements SnowballSmartWallet {
  private auth: SnowballAuth;
  private simpleAccountOwner: SimpleSmartAccountOwner | undefined;
  private provider: AlchemyProvider | undefined;
  private address: Address | undefined;
  private apiKey: string;
  private alchemy: Alchemy;
  private gasPolicyId: string | undefined;

  constructor(
    auth: SnowballAuth,
    apiKey: string,
    gasPolicyId: string | undefined
  ) {
    this.auth = auth;
    this.apiKey = apiKey;
    this.gasPolicyId = gasPolicyId;

    this.alchemy = new Alchemy({
      apiKey: apiKey,
      network: getAlchemyNetwork(this.auth.chain),
    });
  }

  async gasEstimator(
    struct: Deferrable<UserOperationStruct>
  ): Promise<Deferrable<UserOperationStruct>> {
    try {
      if (this.provider === undefined) {
        this.provider = await this.getAlchemyProvider();
      }
      return await this.provider.gasEstimator(struct);
    } catch (error) {
      return Promise.reject("Gas estimation failed");
    }
  }

  async getAlchemyProvider(): Promise<AlchemyProvider> {
    try {
      this.simpleAccountOwner = await this.auth.getSimpleAccountOwner(
        this.auth.chain
      );

      const owner = this.simpleAccountOwner;

      if (owner === undefined) {
        return Promise.reject("SimpleAccountOwner is undefined");
      }

      return new AlchemyProvider({
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
    } catch (error) {
      return Promise.reject("Getting alchemy provider failed");
    }
  }

  async getSmartWalletAddress(): Promise<Address> {
    try {
      if (this.provider === undefined) {
        this.provider = await this.getAlchemyProvider();
      }

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
    targetAddress: Address,
    data: Hex,
    sponsorGas: Boolean
  ): Promise<Boolean> {
    try {
      if (this.provider === undefined) {
        this.provider = await this.getAlchemyProvider();
      }

      if (this.gasPolicyId !== undefined && sponsorGas) {
        this.provider = this.provider!.withAlchemyGasManager({
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
