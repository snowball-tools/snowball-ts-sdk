"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var chains_1 = require("../helpers/chains");
var aa_alchemy_1 = require("@alchemy/aa-alchemy");
var promise_1 = require("../helpers/promise");
var alchemy_sdk_1 = require("alchemy-sdk");
var AlchemyAA = /** @class */ (function (_super) {
    __extends(AlchemyAA, _super);
    function AlchemyAA(auth, apiKey, gasPolicyId) {
        var _this = _super.call(this, {
            chain: (0, chains_1.viemChain)(auth.chain),
            entryPointAddress: auth.chain.entryPointAddress,
            apiKey: apiKey,
        }) || this;
        _this.auth = auth;
        _this.apiKey = apiKey;
        _this.gasPolicyId = gasPolicyId;
        _this.alchemy = new alchemy_sdk_1.Alchemy({
            apiKey: apiKey,
            network: (0, chains_1.getAlchemyNetwork)(_this.auth.chain),
        });
        return _this;
    }
    AlchemyAA.prototype.sendUserOp = function (targetAddress, data, sponsorGas) {
        return __awaiter(this, void 0, void 0, function () {
            var result, receipt, userOpReceipt, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (this.gasPolicyId !== undefined && sponsorGas) {
                            this.withAlchemyGasManager({
                                policyId: this.gasPolicyId,
                                entryPoint: this.auth.chain.entryPointAddress,
                            });
                        }
                        return [4 /*yield*/, this.sendUserOperation({
                                target: targetAddress,
                                data: data,
                            })];
                    case 1:
                        result = _a.sent();
                        if (result === undefined || result.hash === undefined) {
                            return [2 /*return*/, Promise.reject("Transaction failed")];
                        }
                        return [4 /*yield*/, (0, promise_1.retry)(this.waitForUserOperationTransaction, [result.hash], 10)];
                    case 2:
                        receipt = _a.sent();
                        return [4 /*yield*/, (0, promise_1.retry)(this.getUserOperationReceipt, [result.hash], 10)];
                    case 3:
                        userOpReceipt = _a.sent();
                        if (userOpReceipt === null) {
                            return [2 /*return*/, Promise.reject("Transaction failed")];
                        }
                        return [2 /*return*/, result];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, Promise.reject("Transaction failed ".concat(error_1))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return AlchemyAA;
}(aa_alchemy_1.AlchemyProvider));
exports.default = AlchemyAA;
