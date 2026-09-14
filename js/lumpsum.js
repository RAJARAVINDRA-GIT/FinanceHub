class LumpsumCalculator {

    constructor(principal, annualReturn, years) {
        this.principal = principal;
        this.annualReturn = annualReturn;
        this.years = years;
    }

    maturityAmount() {
        return this.principal * Math.pow(1 + this.annualReturn / 100, this.years);
    }

    estimatedReturns() {
        return this.maturityAmount() - this.principal;
    }

}

window.LumpsumCalculator = LumpsumCalculator;
