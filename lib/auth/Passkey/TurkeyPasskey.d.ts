import type { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { Passkey } from "./Passkey";
export declare class TurkeyPasskey extends Passkey {
    registerPasskey(_username: string): Promise<void>;
    authenticatePasskey(): Promise<void>;
    getEthersWallet(): Promise<PKPEthersWallet>;
}
