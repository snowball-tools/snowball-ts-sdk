import { LitAuthClient, WebAuthnProvider } from "@lit-protocol/lit-auth-client";
import { ProviderType } from "@lit-protocol/constants";
import { AuthMethod } from "@lit-protocol/types";

class SnowballAuth {
  private litAuthClient: LitAuthClient;
  private webAuthnProvider: WebAuthnProvider;

  constructor(apiKey: string) {
    this.litAuthClient = new LitAuthClient({
      litRelayConfig: {
        relayApiKey: apiKey,
      },
    });

    this.litAuthClient.initProvider(ProviderType.WebAuthn);

    this.webAuthnProvider = this.litAuthClient.getProvider(
      ProviderType.WebAuthn
    ) as WebAuthnProvider;
  }

  async registerPasskey(username: string): Promise<{
    pkpEthAddress: string;
    pkpPublicKey: string;
  }> {
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
        return Promise.reject("Registration failed");
      }
      return {
        pkpEthAddress: response.pkpEthAddress,
        pkpPublicKey: response.pkpPublicKey,
      };
    } catch (error) {
      return Promise.reject("Registration failed");
    }
  }

  async authenticatePasskey(): Promise<AuthMethod> {
    try {
      const auth = await this.webAuthnProvider.authenticate();

      if (auth === undefined) {
        return Promise.reject("Authentication failed. auth is undefined");
      }

      return auth;
    } catch (error: any) {
      return Promise.reject("Authentication failed");
    }
  }
}

export default SnowballAuth;
