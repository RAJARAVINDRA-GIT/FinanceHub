class FDCalculator {

    constructor(principal, rate, years, frequency) {

        this.principal = principal;
        this.rate = rate;
        this.years = years;
        this.frequency = frequency;

    }

    maturityAmount() {

        const P = this.principal;
        const R = this.rate / 100;
        const N = this.frequency;
        const T = this.years;

        return P * Math.pow(1 + (R / N), N * T);

    }

    interestEarned() {

        return this.maturityAmount() - this.principal;

    }

}

window.FDCalculator = FDCalculator;