/**
 * Time Converter - CalcHub
 * This script handles time unit conversions between various units from nanoseconds to centuries.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputValue = document.getElementById('input-value');
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    const convertBtn = document.getElementById('convert-btn');
    const swapBtn = document.getElementById('swap-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('result');
    const commonConversionsDiv = document.getElementById('common-conversions');

    // Conversion factors to seconds (base unit)
    const conversionFactors = {
        'nanosecond': 1e-9,
        'microsecond': 1e-6,
        'millisecond': 0.001,
        'second': 1,
        'minute': 60,
        'hour': 3600,
        'day': 86400,
        'week': 604800,
        'month': 2629746, // Average month (30.44 days)
        'year': 31556952, // Average year (365.25 days)
        'decade': 315569520, // 10 years
        'century': 3155695200 // 100 years
    };

    // Unit display names
    const unitNames = {
        'nanosecond': 'Nanoseconds (ns)',
        'microsecond': 'Microseconds (μs)',
        'millisecond': 'Milliseconds (ms)',
        'second': 'Seconds (s)',
        'minute': 'Minutes (min)',
        'hour': 'Hours (h)',
        'day': 'Days (d)',
        'week': 'Weeks (wk)',
        'month': 'Months (avg)',
        'year': 'Years (yr)',
        'decade': 'Decades',
        'century': 'Centuries'
    };

    // Convert button click event
    convertBtn.addEventListener('click', performConversion);

    // Also convert when pressing Enter in the input field
    inputValue.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performConversion();
        }
    });

    // Swap button click event
    swapBtn.addEventListener('click', function() {
        const temp = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = temp;
        
        // If there's already a value, perform the conversion with swapped units
        if (inputValue.value) {
            performConversion();
        }
    });

    // Reset button click event
    resetBtn.addEventListener('click', function() {
        inputValue.value = '';
        fromUnit.value = 'second';
        toUnit.value = 'second';
        
        // Reset result display
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-clock text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-300 text-center">Enter a value and select units to convert</p>
            </div>
        `;
        
        // Reset focus to input
        inputValue.focus();
    });

    // Main conversion function
    function performConversion() {
        // Validate input
        if (!inputValue.value) {
            showError('Please enter a value to convert');
            return;
        }

        const value = parseFloat(inputValue.value);
        if (isNaN(value)) {
            showError('Please enter a valid number');
            return;
        }

        const from = fromUnit.value;
        const to = toUnit.value;

        // Convert to base unit (seconds) then to target unit
        const valueInSeconds = value * conversionFactors[from];
        const convertedValue = valueInSeconds / conversionFactors[to];

        // Format the result based on the magnitude
        let formattedResult;
        if (convertedValue < 0.000001 || convertedValue > 1000000) {
            formattedResult = convertedValue.toExponential(6);
        } else {
            // Use more decimal places for very small results
            const decimalPlaces = convertedValue < 0.1 ? 8 : convertedValue < 1 ? 6 : 4;
            formattedResult = convertedValue.toFixed(decimalPlaces);
            // Remove trailing zeros
            formattedResult = parseFloat(formattedResult).toString();
        }

        // Display the result
        resultDiv.innerHTML = `
            <div class="text-center">
                <div class="text-3xl font-bold text-white mb-4">${formattedResult}</div>
                <div class="text-xl text-gray-200 mb-6">${unitNames[to]}</div>
                <div class="bg-white bg-opacity-5 p-4 rounded-lg">
                    <p class="text-gray-200">${value} ${unitNames[from]} = ${formattedResult} ${unitNames[to]}</p>
                </div>
            </div>
        `;

        // Update common conversions based on the input value
        updateCommonConversions(value, from);
    }

    // Show error message
    function showError(message) {
        resultDiv.innerHTML = `
            <div class="text-center">
                <div class="text-red-400 mb-4"><i class="fas fa-exclamation-triangle text-2xl"></i></div>
                <p class="text-red-400">${message}</p>
            </div>
        `;
    }

    // Update common conversions section
    function updateCommonConversions(value, unit) {
        // Convert the input value to seconds first
        const valueInSeconds = value * conversionFactors[unit];
        
        // Create an array of units to show (excluding the source unit)
        const unitsToShow = Object.keys(conversionFactors).filter(u => u !== unit).slice(0, 5);
        
        let html = '';
        unitsToShow.forEach(toUnit => {
            const convertedValue = valueInSeconds / conversionFactors[toUnit];
            
            // Format the result
            let formattedResult;
            if (convertedValue < 0.000001 || convertedValue > 1000000) {
                formattedResult = convertedValue.toExponential(4);
            } else {
                const decimalPlaces = convertedValue < 0.1 ? 6 : convertedValue < 1 ? 4 : 2;
                formattedResult = convertedValue.toFixed(decimalPlaces);
                // Remove trailing zeros
                formattedResult = parseFloat(formattedResult).toString();
            }
            
            html += `<p>${value} ${unitNames[unit]} = ${formattedResult} ${unitNames[toUnit]}</p>`;
        });
        
        commonConversionsDiv.innerHTML = html;
    }
});