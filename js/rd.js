class RDCalculator {

    constructor(monthlyDeposit, annualRate, years) {
        this.monthlyDeposit = monthlyDeposit;
        this.annualRate = annualRate;
        this.years = years;
    }

    monthlyRate() {
        return this.annualRate / 12 / 100;
    }

    totalMonths() {
        return Math.round(this.years * 12);
    }

    investedAmount() {
        return this.monthlyDeposit * this.totalMonths();
    }

    maturityAmount() {
        const P = this.monthlyDeposit;
        const r = this.monthlyRate();
        const n = this.totalMonths();

        if (r === 0) {
            return this.investedAmount();
        }

        return P * (((Math.pow(1 + r, n)) - 1) / r) * (1 + r);
    }

    interestEarned() {
        return this.maturityAmount() - this.investedAmount();
    }

}

window.RDCalculator = RDCalculator;
