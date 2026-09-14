class PPFCalculator {

    constructor(yearlyContribution, annualRate, years) {
        this.yearlyContribution = yearlyContribution;
        this.annualRate = annualRate;
        this.years = years;
    }

    investedAmount() {
        return this.yearlyContribution * this.years;
    }

    maturityAmount() {
        const P = this.yearlyContribution;
        const r = this.annualRate / 100;
        const n = this.years;

        if (r === 0) {
            return this.investedAmount();
        }

        return P * (((Math.pow(1 + r, n)) - 1) / r) * (1 + r);
    }

    interestEarned() {
        return this.maturityAmount() - this.investedAmount();
    }

}

window.PPFCalculator = PPFCalculator;
