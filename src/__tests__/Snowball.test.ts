import { CHAINS, SmartWalletProvider, AuthProvider } from "../helpers";
import { Snowball } from "../snowball";
import { LIT_RELAY_API_KEY } from "../helpers/env";
import { JSDOM } from "jsdom";

const { window } = new JSDOM();

describe("Snowball", () => {
  describe("Init Snowball", () => {
    const snowball = new Snowball(
      "",
      CHAINS.goerli,
      {
        name: AuthProvider.lit,
        apiKeys: {
          relayKey: LIT_RELAY_API_KEY,
        },
      },
      {
        name: SmartWalletProvider.alchemy,
        apiKeys: {},
      }
    );

    it("should return", async () => {
      expect(await snowball.auth.authenticate()).toHaveBeenCalledOnce();
    });
  });
});
