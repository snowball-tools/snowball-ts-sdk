import { SimpleSmartAccountOwner } from "@alchemy/aa-core";
import { SnowballAuth } from "..";
import { Chain } from "../helpers/chains";
declare class Passkey implements SnowballAuth {
    chain: Chain;
    constructor(chain: Chain);
    isWebAuthnSupported(): boolean;
    registerPasskey(username: string): Promise<void>;
    authenticatePasskey(): Promise<void>;
    getSimpleAccountOwner(chain: Chain): Promise<SimpleSmartAccountOwner>;
}
export default Passkey;
