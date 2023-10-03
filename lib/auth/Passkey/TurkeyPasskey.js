"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurkeyPasskey = void 0;
const Passkey_1 = require("./Passkey");
class TurkeyPasskey extends Passkey_1.Passkey {
    registerPasskey(_username) {
        throw new Error("Method not implemented.");
    }
    authenticatePasskey() {
        throw new Error("Method not implemented.");
    }
    getEthersWallet() {
        throw new Error("Method not implemented.");
    }
}
exports.TurkeyPasskey = TurkeyPasskey;
