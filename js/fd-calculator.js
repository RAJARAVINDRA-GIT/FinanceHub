let latestFDData = null;

function generateFDSchedule(principal, rate, years, frequency) {
    const scheduleBody = document.getElementById("scheduleBody");
    if (!scheduleBody) return;

    let rows = "";
    let opening = principal;

    for (let year = 1; year <= years; year++) {
        const closing = principal * Math.pow(1 + (rate / 100) / frequency, frequency * year);
        const interestForYear = closing - opening;

        rows += `
            <tr>
                <td>${year}</td>
                <td>₹${opening.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                <td>₹${interestForYear.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                <td>₹${closing.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
            </tr>
        `;

        opening = closing;
    }

    scheduleBody.innerHTML = rows;
}

function calculateFD() {

    const principal = Number(document.getElementById("loanAmount").value);
    const rate = Number(document.getElementById("interestRate").value);
    const years = Number(document.getElementById("loanTenure").value);
    const frequency = Number(document.getElementById("compoundFrequency").value);

    const error = document.getElementById("errorMessage");
    error.textContent = "";

    if (principal <= 0) {
        error.textContent = "Please enter a valid deposit amount.";
        return;
    }

    if (rate <= 0) {
        error.textContent = "Please enter a valid annual interest rate.";
        return;
    }

    if (years <= 0) {
        error.textContent = "Please enter a valid investment period.";
        return;
    }

    const fd = new FDCalculator(principal, rate, years, frequency);

    const interest = fd.interestEarned();
    const maturity = fd.maturityAmount();

    latestFDData = {
        amount: principal,
        rate: rate,
        years: years,
        emi: principal,
        interest: interest,
        total: maturity
    };

    document.getElementById("emiResult").innerText =
        "₹" + principal.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    document.getElementById("interestResult").innerText =
        "₹" + interest.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    document.getElementById("paymentResult").innerText =
        "₹" + maturity.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    generateFDSchedule(principal, rate, years, frequency);
    updateChart(principal, interest);
}

const calculateBtn = document.getElementById("calculateBtn");

if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateFD);
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
        if (scheduleBody) {
            scheduleBody.innerHTML = "";
        }

        latestFDData = null;

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

        if (!latestFDData) {
            alert("Please calculate the FD maturity first.");
            return;
        }

        generatePDF(latestFDData);

    });

}
