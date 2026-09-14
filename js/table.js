function generateSchedule(principal, annualRate, years, emi) {

    const scheduleBody = document.getElementById("scheduleBody");

    if (!scheduleBody) return;

    scheduleBody.innerHTML = "";

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    let balance = principal;
let rows = "";

for (let month = 1; month <= months; month++) {

    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;

    balance -= principalPaid;

    if (balance < 0) balance = 0;

    rows += `
        <tr>
            <td>${month}</td>
            <td>₹${emi.toLocaleString("en-IN",{maximumFractionDigits:2})}</td>
            <td>₹${principalPaid.toLocaleString("en-IN",{maximumFractionDigits:2})}</td>
            <td>₹${interest.toLocaleString("en-IN",{maximumFractionDigits:2})}</td>
            <td>₹${balance.toLocaleString("en-IN",{maximumFractionDigits:2})}</td>
        </tr>
    `;
}

scheduleBody.innerHTML = rows;
}

window.generateSchedule = generateSchedule;