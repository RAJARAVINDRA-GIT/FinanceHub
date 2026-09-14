class CompoundInterestCalculator {

    constructor(principal, annualRate, years, frequency) {
        this.principal = principal;
        this.annualRate = annualRate;
        this.years = years;
        this.frequency = frequency;
    }

    maturityAmount() {
        const P = this.principal;
        const R = this.annualRate / 100;
        const N = this.frequency;
        const T = this.years;

        return P * Math.pow(1 + (R / N), N * T);
    }

    interestEarned() {
        return this.maturityAmount() - this.principal;
    }

}

window.CompoundInterestCalculator = CompoundInterestCalculator;
