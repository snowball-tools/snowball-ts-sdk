"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var lit_auth_client_1 = require("@lit-protocol/lit-auth-client");
var constants_1 = require("@lit-protocol/constants");
var SnowballAuth = /** @class */ (function () {
    function SnowballAuth(apiKey) {
        this.litAuthClient = new lit_auth_client_1.LitAuthClient({
            litRelayConfig: {
                relayApiKey: apiKey,
            },
        });
        this.litAuthClient.initProvider(constants_1.ProviderType.WebAuthn);
        this.webAuthnProvider = this.litAuthClient.getProvider(constants_1.ProviderType.WebAuthn);
    }
    SnowballAuth.prototype.registerPasskey = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var options, txHash, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.webAuthnProvider.register(username)];
                    case 1:
                        options = _a.sent();
                        return [4 /*yield*/, this.webAuthnProvider.verifyAndMintPKPThroughRelayer(options)];
                    case 2:
                        txHash = _a.sent();
                        return [4 /*yield*/, this.webAuthnProvider.relay.pollRequestUntilTerminalState(txHash)];
                    case 3:
                        response = _a.sent();
                        if (response.pkpEthAddress === undefined ||
                            response.pkpPublicKey === undefined) {
                            return [2 /*return*/, Promise.reject("Registration failed")];
                        }
                        return [2 /*return*/, {
                                pkpEthAddress: response.pkpEthAddress,
                                pkpPublicKey: response.pkpPublicKey,
                            }];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, Promise.reject("Registration failed")];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SnowballAuth.prototype.authenticatePasskey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var auth, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.webAuthnProvider.authenticate()];
                    case 1:
                        auth = _a.sent();
                        if (auth === undefined) {
                            return [2 /*return*/, Promise.reject("Authentication failed. auth is undefined")];
                        }
                        return [2 /*return*/, auth];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, Promise.reject("Authentication failed")];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SnowballAuth;
}());
exports.default = SnowballAuth;
