
import { AmexService } from './amex';

export class textId {
  identifyExpireDate(textList: string[]): string | null {
    return this.getExpireDate(textList);
  }
  private getExpireDate(textArray: string[]): string | null {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;
    const expireDate = textArray.filter((item) => isValidMonthYearFormat(item) && isFutureDate(item));
    return expireDate && expireDate[0] ? expireDate[0] : null;

    function isValidMonthYearFormat(input: string): boolean {
      const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      return regex.test(input);
    }

    function isFutureDate(input: string): boolean {
      const [month, year] = input.split('/').map(Number);
      if (year > currentYear || (year === currentYear && month > currentMonth)) {
        return true;
      }
      return false;
    }
  }

  identifyCreditCardNumber(textList: string[], isIos: boolean): string | null {
    let combinedDigits = this.cleanDataForCardNumber(textList, isIos);
    for (let length = 13; length <= 19; length++) {
      let potentialCardNumber = combinedDigits.slice(0, length);
      let validLength = this.getCardType(potentialCardNumber);
      if (validLength && potentialCardNumber.length === validLength) {
        return potentialCardNumber;
      }
    }
    if (combinedDigits.length >= 13 && combinedDigits.length <= 19) {
      return combinedDigits;
    } else {
      return null;
    }
  }

  private cleanDataForCardNumber(textList: string[], isIos: boolean): string {
    const amexService = new AmexService();
    let combinedDigits = '';
    let combinedDigitsOther = '';
    const letterOrSpecialCharPattern = /[a-zA-Z]|[^a-zA-Z0-9]/;
    const digitPattern = /\d+/g;
    for (let text of textList) {
      let cleanText = isIos ? text.replace(/ /g, '') : text.replace(/[^\w]/g, '');
      if (!letterOrSpecialCharPattern.test(cleanText)) {
        if (cleanText.length > 0 && cleanText.length % 4 === 0) {
          combinedDigits += cleanText.match(digitPattern)?.join('') ?? '';
        }
        combinedDigitsOther += cleanText.match(digitPattern)?.join('') ?? '';
      }
    }
    if (combinedDigits.length < 14 && amexService.checkIsAmex(combinedDigitsOther)) {
      combinedDigits = combinedDigitsOther;
    }
    return combinedDigits ?? "";
  }

  private getCardType(cardNumber: string): number {
    const cardPatterns = [
      { type: 'Visa', pattern: /^4[0-9]{12}(?:[0-9]{3})?$/, length: 16 },
      { type: 'MasterCard', pattern: /^5[1-5][0-9]{14}$/, length: 16 },
      { type: 'Amex', pattern: /^3[47][0-9]{13}$/, length: 15 }
    ];
    for (const cardPattern of cardPatterns) {
      if (cardPattern.pattern.test(cardNumber)) {
        return cardPattern.length;
      }
    }
    return 16;
  }

}
