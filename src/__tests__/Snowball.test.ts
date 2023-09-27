import { CHAINS, SmartWalletProvider, AuthProvider } from "../helpers";
import { Snowball } from "../snowball";
import { AlchemySmartWalletProviderKey } from "../helpers/constants";

describe("Snowball", () => {
  describe("Auth", () => {
    const snowball = new Snowball(
      "",
      CHAINS.goerli,
      {
        name: AuthProvider.lit,
      },
      {
        name: SmartWalletProvider.alchemy,
        apiKeys: {
          [AlchemySmartWalletProviderKey.goerli]: "key",
          [AlchemySmartWalletProviderKey.goerli_gasPolicyId]: "gasPolicyId",
          [AlchemySmartWalletProviderKey.sepolia]: "key",
          [AlchemySmartWalletProviderKey.sepolia_gasPolicyId]: "key",
        },
      }
    );

    it("authenticate runs", async () => {
      expect(await snowball.auth.authenticate());
    });

    it("register runs", async () => {
      expect(await snowball.auth.register("test"));
    });
  });
});
