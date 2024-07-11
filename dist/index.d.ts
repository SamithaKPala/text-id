export declare class textId {
    identifyExpireDate(textList: string[]): string | null;
    private getExpireDate;
    identifyCreditCardNumber(textList: string[], isIos: boolean): string | null;
    private cleanDataForCardNumber;
    private getCardType;
}
