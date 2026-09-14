let latestLumpsumData = null;

function generateLumpsumSchedule(principal, rate, years) {
    const scheduleBody = document.getElementById("scheduleBody");
    if (!scheduleBody) return;

    let rows = "";
    let opening = principal;

    for (let year = 1; year <= years; year++) {
        const lumpsum = new LumpsumCalculator(principal, rate, year);
        const closing = lumpsum.maturityAmount();
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

function calculateLumpsum() {

    const principal = Number(document.getElementById("loanAmount").value);
    const rate = Number(document.getElementById("interestRate").value);
    const years = Number(document.getElementById("loanTenure").value);

    const error = document.getElementById("errorMessage");
    error.textContent = "";

    if (principal <= 0) {
        error.textContent = "Please enter a valid investment amount.";
        return;
    }

    if (rate <= 0) {
        error.textContent = "Please enter a valid expected annual return.";
        return;
    }

    if (years <= 0) {
        error.textContent = "Please enter a valid investment period.";
        return;
    }

    const lumpsum = new LumpsumCalculator(principal, rate, years);

    const returns = lumpsum.estimatedReturns();
    const total = lumpsum.maturityAmount();

    latestLumpsumData = {
        amount: principal,
        rate: rate,
        years: years,
        emi: principal,
        interest: returns,
        total: total
    };

    document.getElementById("emiResult").innerText =
        "₹" + principal.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    document.getElementById("interestResult").innerText =
        "₹" + returns.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    document.getElementById("paymentResult").innerText =
        "₹" + total.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    generateLumpsumSchedule(principal, rate, years);
    updateChart(principal, returns);
}

const calculateBtn = document.getElementById("calculateBtn");
if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateLumpsum);
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
        latestLumpsumData = null;
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
        if (!latestLumpsumData) {
            alert("Please calculate the investment value first.");
            return;
        }
        generatePDF(latestLumpsumData);
    });
}
