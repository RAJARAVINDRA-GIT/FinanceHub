let latestSIPData = null;

function generateSIPSchedule(monthlyInvestment, annualReturn, years) {
    const scheduleBody = document.getElementById("scheduleBody");
    if (!scheduleBody) return;

    let rows = "";

    for (let year = 1; year <= years; year++) {
        const sip = new SIPCalculator(monthlyInvestment, annualReturn, year);
        const invested = sip.investedAmount();
        const value = sip.maturityAmount();
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

function calculateSIP() {

    const investment = Number(document.getElementById("loanAmount").value);
    const rate = Number(document.getElementById("interestRate").value);
    const years = Number(document.getElementById("loanTenure").value);

    const error = document.getElementById("errorMessage");
    error.textContent = "";

    if (investment <= 0) {
        error.textContent = "Please enter a valid monthly investment.";
        return;
    }

    if (rate <= 0) {
        error.textContent = "Please enter a valid annual return.";
        return;
    }

    if (years <= 0) {
        error.textContent = "Please enter a valid investment period.";
        return;
    }

    const sip = new SIPCalculator(investment, rate, years);

    const invested = sip.investedAmount();
    const returns = sip.estimatedReturns();
    const total = sip.maturityAmount();

    latestSIPData = {
        amount: invested,
        rate: rate,
        years: years,
        emi: invested,
        interest: returns,
        total: total
    };

    document.getElementById("emiResult").innerText =
        "₹" + invested.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    document.getElementById("interestResult").innerText =
        "₹" + returns.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    document.getElementById("paymentResult").innerText =
        "₹" + total.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    generateSIPSchedule(investment, rate, years);
    updateChart(invested, returns);

}

const calculateBtn = document.getElementById("calculateBtn");

if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateSIP);
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
        if (scheduleBody) {
            scheduleBody.innerHTML = "";
        }

        latestSIPData = null;

        resetChart();

    });

}

document.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        const button = document.getElementById("calculateBtn");
        if (button) {
            button.click();
        }
    }

});

const pdfBtn = document.getElementById("pdfBtn");

if (pdfBtn) {

    pdfBtn.addEventListener("click", function () {

        if (!latestSIPData) {
            alert("Please calculate SIP first.");
            return;
        }

        generatePDF(latestSIPData);

    });

}
