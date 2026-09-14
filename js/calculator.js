let latestLoanData = null;
// ===========================
// Home Loan EMI Calculator
// ===========================

function calculateEMI() {

    const amount = Number(document.getElementById("loanAmount").value);
    const rate = Number(document.getElementById("interestRate").value);
    const years = Number(document.getElementById("loanTenure").value);

const error = document.getElementById("errorMessage");

error.textContent = "";

if (amount <= 0) {
    error.textContent = "Please enter a valid loan amount.";
    return;
}

if (rate <= 0) {
    error.textContent = "Please enter a valid interest rate.";
    return;
}

if (years <= 0) {
    error.textContent = "Please enter a valid loan tenure.";
    return;
}

    const loan = calculateLoan(amount, rate, years);

    const emi = loan.calculateEMI();
    const total = loan.totalPayment();
    const interest = loan.totalInterest();
 latestLoanData = {

    amount: Number(amount),

    rate: Number(rate),

    years: Number(years),

    emi: Number(emi),

    interest: Number(interest),

    total: Number(total)

};

    document.getElementById("emiResult").innerText =
        "₹" + emi.toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });

    document.getElementById("interestResult").innerText =
        "₹" + interest.toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });

    document.getElementById("paymentResult").innerText =
        "₹" + total.toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });

         generateSchedule(amount, rate, years, emi);
        updateChart(amount, interest);
}

const calculateBtn = document.getElementById("calculateBtn");

if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateEMI);
}

/* ["loanAmount", "interestRate", "loanTenure"].forEach(id => {
    const input = document.getElementById(id);

    if (input) {
        input.addEventListener("input", calculateEMI);
    }
}); */
const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {

    resetBtn.addEventListener("click", function () {

        document.getElementById("loanAmount").value = "";
        document.getElementById("interestRate").value = "";
        document.getElementById("loanTenure").value = "";

        document.getElementById("emiResult").innerText = "₹0";
        document.getElementById("interestResult").innerText = "₹0";
        document.getElementById("paymentResult").innerText = "₹0";
        const scheduleBody = document.getElementById("scheduleBody");
if (scheduleBody) {
    scheduleBody.innerHTML = "";
}
resetChart();
if(error){
    error.textContent = "";
}
    });
    const error = document.getElementById("errorMessage");

}
document.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        const button = document.getElementById("calculateBtn");

        if(button){
            button.click();
        }

    }

});

// ===========================
// PDF Generation
// ===========================

const pdfBtn = document.getElementById("pdfBtn");


if(pdfBtn){

    pdfBtn.addEventListener("click", function(){

        if(!latestLoanData){

            alert("Please calculate EMI first.");

            return;

        }


        generatePDF(latestLoanData);

    });

}