/**
 * Length Converter - CalcHub
 * This script handles length unit conversions between various metric and imperial units.
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

    // Conversion factors to meters (base unit)
    const conversionFactors = {
        'meter': 1,
        'kilometer': 1000,
        'centimeter': 0.01,
        'millimeter': 0.001,
        'micrometer': 0.000001,
        'nanometer': 0.000000001,
        'mile': 1609.344,
        'yard': 0.9144,
        'foot': 0.3048,
        'inch': 0.0254,
        'nautical-mile': 1852
    };

    // Unit display names
    const unitNames = {
        'meter': 'Meters (m)',
        'kilometer': 'Kilometers (km)',
        'centimeter': 'Centimeters (cm)',
        'millimeter': 'Millimeters (mm)',
        'micrometer': 'Micrometers (μm)',
        'nanometer': 'Nanometers (nm)',
        'mile': 'Miles (mi)',
        'yard': 'Yards (yd)',
        'foot': 'Feet (ft)',
        'inch': 'Inches (in)',
        'nautical-mile': 'Nautical Miles (nmi)'
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
        fromUnit.value = 'meter';
        toUnit.value = 'meter';
        
        // Reset result display
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-ruler text-4xl text-gray-400 mb-4"></i>
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

        // Convert to base unit (meters) then to target unit
        const valueInMeters = value * conversionFactors[from];
        const convertedValue = valueInMeters / conversionFactors[to];

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
        // Convert the input value to meters first
        const valueInMeters = value * conversionFactors[unit];
        
        // Create an array of units to show (excluding the source unit)
        const unitsToShow = Object.keys(conversionFactors).filter(u => u !== unit).slice(0, 5);
        
        let html = '';
        unitsToShow.forEach(toUnit => {
            const convertedValue = valueInMeters / conversionFactors[toUnit];
            
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