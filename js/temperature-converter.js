/**
 * Temperature Converter - CalcHub
 * This script handles temperature unit conversions between Celsius, Fahrenheit, and Kelvin.
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

    // Unit display names
    const unitNames = {
        'celsius': 'Celsius (°C)',
        'fahrenheit': 'Fahrenheit (°F)',
        'kelvin': 'Kelvin (K)'
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
        fromUnit.value = 'celsius';
        toUnit.value = 'celsius';
        
        // Reset result display
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-thermometer-half text-4xl text-white mb-4"></i>
                <p class="text-white text-center font-medium">Enter a value and select units to convert</p>
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

        // Convert to the target unit
        let convertedValue;

        // First convert from source to target unit
        if (from === to) {
            convertedValue = value;
        } else if (from === 'celsius' && to === 'fahrenheit') {
            convertedValue = (value * 9/5) + 32;
        } else if (from === 'celsius' && to === 'kelvin') {
            convertedValue = value + 273.15;
        } else if (from === 'fahrenheit' && to === 'celsius') {
            convertedValue = (value - 32) * 5/9;
        } else if (from === 'fahrenheit' && to === 'kelvin') {
            convertedValue = (value - 32) * 5/9 + 273.15;
        } else if (from === 'kelvin' && to === 'celsius') {
            convertedValue = value - 273.15;
        } else if (from === 'kelvin' && to === 'fahrenheit') {
            convertedValue = (value - 273.15) * 9/5 + 32;
        }

        // Format the result based on the magnitude
        let formattedResult;
        // Use more decimal places for very small results
        const decimalPlaces = Math.abs(convertedValue) < 0.1 ? 4 : 2;
        formattedResult = convertedValue.toFixed(decimalPlaces);
        // Remove trailing zeros
        formattedResult = parseFloat(formattedResult).toString();

        // Display the result
        resultDiv.innerHTML = `
            <div class="text-center">
                <div class="text-3xl font-bold text-white mb-4">${formattedResult}</div>
                <div class="text-xl text-white mb-6">${unitNames[to]}</div>
                <div class="bg-white bg-opacity-15 p-4 rounded-lg border border-white border-opacity-20 shadow-md">
                    <p class="text-white font-medium">${value} ${unitNames[from]} = ${formattedResult} ${unitNames[to]}</p>
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
                <div class="text-red-500 mb-4"><i class="fas fa-exclamation-triangle text-2xl"></i></div>
                <p class="text-red-500 font-medium">${message}</p>
            </div>
        `;
    }

    // Update common conversions section
    function updateCommonConversions(value, unit) {
        // Create an array of units to show (excluding the source unit)
        const unitsToShow = Object.keys(unitNames).filter(u => u !== unit);
        
        let html = '';
        unitsToShow.forEach(toUnit => {
            let convertedValue;

            // Convert from source unit to target unit
            if (unit === 'celsius' && toUnit === 'fahrenheit') {
                convertedValue = (value * 9/5) + 32;
            } else if (unit === 'celsius' && toUnit === 'kelvin') {
                convertedValue = value + 273.15;
            } else if (unit === 'fahrenheit' && toUnit === 'celsius') {
                convertedValue = (value - 32) * 5/9;
            } else if (unit === 'fahrenheit' && toUnit === 'kelvin') {
                convertedValue = (value - 32) * 5/9 + 273.15;
            } else if (unit === 'kelvin' && toUnit === 'celsius') {
                convertedValue = value - 273.15;
            } else if (unit === 'kelvin' && toUnit === 'fahrenheit') {
                convertedValue = (value - 273.15) * 9/5 + 32;
            }
            
            // Format the result
            const decimalPlaces = Math.abs(convertedValue) < 0.1 ? 4 : 2;
            let formattedResult = convertedValue.toFixed(decimalPlaces);
            // Remove trailing zeros
            formattedResult = parseFloat(formattedResult).toString();
            
            html += `<p class="font-medium">${value} ${unitNames[unit]} = ${formattedResult} ${unitNames[toUnit]}</p>`;
        });
        
        commonConversionsDiv.innerHTML = html;
    }
});