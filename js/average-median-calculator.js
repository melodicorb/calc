document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const numberInput = document.getElementById('number-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleDataBtn = document.getElementById('sample-data-btn');
    const resultsDiv = document.getElementById('results');
    const sortNumbersCheckbox = document.getElementById('sort-numbers');
    const roundResultsCheckbox = document.getElementById('round-results');
    const decimalPlacesSelect = document.getElementById('decimal-places');
    
    // Add event listeners
    calculateBtn.addEventListener('click', calculateStatistics);
    clearBtn.addEventListener('click', clearInputs);
    sampleDataBtn.addEventListener('click', useSampleData);
    
    // Function to parse input string into an array of numbers
    function parseInput(inputStr) {
        // Remove all whitespace and split by commas
        return inputStr.replace(/\s+/g, '').split(',').filter(val => val !== '').map(num => parseFloat(num));
    }
    
    // Function to validate input
    function validateInput(numbers) {
        if (numbers.length === 0) {
            showError('Please enter at least one number.');
            return false;
        }
        
        for (let num of numbers) {
            if (isNaN(num)) {
                showError('Please enter valid numbers separated by commas.');
                return false;
            }
        }
        
        return true;
    }
    
    // Function to calculate statistics
    function calculateStatistics() {
        const inputStr = numberInput.value;
        const numbers = parseInput(inputStr);
        
        if (!validateInput(numbers)) {
            return;
        }
        
        // Sort numbers if checkbox is checked
        let sortedNumbers = [...numbers];
        if (sortNumbersCheckbox.checked) {
            sortedNumbers.sort((a, b) => a - b);
        }
        
        // Calculate statistics
        const mean = calculateMean(numbers);
        const median = calculateMedian(numbers);
        const mode = calculateMode(numbers);
        const range = calculateRange(numbers);
        const count = numbers.length;
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        
        // Format results based on rounding options
        const decimalPlaces = parseInt(decimalPlacesSelect.value);
        const shouldRound = roundResultsCheckbox.checked;
        
        // Display results
        displayResults({
            numbers: sortedNumbers,
            mean: shouldRound ? mean.toFixed(decimalPlaces) : mean,
            median: shouldRound ? median.toFixed(decimalPlaces) : median,
            mode: mode,
            range: shouldRound ? range.toFixed(decimalPlaces) : range,
            count: count,
            sum: shouldRound ? sum.toFixed(decimalPlaces) : sum
        });
    }
    
    // Function to calculate mean (average)
    function calculateMean(numbers) {
        if (numbers.length === 0) return 0;
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        return sum / numbers.length;
    }
    
    // Function to calculate median
    function calculateMedian(numbers) {
        if (numbers.length === 0) return 0;
        
        const sorted = [...numbers].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            // Even number of elements, average the two middle values
            return (sorted[middle - 1] + sorted[middle]) / 2;
        } else {
            // Odd number of elements, return the middle value
            return sorted[middle];
        }
    }
    
    // Function to calculate mode
    function calculateMode(numbers) {
        if (numbers.length === 0) return 'No mode';
        
        // Count frequency of each number
        const frequency = {};
        let maxFrequency = 0;
        
        for (let num of numbers) {
            frequency[num] = (frequency[num] || 0) + 1;
            if (frequency[num] > maxFrequency) {
                maxFrequency = frequency[num];
            }
        }
        
        // If all values appear only once, there is no mode
        if (maxFrequency === 1) {
            return 'No mode';
        }
        
        // Find all values that appear with the maximum frequency
        const modes = [];
        for (let num in frequency) {
            if (frequency[num] === maxFrequency) {
                modes.push(parseFloat(num));
            }
        }
        
        return modes;
    }
    
    // Function to calculate range
    function calculateRange(numbers) {
        if (numbers.length === 0) return 0;
        
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        
        return max - min;
    }
    
    // Function to display results
    function displayResults(results) {
        const { numbers, mean, median, mode, range, count, sum } = results;
        
        // Format the numbers for display
        let numbersText = '';
        if (numbers.length > 20) {
            // If there are too many numbers, show a truncated list
            numbersText = numbers.slice(0, 20).join(', ') + '... (and ' + (numbers.length - 20) + ' more)';
        } else {
            numbersText = numbers.join(', ');
        }
        
        // Format the mode for display
        let modeText = '';
        if (mode === 'No mode') {
            modeText = 'No mode (all values appear equally)';
        } else if (Array.isArray(mode)) {
            if (mode.length === 1) {
                modeText = mode[0];
            } else {
                modeText = mode.join(', ');
            }
        } else {
            modeText = mode;
        }
        
        resultsDiv.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h3 class="text-xl font-bold text-white mb-3">Data Summary</h3>
                    <div class="bg-white bg-opacity-5 p-4 rounded-lg">
                        <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                            <span class="text-gray-300">Count:</span>
                            <span class="text-white font-semibold">${count} numbers</span>
                        </div>
                        <div class="text-gray-300 text-sm">
                            <strong>Numbers:</strong> ${numbersText}
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                        <h3 class="text-lg font-bold text-white mb-2">Mean (Average)</h3>
                        <p class="text-2xl text-red-400 font-bold">${mean}</p>
                    </div>
                    
                    <div class="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                        <h3 class="text-lg font-bold text-white mb-2">Median</h3>
                        <p class="text-2xl text-red-400 font-bold">${median}</p>
                    </div>
                    
                    <div class="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                        <h3 class="text-lg font-bold text-white mb-2">Mode</h3>
                        <p class="text-2xl text-red-400 font-bold">${modeText}</p>
                    </div>
                    
                    <div class="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                        <h3 class="text-lg font-bold text-white mb-2">Range</h3>
                        <p class="text-2xl text-red-400 font-bold">${range}</p>
                    </div>
                </div>
                
                <div class="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                    <h3 class="text-lg font-bold text-white mb-2">Additional Information</h3>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Sum:</span>
                        <span class="text-white font-semibold">${sum}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Min:</span>
                        <span class="text-white font-semibold">${Math.min(...numbers)}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Max:</span>
                        <span class="text-white font-semibold">${Math.max(...numbers)}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Function to show error message
    function showError(message) {
        resultsDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <p class="text-red-300 text-center">${message}</p>
            </div>
        `;
    }
    
    // Function to clear inputs
    function clearInputs() {
        numberInput.value = '';
        resultsDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-calculator text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-300 text-center">Enter numbers and click Calculate to see the results</p>
            </div>
        `;
    }
    
    // Function to use sample data
    function useSampleData() {
        numberInput.value = '4, 10, 7, 15, 3, 10, 8, 12, 7, 19';
        calculateStatistics();
    }
});