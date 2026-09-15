/* =========================
   TEMPERATURE CONVERTER
========================= */

// Get HTML elements

const temperatureInput =
    document.getElementById("temperature");

const unitSelect =
    document.getElementById("unit");

const convertButton =
    document.getElementById("convertBtn");

const errorMessage =
    document.getElementById("errorMessage");

const results =
    document.getElementById("results");

const celsiusResult =
    document.getElementById("celsiusResult");

const fahrenheitResult =
    document.getElementById("fahrenheitResult");

const kelvinResult =
    document.getElementById("kelvinResult");


// =========================
// CONVERT BUTTON
// =========================

convertButton.addEventListener("click", function () {

    const inputValue = temperatureInput.value.trim();

    const selectedUnit = unitSelect.value;


    // Clear previous error

    errorMessage.style.display = "none";

    errorMessage.textContent = "";


    // =========================
    // VALIDATE EMPTY INPUT
    // =========================

    if (inputValue === "") {

        showError(
            "Please enter a temperature value."
        );

        return;
    }


    // =========================
    // VALIDATE NUMERIC INPUT
    // =========================

    const temperature = Number(inputValue);

    if (!Number.isFinite(temperature)) {

        showError(
            "Please enter a valid numeric temperature."
        );

        return;
    }


    // =========================
    // CONVERT TO CELSIUS
    // =========================

    let celsius;


    if (selectedUnit === "celsius") {

        celsius = temperature;

    }

    else if (selectedUnit === "fahrenheit") {

        celsius = (temperature - 32) * 5 / 9;

    }

    else if (selectedUnit === "kelvin") {

        celsius = temperature - 273.15;

    }


    // =========================
    // ABSOLUTE ZERO CHECK
    // =========================

    if (celsius < -273.15) {

        showError(
            "Invalid temperature. Temperature cannot be below absolute zero (-273.15°C)."
        );

        results.classList.add("hidden");

        return;
    }


    // =========================
    // CONVERSION CALCULATIONS
    // =========================

    const fahrenheit =
        (celsius * 9 / 5) + 32;

    const kelvin =
        celsius + 273.15;


    // =========================
    // DISPLAY RESULTS
    // =========================

    celsiusResult.textContent =
        formatNumber(celsius) + " °C";

    fahrenheitResult.textContent =
        formatNumber(fahrenheit) + " °F";

    kelvinResult.textContent =
        formatNumber(kelvin) + " K";


    // Show results

    results.classList.remove("hidden");

});


// =========================
// ERROR FUNCTION
// =========================

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.style.display = "block";

    results.classList.add("hidden");
}


// =========================
// NUMBER FORMATTING
// =========================

function formatNumber(value) {

    return Number(value.toFixed(2));
}


// =========================
// ENTER KEY SUPPORT
// =========================

temperatureInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            convertButton.click();

        }

    }
);