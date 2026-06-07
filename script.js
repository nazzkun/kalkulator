const display = document.getElementById('display');
const historyPreview = document.getElementById('historyPreview');
const historyModal = document.getElementById('historyModal');
const historyList = document.getElementById('historyList');

let firstNumber = null;
let currentOperator = null;
let waitingSecond = false;
let histories = [];

/* =========================
   FORMAT NUMBER
========================= */

function formatNumber(num) {
    let s = String(num);
    let p = s.split(".");

    let intPart = Number(p[0]).toLocaleString("id-ID");

    return p.length > 1
        ? intPart + "," + p[1]
        : intPart;
}

function unformatNumber(text) {
    return text
        .replace(/\./g, "")
        .replace(",", ".");
}

/* =========================
   INPUT
========================= */

function append(value) {
    let current = unformatNumber(display.value);

    if (
        display.value === "0" ||
        waitingSecond
    ) {
        current = value;
        waitingSecond = false;
    } else {
        if (
            value === "." &&
            current.includes(".")
        ) {
            return;
        }

        current += value;
    }

    display.value = formatNumber(current);
}

function clearDisplay() {
    display.value = "0";

    firstNumber = null;
    currentOperator = null;
    waitingSecond = false;
}

function backspace() {
    let current = unformatNumber(display.value)
        .slice(0, -1);

    if (!current || current === "-") {
        current = "0";
    }

    display.value = formatNumber(current);
}

function setOperator(operator) {
    firstNumber = parseFloat(
        unformatNumber(display.value)
    );

    currentOperator = operator;
    waitingSecond = true;
}

/* =========================
   HISTORY
========================= */

function saveHistory(text) {
    histories.unshift(text);

    historyPreview.textContent = text;

    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = histories.length
        ? histories.map(item =>
            "<div style='padding:8px;border-bottom:1px solid #334155'>" +
            item +
            "</div>"
        ).join("")
        : "Belum ada riwayat";
}

/* =========================
   CALCULATE
========================= */

function calculate() {

    if (
        firstNumber === null ||
        !currentOperator
    ) {
        return;
    }

    let second = parseFloat(
        unformatNumber(display.value)
    );

    let result = 0;

    switch (currentOperator) {

        case "+":
            result = firstNumber + second;
            break;

        case "-":
            result = firstNumber - second;
            break;

        case "*":
            result = firstNumber * second;
            break;

        case "/":

            if (second === 0) {
                display.value = "Error";
                return;
            }

            result = firstNumber / second;
            break;

        case "^":
            result = Math.pow(
                firstNumber,
                second
            );
            break;
    }

    let finalVal = Number(
        result.toFixed(10)
    );

    saveHistory(
        formatNumber(firstNumber) +
        " " +
        currentOperator +
        " " +
        formatNumber(second) +
        " = " +
        formatNumber(finalVal)
    );

    display.value = formatNumber(finalVal);

    firstNumber = null;
    currentOperator = null;
}

/* =========================
   SPECIAL FUNCTIONS
========================= */

function sqrt() {
    let n = parseFloat(
        unformatNumber(display.value)
    );

    if (n < 0) {
        display.value = "Error";
        return;
    }

    let r = Number(
        Math.sqrt(n).toFixed(10)
    );

    saveHistory(
        "√" +
        formatNumber(n) +
        " = " +
        formatNumber(r)
    );

    display.value = formatNumber(r);
}

function square() {
    let n = parseFloat(
        unformatNumber(display.value)
    );

    let r = n * n;

    saveHistory(
        formatNumber(n) +
        "² = " +
        formatNumber(r)
    );

    display.value = formatNumber(r);
}

function percent() {
    let n = parseFloat(
        unformatNumber(display.value)
    );

    let r = n / 100;

    saveHistory(
        formatNumber(n) +
        "% = " +
        formatNumber(r)
    );

    display.value = formatNumber(r);
}

function toggleSign() {
    let n = parseFloat(
        unformatNumber(display.value)
    );

    display.value = formatNumber(-n);
}

function power() {
    firstNumber = parseFloat(
        unformatNumber(display.value)
    );

    currentOperator = "^";
    waitingSecond = true;
}

function toggleHistory() {
    historyModal.style.display =
        historyModal.style.display === "flex"
            ? "none"
            : "flex";
}

function clearHistory() {
    histories = [];

    historyPreview.textContent =
        "Tidak ada riwayat";

    renderHistory();
}

/* =========================
   EVENTS
========================= */

historyModal.addEventListener(
    "click",
    (event) => {
        if (event.target === historyModal) {
            toggleHistory();
        }
    }
);