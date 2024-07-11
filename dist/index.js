"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textId = void 0;
var amex_1 = require("./amex");
var textId = /** @class */ (function () {
    function textId() {
    }
    textId.prototype.identifyExpireDate = function (textList) {
        return this.getExpireDate(textList);
    };
    textId.prototype.getExpireDate = function (textArray) {
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth() + 1;
        var currentYear = currentDate.getFullYear() % 100;
        var expireDate = textArray.filter(function (item) { return isValidMonthYearFormat(item) && isFutureDate(item); });
        return expireDate && expireDate[0] ? expireDate[0] : null;
        function isValidMonthYearFormat(input) {
            var regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            return regex.test(input);
        }
        function isFutureDate(input) {
            var _a = input.split('/').map(Number), month = _a[0], year = _a[1];
            if (year > currentYear || (year === currentYear && month > currentMonth)) {
                return true;
            }
            return false;
        }
    };
    textId.prototype.identifyCreditCardNumber = function (textList, isIos) {
        var combinedDigits = this.cleanDataForCardNumber(textList, isIos);
        for (var length_1 = 13; length_1 <= 19; length_1++) {
            var potentialCardNumber = combinedDigits.slice(0, length_1);
            var validLength = this.getCardType(potentialCardNumber);
            if (validLength && potentialCardNumber.length === validLength) {
                return potentialCardNumber;
            }
        }
        if (combinedDigits.length >= 13 && combinedDigits.length <= 19) {
            return combinedDigits;
        }
        else {
            return null;
        }
    };
    textId.prototype.cleanDataForCardNumber = function (textList, isIos) {
        var _a, _b, _c, _d;
        var amexService = new amex_1.AmexService();
        var combinedDigits = '';
        var combinedDigitsOther = '';
        var letterOrSpecialCharPattern = /[a-zA-Z]|[^a-zA-Z0-9]/;
        var digitPattern = /\d+/g;
        for (var _i = 0, textList_1 = textList; _i < textList_1.length; _i++) {
            var text = textList_1[_i];
            var cleanText = isIos ? text.replace(/ /g, '') : text.replace(/[^\w]/g, '');
            if (!letterOrSpecialCharPattern.test(cleanText)) {
                if (cleanText.length > 0 && cleanText.length % 4 === 0) {
                    combinedDigits += (_b = (_a = cleanText.match(digitPattern)) === null || _a === void 0 ? void 0 : _a.join('')) !== null && _b !== void 0 ? _b : '';
                }
                combinedDigitsOther += (_d = (_c = cleanText.match(digitPattern)) === null || _c === void 0 ? void 0 : _c.join('')) !== null && _d !== void 0 ? _d : '';
            }
        }
        if (combinedDigits.length < 14 && amexService.checkIsAmex(combinedDigitsOther)) {
            combinedDigits = combinedDigitsOther;
        }
        return combinedDigits !== null && combinedDigits !== void 0 ? combinedDigits : "";
    };
    textId.prototype.getCardType = function (cardNumber) {
        var cardPatterns = [
            { type: 'Visa', pattern: /^4[0-9]{12}(?:[0-9]{3})?$/, length: 16 },
            { type: 'MasterCard', pattern: /^5[1-5][0-9]{14}$/, length: 16 },
            { type: 'Amex', pattern: /^3[47][0-9]{13}$/, length: 15 }
        ];
        for (var _i = 0, cardPatterns_1 = cardPatterns; _i < cardPatterns_1.length; _i++) {
            var cardPattern = cardPatterns_1[_i];
            if (cardPattern.pattern.test(cardNumber)) {
                return cardPattern.length;
            }
        }
        return 16;
    };
    return textId;
}());
exports.textId = textId;
