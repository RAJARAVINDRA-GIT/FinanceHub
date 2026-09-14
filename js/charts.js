let emiChart = null;

function updateChart(principal, interest) {

    const canvas = document.getElementById("emiChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (emiChart) {
        emiChart.destroy();
    }

    emiChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Principal", "Interest"],
            datasets: [{
                data: [principal, interest]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });

}
function resetChart() {

    if (emiChart) {
        emiChart.destroy();
        emiChart = null;
    }

}

window.resetChart = resetChart;
window.updateChart = updateChart;