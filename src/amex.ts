export class AmexService {
    checkIsAmex(combinedDigitsOther: string): boolean {
        console.log("Checking amex")
        const amexPattern = /^3[47][0-9]{13}$/;
        let amFormat = combinedDigitsOther.slice(0, 15);
        return amexPattern.test(amFormat);
    }
}



