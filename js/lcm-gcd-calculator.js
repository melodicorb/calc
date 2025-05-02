document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const numberInputsContainer = document.getElementById('number-inputs');
    const addNumberBtn = document.getElementById('add-number-btn');
    const removeNumberBtn = document.getElementById('remove-number-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleDataBtn = document.getElementById('sample-data-btn');
    const resultsDiv = document.getElementById('results');
    
    // Add event listeners
    addNumberBtn.addEventListener('click', addNumberInput);
    removeNumberBtn.addEventListener('click', removeNumberInput);
    calculateBtn.addEventListener('click', calculateResults);
    clearBtn.addEventListener('click', clearInputs);
    sampleDataBtn.addEventListener('click', useSampleData);
    
    // Initialize variables
    let inputCount = 2; // Start with 2 inputs
    const maxInputs = 10;
    
    // Function to add a new number input field
    function addNumberInput() {
        if (inputCount >= maxInputs) {
            alert(`Maximum of ${maxInputs} numbers allowed.`);
            return;
        }
        
        inputCount++;
        
        const inputGroup = document.createElement('div');
        inputGroup.className = 'number-input-group';
        inputGroup.innerHTML = `
            <label class="block text-white mb-2">Number ${inputCount}</label>
            <input type="number" class="number-input w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400" placeholder="Enter a positive integer" min="1" required>
        `;
        
        numberInputsContainer.appendChild(inputGroup);
        
        // Enable remove button if we have more than 2 inputs
        if (inputCount > 2) {
            removeNumberBtn.disabled = false;
        }
        
        // Disable add button if we reached max
        if (inputCount >= maxInputs) {
            addNumberBtn.disabled = true;
        }
    }
    
    // Function to remove the last number input field
    function removeNumberInput() {
        if (inputCount <= 2) {
            return; // Always keep at least 2 inputs
        }
        
        const inputGroups = document.querySelectorAll('.number-input-group');
        
        // Remove the last input group
        numberInputsContainer.removeChild(inputGroups[inputGroups.length - 1]);
        inputCount--;
        
        // Disable remove button if we have only 2 inputs left
        if (inputCount <= 2) {
            removeNumberBtn.disabled = true;
        }
        
        // Enable add button if we're below max
        if (inputCount < maxInputs) {
            addNumberBtn.disabled = false;
        }
    }
    
    // Function to calculate LCM and GCD
    function calculateResults() {
        const inputs = document.querySelectorAll('.number-input');
        const numbers = [];
        
        // Validate and collect inputs
        for (let input of inputs) {
            const value = parseInt(input.value);
            
            if (isNaN(value) || value <= 0) {
                showError('Please enter valid positive integers for all fields.');
                return;
            }
            
            numbers.push(value);
        }
        
        if (numbers.length < 2) {
            showError('Please enter at least two numbers.');
            return;
        }
        
        // Calculate LCM and GCD for all numbers
        let currentLcm = numbers[0];
        let currentGcd = numbers[0];
        
        for (let i = 1; i < numbers.length; i++) {
            currentLcm = lcm(currentLcm, numbers[i]);
            currentGcd = gcd(currentGcd, numbers[i]);
        }
        
        // Display results
        displayResults(numbers, currentLcm, currentGcd);
    }
    
    // Function to clear all inputs
    function clearInputs() {
        // Reset to 2 input fields
        while (inputCount > 2) {
            removeNumberInput();
        }
        
        // Clear the values of the remaining inputs
        const inputs = document.querySelectorAll('.number-input');
        for (let input of inputs) {
            input.value = '';
        }
        
        // Reset results
        resultsDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-calculator text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-300 text-center">Enter numbers and click Calculate to see the results</p>
            </div>
        `;
    }
    
    // Function to use sample data
    function useSampleData() {
        // Reset to 3 input fields
        while (inputCount > 3) {
            removeNumberInput();
        }
        while (inputCount < 3) {
            addNumberInput();
        }
        
        // Set sample values
        const inputs = document.querySelectorAll('.number-input');
        inputs[0].value = '12';
        inputs[1].value = '18';
        inputs[2].value = '24';
        
        // Calculate results
        calculateResults();
    }
    
    // Helper function to show error message
    function showError(message) {
        resultsDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <p class="text-red-300 text-center">${message}</p>
            </div>
        `;
    }
    
    // Helper function to display results
    function displayResults(numbers, lcmResult, gcdResult) {
        let numbersText = numbers.join(', ');
        
        resultsDiv.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h3 class="text-xl font-bold text-white mb-3">Input Numbers</h3>
                    <p class="text-gray-200">${numbersText}</p>
                </div>
                
                <div class="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                    <h3 class="text-xl font-bold text-white mb-3">Least Common Multiple (LCM)</h3>
                    <p class="text-2xl text-purple-300 font-bold">${lcmResult}</p>
                </div>
                
                <div class="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                    <h3 class="text-xl font-bold text-white mb-3">Greatest Common Divisor (GCD)</h3>
                    <p class="text-2xl text-purple-300 font-bold">${gcdResult}</p>
                </div>
                
                <div class="text-sm text-gray-400 mt-4">
                    <p>Calculation completed successfully.</p>
                </div>
            </div>
        `;
    }
    
    // Mathematical functions
    
    // Function to calculate GCD of two numbers using Euclidean algorithm
    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        
        // GCD(n, 0) = n
        if (b === 0) {
            return a;
        }
        
        return gcd(b, a % b);
    }
    
    // Function to calculate LCM of two numbers
    function lcm(a, b) {
        // LCM(a, b) = (a * b) / GCD(a, b)
        return Math.abs(a * b) / gcd(a, b);
    }
})