let latestCIData = null;

function generateCISchedule(principal, rate, years, frequency) {
    const scheduleBody = document.getElementById("scheduleBody");
    if (!scheduleBody) return;

    let rows = "";
    let opening = principal;

    for (let year = 1; year <= years; year++) {
        const ci = new CompoundInterestCalculator(principal, rate, year, frequency);
        const closing = ci.maturityAmount();
        const gains = closing - opening;

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

function calculateCI() {

    const principal = Number(document.getElementById("loanAmount").value);
    const rate = Number(document.getElementById("interestRate").value);
    const years = Number(document.getElementById("loanTenure").value);
    const frequency = Number(document.getElementById("compoundFrequency").value);

    const error = document.getElementById("errorMessage");
    error.textContent = "";

    if (principal <= 0) {
        error.textContent = "Please enter a valid principal amount.";
        return;
    }

    if (rate <= 0) {
        error.textContent = "Please enter a valid annual interest rate.";
        return;
    }

    if (years <= 0) {
        error.textContent = "Please enter a valid time period.";
        return;
    }

    const ci = new CompoundInterestCalculator(principal, rate, years, frequency);

    const interest = ci.interestEarned();
    const total = ci.maturityAmount();

    latestCIData = {
        amount: principal,
        rate: rate,
        years: years,
        emi: principal,
        interest: interest,
        total: total
    };

    document.getElementById("emiResult").innerText =
        "₹" + principal.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    document.getElementById("interestResult").innerText =
        "₹" + interest.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    document.getElementById("paymentResult").innerText =
        "₹" + total.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    generateCISchedule(principal, rate, years, frequency);
    updateChart(principal, interest);
}

const calculateBtn = document.getElementById("calculateBtn");
if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateCI);
}

const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
    resetBtn.addEventListener("click", function () {
        document.getElementById("loanAmount").value = "";
        document.getElementById("interestRate").value = "";
        document.getElementById("loanTenure").value = "";
        document.getElementById("compoundFrequency").selectedIndex = 0;
        document.getElementById("emiResult").innerText = "₹0";
        document.getElementById("interestResult").innerText = "₹0";
        document.getElementById("paymentResult").innerText = "₹0";
        document.getElementById("errorMessage").textContent = "";
        const scheduleBody = document.getElementById("scheduleBody");
        if (scheduleBody) scheduleBody.innerHTML = "";
        latestCIData = null;
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
        if (!latestCIData) {
            alert("Please calculate the compound interest first.");
            return;
        }
        generatePDF(latestCIData);
    });
}
