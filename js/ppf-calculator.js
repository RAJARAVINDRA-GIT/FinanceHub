let latestPPFData = null;
const PPF_ANNUAL_LIMIT = 150000;

function generatePPFSchedule(yearlyContribution, rate, years) {
    const scheduleBody = document.getElementById("scheduleBody");
    if (!scheduleBody) return;

    let rows = "";
    let opening = 0;

    for (let year = 1; year <= years; year++) {
        const ppf = new PPFCalculator(yearlyContribution, rate, year);
        const closing = ppf.maturityAmount();
        const gains = closing - opening - yearlyContribution;

        rows += `
            <tr>
                <td>${year}</td>
                <td>₹${opening.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                <td>₹${gains.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                <td>₹${closing.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
            </tr>
        `;

        opening = closing;
    }

    scheduleBody.innerHTML = rows;
}

function calculatePPF() {

    const yearlyContribution = Number(document.getElementById("loanAmount").value);
    const rate = Number(document.getElementById("interestRate").value);
    const years = Number(document.getElementById("loanTenure").value);

    const error = document.getElementById("errorMessage");
    error.textContent = "";

    if (yearlyContribution <= 0) {
        error.textContent = "Please enter a valid yearly contribution.";
        return;
    }

    if (yearlyContribution > PPF_ANNUAL_LIMIT) {
        error.textContent = "PPF contribution cannot exceed ₹1,50,000 per year.";
        return;
    }

    if (rate <= 0) {
        error.textContent = "Please enter a valid annual interest rate.";
        return;
    }

    if (years < 15) {
        error.textContent = "PPF has a minimum tenure of 15 years.";
        return;
    }

    const ppf = new PPFCalculator(yearlyContribution, rate, years);

    const invested = ppf.investedAmount();
    const interest = ppf.interestEarned();
    const maturity = ppf.maturityAmount();

    latestPPFData = {
        amount: invested,
        rate: rate,
        years: years,
        emi: invested,
        interest: interest,
        total: maturity
    };

    document.getElementById("emiResult").innerText =
        "₹" + invested.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    document.getElementById("interestResult").innerText =
        "₹" + interest.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    document.getElementById("paymentResult").innerText =
        "₹" + maturity.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    generatePPFSchedule(yearlyContribution, rate, years);
    updateChart(invested, interest);
}

const calculateBtn = document.getElementById("calculateBtn");
if (calculateBtn) {
    calculateBtn.addEventListener("click", calculatePPF);
}

const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
    resetBtn.addEventListener("click", function () {
        document.getElementById("loanAmount").value = "";
        document.getElementById("interestRate").value = "";
        document.getElementById("loanTenure").value = "";
        document.getElementById("emiResult").innerText = "₹0";
        document.getElementById("interestResult").innerText = "₹0";
        document.getElementById("paymentResult").innerText = "₹0";
        document.getElementById("errorMessage").textContent = "";
        const scheduleBody = document.getElementById("scheduleBody");
        if (scheduleBody) scheduleBody.innerHTML = "";
        latestPPFData = null;
        resetChart();
    });
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const button = document.getElementById("calculateBtn");
        if (button) button.click();
    }
});

const pdfBtn = document.getElementById("pdfBtn");
if (pdfBtn) {
    pdfBtn.addEventListener("click", function () {
        if (!latestPPFData) {
            alert("Please calculate the PPF maturity first.");
            return;
        }
        generatePDF(latestPPFData);
    });
}
