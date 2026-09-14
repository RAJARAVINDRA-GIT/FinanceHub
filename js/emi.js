class EMICalculator {

    constructor(principal, annualRate, years) {

        this.principal = principal;

        this.annualRate = annualRate;

        this.years = years;

    }

    monthlyRate() {

        return this.annualRate / 12 / 100;

    }

    totalMonths() {

        return this.years * 12;

    }

    calculateEMI() {

        const P = this.principal;

        const R = this.monthlyRate();

        const N = this.totalMonths();

        if (R === 0) {

            return P / N;

        }

        return P * R * Math.pow(1 + R, N) /
            (Math.pow(1 + R, N) - 1);

    }

    totalPayment() {

        return this.calculateEMI() * this.totalMonths();

    }

    totalInterest() {

        return this.totalPayment() - this.principal;

    }

}
function calculateLoan(principal, rate, years) {

    return new EMICalculator(
        principal,
        rate,
        years
    );

}
window.calculateLoan = calculateLoan;