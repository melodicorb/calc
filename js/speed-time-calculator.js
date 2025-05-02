/**
 * Speed & Time Calculator - CalcHub
 * This script handles calculations between speed, distance, and time with various units.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const calculationType = document.getElementById('calculation-type');
    const distanceValue = document.getElementById('distance-value');
    const distanceUnit = document.getElementById('distance-unit');
    const speedValue = document.getElementById('speed-value');
    const speedUnit = document.getElementById('speed-unit');
    const timeValue = document.getElementById('time-value');
    const timeUnit = document.getElementById('time-unit');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('result');
    const commonConversionsDiv = document.getElementById('common-conversions');

    // Distance conversion factors to meters (base unit)
    const distanceFactors = {
        'kilometers': 1000,
        'meters': 1,
        'miles': 1609.34,
        'feet': 0.3048
    };

    // Speed conversion factors to m/s (base unit)
    const speedFactors = {
        'kmh': 0.277778, // km/h to m/s
        'ms': 1,         // m/s
        'mph': 0.44704,  // miles/h to m/s
        'fps': 0.3048    // feet/s to m/s
    };

    // Time conversion factors to seconds (base unit)
    const timeFactors = {
        'hours': 3600,
        'minutes': 60,
        'seconds': 1
    };

    // Unit display names
    const unitNames = {
        // Distance units
        'kilometers': 'Kilometers (km)',
        'meters': 'Meters (m)',
        'miles': 'Miles (mi)',
        'feet': 'Feet (ft)',
        // Speed units
        'kmh': 'Kilometers per hour (km/h)',
        'ms': 'Meters per second (m/s)',
        'mph': 'Miles per hour (mph)',
        'fps': 'Feet per second (ft/s)',
        // Time units
        'hours': 'Hours (h)',
        'minutes': 'Minutes (min)',
        'seconds': 'Seconds (s)'
    };

    // Update input fields based on calculation type
    calculationType.addEventListener('change', updateInputFields);

    // Calculate button click event
    calculateBtn.addEventListener('click', performCalculation);

    // Reset button click event
    resetBtn.addEventListener('click', function() {
        distanceValue.value = '';
        speedValue.value = '';
        timeValue.value = '';
        calculationType.value = 'speed';
        
        // Reset result display
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-tachometer-alt text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-300 text-center">Enter values and click Calculate</p>
            </div>
        `;
        
        // Update input fields visibility
        updateInputFields();
        
        // Reset focus to first visible input
        if (calculationType.value === 'speed') {
            distanceValue.focus();
        } else if (calculationType.value === 'distance') {
            speedValue.focus();
        } else {
            distanceValue.focus();
        }
    });

    // Initialize input fields visibility
    updateInputFields();

    // Function to update input fields based on calculation type
    function updateInputFields() {
        const type = calculationType.value;
        
        // Show/hide input groups based on calculation type
        document.getElementById('distance-input-group').style.display = type === 'time' || type === 'speed' ? 'block' : 'none';
        document.getElementById('speed-input-group').style.display = type === 'time' || type === 'distance' ? 'block' : 'none';
        document.getElementById('time-input-group').style.display = type === 'speed' || type === 'distance' ? 'block' : 'none';
    }

    // Main calculation function
    function performCalculation() {
        const type = calculationType.value;
        let result, formula, unit;

        // Validate inputs based on calculation type
        if (type === 'speed') {
            if (!distanceValue.value || !timeValue.value) {
                showError('Please enter both distance and time values');
                return;
            }
            
            // Get values and convert to base units
            const distance = parseFloat(distanceValue.value) * distanceFactors[distanceUnit.value];
            const time = parseFloat(timeValue.value) * timeFactors[timeUnit.value];
            
            // Validate values
            if (isNaN(distance) || isNaN(time)) {
                showError('Please enter valid numbers');
                return;
            }
            
            if (time <= 0) {
                showError('Time must be greater than zero');
                return;
            }
            
            // Calculate speed in m/s
            const speedInMS = distance / time;
            
            // Convert to selected unit
            result = speedInMS / speedFactors[speedUnit.value];
            formula = `Speed = Distance ÷ Time = ${distanceValue.value} ${unitNames[distanceUnit.value]} ÷ ${timeValue.value} ${unitNames[timeUnit.value]}`;
            unit = unitNames[speedUnit.value];
            
            // Update common conversions
            updateSpeedConversions(result, speedUnit.value);
            
        } else if (type === 'distance') {
            if (!speedValue.value || !timeValue.value) {
                showError('Please enter both speed and time values');
                return;
            }
            
            // Get values and convert to base units
            const speed = parseFloat(speedValue.value) * speedFactors[speedUnit.value];
            const time = parseFloat(timeValue.value) * timeFactors[timeUnit.value];
            
            // Validate values
            if (isNaN(speed) || isNaN(time)) {
                showError('Please enter valid numbers');
                return;
            }
            
            if (speed < 0 || time < 0) {
                showError('Speed and time must be non-negative');
                return;
            }
            
            // Calculate distance in meters
            const distanceInMeters = speed * time;
            
            // Convert to selected unit
            result = distanceInMeters / distanceFactors[distanceUnit.value];
            formula = `Distance = Speed × Time = ${speedValue.value} ${unitNames[speedUnit.value]} × ${timeValue.value} ${unitNames[timeUnit.value]}`;
            unit = unitNames[distanceUnit.value];
            
            // Update common conversions
            updateDistanceConversions(result, distanceUnit.value);
            
        } else if (type === 'time') {
            if (!distanceValue.value || !speedValue.value) {
                showError('Please enter both distance and speed values');
                return;
            }
            
            // Get values and convert to base units
            const distance = parseFloat(distanceValue.value) * distanceFactors[distanceUnit.value];
            const speed = parseFloat(speedValue.value) * speedFactors[speedUnit.value];
            
            // Validate values
            if (isNaN(distance) || isNaN(speed)) {
                showError('Please enter valid numbers');
                return;
            }
            
            if (speed <= 0) {
                showError('Speed must be greater than zero');
                return;
            }
            
            // Calculate time in seconds
            const timeInSeconds = distance / speed;
            
            // Convert to selected unit
            result = timeInSeconds / timeFactors[timeUnit.value];
            formula = `Time = Distance ÷ Speed = ${distanceValue.value} ${unitNames[distanceUnit.value]} ÷ ${speedValue.value} ${unitNames[speedUnit.value]}`;
            unit = unitNames[timeUnit.value];
            
            // Update common conversions
            updateTimeConversions(result, timeUnit.value);
        }

        // Format the result based on the magnitude
        let formattedResult;
        if (result < 0.000001 || result > 1000000) {
            formattedResult = result.toExponential(6);
        } else {
            // Use more decimal places for very small results
            const decimalPlaces = result < 0.1 ? 6 : result < 1 ? 4 : 2;
            formattedResult = result.toFixed(decimalPlaces);
            // Remove trailing zeros
            formattedResult = parseFloat(formattedResult).toString();
        }

        // Display the result
        resultDiv.innerHTML = `
            <div class="text-center">
                <div class="text-3xl font-bold text-white mb-4">${formattedResult}</div>
                <div class="text-xl text-gray-200 mb-6">${unit}</div>
                <div class="bg-white bg-opacity-5 p-4 rounded-lg">
                    <p class="text-gray-200">${formula}</p>
                </div>
            </div>
        `;
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

    // Update common speed conversions
    function updateSpeedConversions(value, unit) {
        // Convert the input value to m/s first
        const valueInMS = value * speedFactors[unit];
        
        let html = '';
        // Convert to other speed units
        Object.keys(speedFactors).forEach(toUnit => {
            if (toUnit !== unit) {
                const convertedValue = valueInMS / speedFactors[toUnit];
                
                // Format the result
                let formattedResult;
                if (convertedValue < 0.000001 || convertedValue > 1000000) {
                    formattedResult = convertedValue.toExponential(4);
                } else {
                    const decimalPlaces = convertedValue < 0.1 ? 4 : 2;
                    formattedResult = convertedValue.toFixed(decimalPlaces);
                    // Remove trailing zeros
                    formattedResult = parseFloat(formattedResult).toString();
                }
                
                html += `<p>${value} ${unitNames[unit]} = ${formattedResult} ${unitNames[toUnit]}</p>`;
            }
        });
        
        // Add some common time-to-distance conversions
        const speedInKmh = valueInMS / speedFactors['kmh'];
        html += `<p>At ${speedInKmh.toFixed(2)} km/h, you'll travel 1 km in ${(60/speedInKmh).toFixed(2)} minutes</p>`;
        
        commonConversionsDiv.innerHTML = html;
    }

    // Update common distance conversions
    function updateDistanceConversions(value, unit) {
        // Convert the input value to meters first
        const valueInMeters = value * distanceFactors[unit];
        
        let html = '';
        // Convert to other distance units
        Object.keys(distanceFactors).forEach(toUnit => {
            if (toUnit !== unit) {
                const convertedValue = valueInMeters / distanceFactors[toUnit];
                
                // Format the result
                let formattedResult;
                if (convertedValue < 0.000001 || convertedValue > 1000000) {
                    formattedResult = convertedValue.toExponential(4);
                } else {
                    const decimalPlaces = convertedValue < 0.1 ? 4 : 2;
                    formattedResult = convertedValue.toFixed(decimalPlaces);
                    // Remove trailing zeros
                    formattedResult = parseFloat(formattedResult).toString();
                }
                
                html += `<p>${value} ${unitNames[unit]} = ${formattedResult} ${unitNames[toUnit]}</p>`;
            }
        });
        
        commonConversionsDiv.innerHTML = html;
    }

    // Update common time conversions
    function updateTimeConversions(value, unit) {
        // Convert the input value to seconds first
        const valueInSeconds = value * timeFactors[unit];
        
        let html = '';
        // Convert to other time units
        Object.keys(timeFactors).forEach(toUnit => {
            if (toUnit !== unit) {
                const convertedValue = valueInSeconds / timeFactors[toUnit];
                
                // Format the result
                let formattedResult;
                if (convertedValue < 0.000001 || convertedValue > 1000000) {
                    formattedResult = convertedValue.toExponential(4);
                } else {
                    const decimalPlaces = convertedValue < 0.1 ? 4 : 2;
                    formattedResult = convertedValue.toFixed(decimalPlaces);
                    // Remove trailing zeros
                    formattedResult = parseFloat(formattedResult).toString();
                }
                
                html += `<p>${value} ${unitNames[unit]} = ${formattedResult} ${unitNames[toUnit]}</p>`;
            }
        });
        
        commonConversionsDiv.innerHTML = html;
    }
});