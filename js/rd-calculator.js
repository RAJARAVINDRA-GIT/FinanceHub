let latestRDData = null;

function generateRDSchedule(monthlyDeposit, rate, years) {
    const scheduleBody = document.getElementById("scheduleBody");
    if (!scheduleBody) return;

    let rows = "";
    const wholeYears = Math.ceil(years);

    for (let year = 1; year <= wholeYears; year++) {
        const y = Math.min(year, years);
        const rd = new RDCalculator(monthlyDeposit, rate, y);
        const invested = rd.investedAmount();
        const value = rd.maturityAmount();
        const gains = value - invested;

        rows += `
            <tr>
                <td>${year}</td>
                <td>₹${invested.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                <td>₹${gains.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                <td>₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
            </tr>
        `;
    }

    scheduleBody.innerHTML = rows;
}

function calculateRD() {

    const monthlyDeposit = Number(document.getElementById("loanAmount").value);
    const rate = Number(document.getElementById("interestRate").value);
    const years = Number(document.getElementById("loanTenure").value);

    const error = document.getElementById("errorMessage");
    error.textContent = "";

    if (monthlyDeposit <= 0) {
        error.textContent = "Please enter a valid monthly deposit amount.";
        return;
    }

    if (rate <= 0) {
        error.textContent = "Please enter a valid annual interest rate.";
        return;
    }

    if (years <= 0) {
        error.textContent = "Please enter a valid tenure.";
        return;
    }

    const rd = new RDCalculator(monthlyDeposit, rate, years);

    const invested = rd.investedAmount();
    const interest = rd.interestEarned();
    const maturity = rd.maturityAmount();

    latestRDData = {
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

    generateRDSchedule(monthlyDeposit, rate, years);
    updateChart(invested, interest);
}

const calculateBtn = document.getElementById("calculateBtn");
if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateRD);
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
        latestRDData = null;
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
        if (!latestRDData) {
            alert("Please calculate the RD maturity first.");
            return;
        }
        generatePDF(latestRDData);
    });
}
