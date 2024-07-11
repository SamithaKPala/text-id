"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmexService = void 0;
var AmexService = /** @class */ (function () {
    function AmexService() {
    }
    AmexService.prototype.checkIsAmex = function (combinedDigitsOther) {
        var amexPattern = /^3[47][0-9]{13}$/;
        var amFormat = combinedDigitsOther.slice(0, 15);
        return amexPattern.test(amFormat);
    };
    return AmexService;
}());
exports.AmexService = AmexService;
