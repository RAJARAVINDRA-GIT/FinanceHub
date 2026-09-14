/* =========================================================
   FinanceHub — PDF Report Generator
   Produces a branded, multi-page PDF with:
     - Header band with logo + report title
     - Diagonal "Finance-Calculators-Hub" watermark on every page
     - Input Summary table
     - Result Summary table
     - Full schedule table (amortization / growth), if present
     - Footer with page numbers + disclaimer
   ========================================================= */

(function () {

    const BRAND_PRIMARY = [37, 99, 235];   // blue
    const BRAND_SECONDARY = [6, 182, 212]; // cyan
    const BRAND_DARK = [30, 41, 59];       // slate
    const ROW_STRIPE = [244, 247, 251];
    const TEXT_MUTED = [100, 116, 139];
    const BORDER_LIGHT = [226, 232, 240];

    function formatCurrency(value) {
        return "Rs. " + Number(value || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });
    }

    function cleanLabel(text, fallback) {
        if (!text) return fallback;
        return text.replace(/^[^A-Za-z0-9]+/, "").trim() || fallback;
    }

    function textFrom(selector, fallback) {
        const el = document.querySelector(selector);
        return el ? cleanLabel(el.innerText, fallback) : fallback;
    }

    /* Draws the repeating diagonal watermark on the current page */
    function drawWatermark(doc) {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(40);
        doc.setTextColor(228, 232, 240);

        doc.text("Finance-Calculators-Hub", pageWidth / 2, pageHeight / 2, {
            align: "center",
            angle: 35
        });

        doc.setTextColor(0, 0, 0);
    }

    /* Draws a simple, well-styled table (header + striped rows) starting at
       startY. Handles pagination automatically, redrawing the header and the
       watermark on every new page it creates. Returns the finalY position. */
    function drawTable(doc, opts) {
        const {
            startY,
            head,
            rows,
            headFill,
            marginLeft = 14,
            marginRight = 14,
            rowHeight = 9,
            fontSize = 10,
            colWidthsRatio
        } = opts;

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const usableWidth = pageWidth - marginLeft - marginRight;
        const bottomLimit = pageHeight - 24;

        const ratios = colWidthsRatio || head.map(() => 1 / head.length);
        const colWidths = ratios.map(r => usableWidth * r);

        function drawHeaderRow(y) {
            doc.setFillColor(headFill[0], headFill[1], headFill[2]);
            doc.rect(marginLeft, y, usableWidth, rowHeight, "F");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(fontSize);
            doc.setTextColor(255, 255, 255);

            let x = marginLeft;
            head.forEach((label, i) => {
                doc.text(String(label), x + 3, y + rowHeight - 3);
                x += colWidths[i];
            });

            doc.setTextColor(0, 0, 0);
            return y + rowHeight;
        }

        let y = drawHeaderRow(startY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);

        rows.forEach((row, rowIndex) => {

            if (y + rowHeight > bottomLimit) {
                doc.addPage();
                drawWatermark(doc);
                y = drawHeaderRow(20);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(fontSize);
            }

            if (rowIndex % 2 === 0) {
                doc.setFillColor(ROW_STRIPE[0], ROW_STRIPE[1], ROW_STRIPE[2]);
                doc.rect(marginLeft, y, usableWidth, rowHeight, "F");
            }

            doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
            doc.setTextColor(30, 41, 59);

            let x = marginLeft;
            row.forEach((cell, i) => {
                doc.text(String(cell), x + 3, y + rowHeight - 3);
                x += colWidths[i];
            });

            y += rowHeight;
        });

        doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
        doc.rect(marginLeft, startY, usableWidth, y - startY);

        doc.setTextColor(0, 0, 0);

        return y;
    }

    function sanitizeCurrencyText(text) {
        // jsPDF's built-in fonts (Helvetica/Times/Courier) have no glyph for
        // the ₹ Unicode symbol, so it renders as a broken/missing character.
        // Swap it for a safe "Rs." prefix, same as the summary tables use.
        return String(text).replace(/₹/g, "Rs. ").replace(/\s+/g, " ").trim();
    }

    /* Pulls the visible amortization / growth table from the page (if any)
       and converts it into plain rows/headers for drawTable(). */
    function extractScheduleTable() {
        const table = document.querySelector(".schedule-section table");
        const body = document.getElementById("scheduleBody");

        if (!table || !body || body.children.length === 0) {
            return null;
        }

        const headCells = table.querySelectorAll("thead th");
        const head = Array.from(headCells).map(th => sanitizeCurrencyText(th.innerText));

        const rows = Array.from(body.querySelectorAll("tr")).map(tr =>
            Array.from(tr.querySelectorAll("td")).map(td => sanitizeCurrencyText(td.innerText))
        );

        return { head, rows };
    }

    function generatePDF(data) {

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const calculatorName = textFrom(".calculator-header h1", "FinanceHub Report");

        const amountLabel = textFrom('label[for="loanAmount"]', "Amount");
        const rateLabel = textFrom('label[for="interestRate"]', "Interest Rate");
        const tenureLabel = textFrom('label[for="loanTenure"]', "Tenure");

        const resultSpans = document.querySelectorAll(".result-box-content span");
        const box1Label = resultSpans[0] ? resultSpans[0].innerText.trim() : "Amount";
        const box2Label = resultSpans[1] ? resultSpans[1].innerText.trim() : "Interest";
        const box3Label = resultSpans[2] ? resultSpans[2].innerText.trim() : "Total";

        const frequencySelect = document.getElementById("compoundFrequency");
        const frequencyText = frequencySelect
            ? frequencySelect.options[frequencySelect.selectedIndex].text
            : null;

        /* ---------- Page 1: watermark + header band ---------- */
        drawWatermark(doc);

        doc.setFillColor(BRAND_PRIMARY[0], BRAND_PRIMARY[1], BRAND_PRIMARY[2]);
        doc.rect(0, 0, pageWidth, 30, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("FinanceHub", 14, 14);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(calculatorName + " — Report", 14, 23);

        const today = new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        doc.setFontSize(9);
        doc.text("Generated: " + today, pageWidth - 14, 23, { align: "right" });

        doc.setTextColor(0, 0, 0);

        /* ---------- Input summary table ---------- */
        const inputRows = [
            [amountLabel, formatCurrency(data.amount)],
            [rateLabel, data.rate + "%"],
            [tenureLabel, data.years + " Years"]
        ];

        if (frequencyText) {
            inputRows.push(["Compounding Frequency", frequencyText]);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
        doc.text("Input Summary", 14, 42);
        doc.setTextColor(0, 0, 0);

        let finalY = drawTable(doc, {
            startY: 46,
            head: ["Parameter", "Value"],
            rows: inputRows,
            headFill: BRAND_PRIMARY,
            colWidthsRatio: [0.55, 0.45]
        });

        /* ---------- Result summary table ---------- */
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
        doc.text("Result Summary", 14, finalY + 12);
        doc.setTextColor(0, 0, 0);

        finalY = drawTable(doc, {
            startY: finalY + 16,
            head: ["Result", "Value"],
            rows: [
                [box1Label, formatCurrency(data.emi)],
                [box2Label, formatCurrency(data.interest)],
                [box3Label, formatCurrency(data.total)]
            ],
            headFill: BRAND_SECONDARY,
            colWidthsRatio: [0.55, 0.45]
        });

        /* ---------- Full schedule table ---------- */
        const schedule = extractScheduleTable();

        if (schedule) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
            doc.text("Detailed Schedule", 14, finalY + 12);
            doc.setTextColor(0, 0, 0);

            finalY = drawTable(doc, {
                startY: finalY + 16,
                head: schedule.head,
                rows: schedule.rows,
                headFill: BRAND_DARK,
                fontSize: 9,
                rowHeight: 7
            });
        }

        /* ---------- Footer on every page ---------- */
        const pageCount = doc.internal.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
            doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);

            doc.text("FinanceHub — Free Loan & Investment Calculators", 14, pageHeight - 10);
            doc.text("Page " + i + " of " + pageCount, pageWidth - 14, pageHeight - 10, { align: "right" });

            doc.setFontSize(7.5);
            doc.text(
                "This is a computer-generated estimate for informational purposes only and does not constitute financial advice.",
                pageWidth / 2,
                pageHeight - 5,
                { align: "center" }
            );

            doc.setTextColor(0, 0, 0);
        }

        const fileName = calculatorName.replace(/[^a-z0-9]+/gi, "-") + "-Report.pdf";
        doc.save(fileName);
    }

    window.generatePDF = generatePDF;

})();
