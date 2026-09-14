class SIPCalculator {

    constructor(monthlyInvestment, annualReturn, years) {

        this.monthlyInvestment = monthlyInvestment;
        this.annualReturn = annualReturn;
        this.years = years;

    }

    monthlyRate() {

        return this.annualReturn / 12 / 100;

    }

    totalMonths() {

        return this.years * 12;

    }

    investedAmount() {

        return this.monthlyInvestment * this.totalMonths();

    }

    maturityAmount() {

        const P = this.monthlyInvestment;
        const r = this.monthlyRate();
        const n = this.totalMonths();

        if (r === 0) {
            return this.investedAmount();
        }

        return P * (((Math.pow(1 + r, n)) - 1) / r) * (1 + r);

    }

    estimatedReturns() {

        return this.maturityAmount() - this.investedAmount();

    }

}

window.SIPCalculator = SIPCalculator;