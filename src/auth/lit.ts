import { LitAuthClient, WebAuthnProvider } from "@lit-protocol/lit-auth-client";
import { ProviderType } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import {
  AuthMethod,
  AuthCallbackParams,
  IRelayPKP,
  SessionSigsMap,
} from "@lit-protocol/types";
import { LitAbility, LitActionResource } from "@lit-protocol/auth-helpers";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import {
  SimpleSmartAccountOwner,
  Address,
  SignTypedDataParams,
} from "@alchemy/aa-core";
import { TypedDataField } from "@ethersproject/abstract-signer";
import { DEFAULT_EXP } from "../helpers/constants";
import { Chain } from "../helpers/chains";
import { SnowballAuth } from "..";

class LitAuth implements SnowballAuth {
  private litAuthClient: LitAuthClient;
  private webAuthnProvider: WebAuthnProvider;
  private litNodeClient: LitNodeClient;

  private authenticated: AuthMethod | undefined;
  private pkpPublicKey: string | undefined;
  private pkpEthAddress: string | undefined;
  private sessionSig: SessionSigsMap | undefined;
  private pkpWallet: PKPEthersWallet | undefined;
  public chain: Chain;

  // to do: get setter
  public simpleAccountOwner: SimpleSmartAccountOwner | undefined;

  constructor(apiKey: string, chain: Chain) {
    this.litAuthClient = new LitAuthClient({
      litRelayConfig: {
        relayApiKey: apiKey,
      },
    });

    this.litAuthClient.initProvider(ProviderType.WebAuthn);

    this.webAuthnProvider = this.litAuthClient.getProvider(
      ProviderType.WebAuthn
    ) as WebAuthnProvider;

    this.litNodeClient = new LitNodeClient({
      litNetwork: "serrano",
      debug: false,
    });

    this.chain = chain;
  }

  async registerPasskey(username: string): Promise<Boolean> {
    try {
      const options = await this.webAuthnProvider.register(username);
      const txHash = await this.webAuthnProvider.verifyAndMintPKPThroughRelayer(
        options
      );
      const response =
        await this.webAuthnProvider.relay.pollRequestUntilTerminalState(txHash);

      if (
        response.pkpEthAddress === undefined ||
        response.pkpPublicKey === undefined
      ) {
        return Promise.reject(
          "Registration failed. pkpEthAddress or pkpPublicKey undefined"
        );
      }

      this.pkpEthAddress = response.pkpEthAddress;
      this.pkpPublicKey = response.pkpPublicKey;

      return true;
    } catch (error) {
      return Promise.reject(`Registration failed ${error}`);
    }
  }

  async authenticatePasskey(): Promise<Boolean> {
    try {
      const auth = await this.webAuthnProvider.authenticate();

      if (auth === undefined) {
        return Promise.reject("Authentication failed");
      }

      this.authenticated = auth;
      return true;
    } catch (error) {
      return Promise.reject(`Authentication failed ${error}`);
    }
  }

  async fetchPkpsForAuthMethod(): Promise<IRelayPKP[]> {
    try {
      if (this.authenticated === undefined) {
        await this.authenticatePasskey();
      }

      if (this.authenticated === undefined) {
        return Promise.reject("No auth method found");
      }

      const pkps = await this.webAuthnProvider.fetchPKPsThroughRelayer(
        this.authenticated
      );

      if (pkps.length === 0) {
        return Promise.reject("No PKPs found");
      }
      return pkps;
    } catch (error) {
      return Promise.reject(`Retrieving PKPs failed ${error}`);
    }
  }

  async getSessionSigs(): Promise<Boolean> {
    try {
      if (this.authenticated === undefined) {
        await this.authenticatePasskey();
      }

      if (this.authenticated === undefined) {
        return Promise.reject("No auth method found");
      }

      if (this.pkpPublicKey === undefined) {
        await this.fetchPkpsForAuthMethod();
      }

      if (this.pkpPublicKey === undefined) {
        return Promise.reject("No PKPs found");
      }

      await this.litNodeClient.connect();

      const authNeededCallback = async (params: AuthCallbackParams) => {
        const resp = await this.litNodeClient.signSessionKey({
          statement: params.statement,
          authMethods: [this.authenticated!],
          pkpPublicKey: this.pkpPublicKey,
          expiration: params.expiration,
          resources: params.resources,
          chainId: this.chain.chainId,
        });
        return resp.authSig;
      };

      const sessionSigs = await this.litNodeClient.getSessionSigs({
        expiration: DEFAULT_EXP,
        chain: this.chain.name,
        resourceAbilityRequests: [
          {
            resource: new LitActionResource("*"),
            ability: LitAbility.PKPSigning,
          },
        ],
        switchChain: false,
        authNeededCallback: authNeededCallback,
      });

      if (sessionSigs === undefined) {
        return Promise.reject("Retrieving session sigs failed. undefined");
      }

      this.sessionSig = sessionSigs;
      return true;
    } catch (error) {
      return Promise.reject(`Retrieving session sigs failed ${error}`);
    }
  }

  async createPkpEthersWallet(): Promise<Boolean> {
    if (this.authenticated === undefined) {
      await this.authenticatePasskey().catch((error) => {
        return Promise.reject(`Transaction failed ${error}`);
      });
    }

    if (this.pkpPublicKey === undefined) {
      await this.fetchPkpsForAuthMethod().catch((error) => {
        return Promise.reject(`Transaction failed ${error}`);
      });
    }

    if (this.sessionSig === undefined) {
      await this.getSessionSigs().catch((error) => {
        return Promise.reject(`Transaction failed ${error}`);
      });
    }

    try {
      const pkpWallet = new PKPEthersWallet({
        controllerSessionSigs: this.sessionSig,
        pkpPubKey: this.pkpPublicKey!,
        rpc: "https://chain-rpc.litprotocol.com/http",
      });
      await pkpWallet.init();

      if (pkpWallet === undefined) {
        return Promise.reject("Transaction failed. pkpWallet undefined");
      }

      this.pkpWallet = pkpWallet;

      return true;
    } catch (error) {
      return Promise.reject(`Transaction failed ${error}`);
    }
  }

  async getSimpleAccountOwner(): Promise<SimpleSmartAccountOwner> {
    if (this.simpleAccountOwner) {
      return this.simpleAccountOwner;
    }

    try {
      if (this.pkpWallet === undefined) {
        await this.createPkpEthersWallet().catch((error) => {
          return Promise.reject(`Transaction failed ${error}`);
        });
      }

      const owner: SimpleSmartAccountOwner = {
        signMessage: async (msg: Uint8Array) => {
          return (await this.pkpWallet!.signMessage(msg)) as Address;
        },
        getAddress: async () => {
          return (await this.pkpWallet!.getAddress()) as Address;
        },
        signTypedData: async (params: SignTypedDataParams) => {
          const types: Record<string, Array<TypedDataField>> = {
            [params.primaryType]: params.types["x"].map(
              (value) =>
                ({
                  name: value.name,
                  type: value.type,
                } as TypedDataField)
            ),
          };

          return (await this.pkpWallet!._signTypedData(
            params.domain ? params.domain : {},
            types,
            params.message
          )) as Address;
        },
      };

      this.simpleAccountOwner = owner;
      return owner;
    } catch (error) {
      return Promise.reject(`Get Simple Account Owner failed ${error}`);
    }
  }
}

export default LitAuth;
