/* =========================
   CALCULATOR VARIABLES
========================= */

let currentInput = "0";

let previousInput = "";

let currentOperator = null;

let shouldResetDisplay = false;


/* =========================
   HTML ELEMENTS
========================= */

const display =
    document.getElementById("display");

const previousDisplay =
    document.getElementById("previousDisplay");

const errorMessage =
    document.getElementById("errorMessage");

const numberButtons =
    document.querySelectorAll("[data-number]");

const operatorButtons =
    document.querySelectorAll("[data-operator]");

const actionButtons =
    document.querySelectorAll("[data-action]");


/* =========================
   UPDATE DISPLAY
========================= */

function updateDisplay() {

    display.textContent = currentInput;

    if (previousInput !== "" && currentOperator !== null) {

        previousDisplay.textContent =
            `${previousInput} ${currentOperator}`;

    } else {

        previousDisplay.textContent = "";

    }
}


/* =========================
   ADD NUMBER
========================= */

function inputNumber(number) {

    hideError();

    if (currentInput === "0" || shouldResetDisplay) {

        currentInput = number;

        shouldResetDisplay = false;

    } else {

        currentInput += number;

    }

    updateDisplay();
}


/* =========================
   DECIMAL POINT
========================= */

function inputDecimal() {

    hideError();

    if (shouldResetDisplay) {

        currentInput = "0";

        shouldResetDisplay = false;

    }

    if (!currentInput.includes(".")) {

        currentInput += ".";

    }

    updateDisplay();
}


/* =========================
   CHOOSE OPERATOR
========================= */

function chooseOperator(operator) {

    hideError();

    const inputNumber =
        parseFloat(currentInput);


    if (isNaN(inputNumber)) {

        showError("Invalid number.");

        return;
    }


    /*
       If an operator already exists,
       calculate the previous operation first.
    */

    if (
        currentOperator !== null &&
        previousInput !== ""
    ) {

        const result =
            calculate(
                parseFloat(previousInput),
                inputNumber,
                currentOperator
            );


        if (result === null) {

            return;

        }


        currentInput =
            formatResult(result);

        previousInput =
            currentInput;

    } else {

        previousInput =
            currentInput;

    }


    currentOperator =
        operator;

    shouldResetDisplay = true;

    updateDisplay();
}


/* =========================
   CALCULATE
========================= */

function calculate(firstNumber, secondNumber, operator) {

    switch (operator) {

        case "+":

            return firstNumber + secondNumber;


        case "−":

            return firstNumber - secondNumber;


        case "×":

            return firstNumber * secondNumber;


        case "÷":

            if (secondNumber === 0) {

                showError(
                    "Cannot divide by zero."
                );

                return null;
            }

            return firstNumber / secondNumber;


        default:

            return secondNumber;
    }
}


/* =========================
   EQUALS
========================= */

function performCalculation() {

    hideError();

    if (
        currentOperator === null ||
        previousInput === ""
    ) {

        return;

    }


    const firstNumber =
        parseFloat(previousInput);

    const secondNumber =
        parseFloat(currentInput);


    if (
        isNaN(firstNumber) ||
        isNaN(secondNumber)
    ) {

        showError(
            "Invalid calculation."
        );

        return;

    }


    const result =
        calculate(
            firstNumber,
            secondNumber,
            currentOperator
        );


    if (result === null) {

        return;

    }


    previousDisplay.textContent =
        `${previousInput} ${currentOperator} ${currentInput} =`;


    currentInput =
        formatResult(result);

    previousInput = "";

    currentOperator = null;

    shouldResetDisplay = true;

    updateMainDisplay();
}


/* =========================
   FORMAT RESULT
========================= */

function formatResult(number) {

    if (!Number.isFinite(number)) {

        return "Error";

    }


    /*
       Avoid extremely long decimal results.
    */

    return parseFloat(
        number.toFixed(10)
    ).toString();
}


/* =========================
   CLEAR
========================= */

function clearCalculator() {

    currentInput = "0";

    previousInput = "";

    currentOperator = null;

    shouldResetDisplay = false;

    hideError();

    updateDisplay();
}


/* =========================
   BACKSPACE
========================= */

function backspace() {

    hideError();

    if (shouldResetDisplay) {

        return;

    }


    if (currentInput.length <= 1) {

        currentInput = "0";

    } else {

        currentInput =
            currentInput.slice(0, -1);

    }

    updateDisplay();
}


/* =========================
   ERROR
========================= */

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";
}


function hideError() {

    errorMessage.textContent = "";

    errorMessage.style.display =
        "none";
}


/* =========================
   DISPLAY UPDATE
========================= */

function updateMainDisplay() {

    display.textContent =
        currentInput;
}


/* =========================
   NUMBER BUTTON EVENTS
========================= */

numberButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            inputNumber(
                button.dataset.number
            );

        }
    );

});


/* =========================
   OPERATOR BUTTON EVENTS
========================= */

operatorButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            chooseOperator(
                button.dataset.operator
            );

        }
    );

});


/* =========================
   OTHER BUTTON EVENTS
========================= */

actionButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const action =
                button.dataset.action;


            if (action === "clear") {

                clearCalculator();

            }

            else if (action === "backspace") {

                backspace();

            }

            else if (action === "decimal") {

                inputDecimal();

            }

            else if (action === "equals") {

                performCalculation();

            }

        }
    );

});


/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key = event.key;


        // Numbers

        if (
            key >= "0" &&
            key <= "9"
        ) {

            inputNumber(key);

        }


        // Decimal

        else if (key === ".") {

            inputDecimal();

        }


        // Operators

        else if (key === "+") {

            chooseOperator("+");

        }

        else if (key === "-") {

            chooseOperator("−");

        }

        else if (key === "*") {

            chooseOperator("×");

        }

        else if (key === "/") {

            event.preventDefault();

            chooseOperator("÷");

        }


        // Equals

        else if (
            key === "Enter" ||
            key === "="
        ) {

            performCalculation();

        }


        // Backspace

        else if (key === "Backspace") {

            backspace();

        }


        // Clear

        else if (
            key === "Escape" ||
            key.toLowerCase() === "c"
        ) {

            clearCalculator();

        }

    }
);


/* =========================
   INITIAL DISPLAY
========================= */

updateDisplay();