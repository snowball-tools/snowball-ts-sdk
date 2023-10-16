import { SmartWalletProvider } from "./base";

export interface SmartWalletProviderInfo {
  name: SmartWalletProvider;
  apiKeys: { [key: string]: string };
}