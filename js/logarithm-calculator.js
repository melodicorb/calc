document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabCommon = document.getElementById('tab-common');
    const tabNatural = document.getElementById('tab-natural');
    const tabCustom = document.getElementById('tab-custom');
    
    const calcCommon = document.getElementById('calc-common');
    const calcNatural = document.getElementById('calc-natural');
    const calcCustom = document.getElementById('calc-custom');
    
    // Result display element
    const resultDisplay = document.getElementById('logarithm-result');
    
    // Tab click event listeners
    tabCommon.addEventListener('click', function() {
        setActiveTab(tabCommon, calcCommon);
    });
    
    tabNatural.addEventListener('click', function() {
        setActiveTab(tabNatural, calcNatural);
    });
    
    tabCustom.addEventListener('click', function() {
        setActiveTab(tabCustom, calcCustom);
    });
    
    // Function to set active tab
    function setActiveTab(activeTab, activeCalc) {
        // Remove active class from all tabs
        [tabCommon, tabNatural, tabCustom].forEach(tab => {
            tab.classList.remove('tab-active');
            tab.classList.remove('bg-gradient-to-r');
            tab.classList.remove('from-blue-600');
            tab.classList.remove('to-cyan-600');
        });
        
        // Hide all calculator sections
        [calcCommon, calcNatural, calcCustom].forEach(calc => {
            calc.classList.add('hidden');
        });
        
        // Add active class to selected tab
        activeTab.classList.add('tab-active');
        activeTab.classList.add('bg-gradient-to-r');
        activeTab.classList.add('from-blue-600');
        activeTab.classList.add('to-cyan-600');
        
        // Show selected calculator section
        activeCalc.classList.remove('hidden');
    }
    
    // Calculate button event listeners
    document.getElementById('calculate-common-btn').addEventListener('click', calculateCommonLog);
    document.getElementById('calculate-natural-btn').addEventListener('click', calculateNaturalLog);
    document.getElementById('calculate-custom-btn').addEventListener('click', calculateCustomLog);
    
    // Common Logarithm (Base 10) calculation
    function calculateCommonLog() {
        const value = parseFloat(document.getElementById('common-value').value);
        
        if (isNaN(value) || value <= 0) {
            showError('Please enter a positive number greater than 0');
            return;
        }
        
        const result = Math.log10(value);
        displayResult('Common Logarithm (Base 10)', value, 10, result);
    }
    
    // Natural Logarithm (Base e) calculation
    function calculateNaturalLog() {
        const value = parseFloat(document.getElementById('natural-value').value);
        
        if (isNaN(value) || value <= 0) {
            showError('Please enter a positive number greater than 0');
            return;
        }
        
        const result = Math.log(value);
        displayResult('Natural Logarithm (Base e)', value, 'e', result);
    }
    
    // Custom Base Logarithm calculation
    function calculateCustomLog() {
        const base = parseFloat(document.getElementById('custom-base').value);
        const value = parseFloat(document.getElementById('custom-value').value);
        
        if (isNaN(base) || base <= 0 || base === 1) {
            showError('Please enter a positive base number (not equal to 1)');
            return;
        }
        
        if (isNaN(value) || value <= 0) {
            showError('Please enter a positive number greater than 0');
            return;
        }
        
        // Using the change of base formula: log_b(x) = log(x) / log(b)
        const result = Math.log(value) / Math.log(base);
        displayResult('Custom Base Logarithm', value, base, result);
    }
    
    // Display the calculation result
    function displayResult(type, value, base, result) {
        let baseDisplay = base;
        if (base === 'e') {
            baseDisplay = 'e ≈ 2.71828';
        }
        
        resultDisplay.innerHTML = `
            <div class="text-center mb-6">
                <h3 class="text-xl font-bold text-white mb-2">${type}</h3>
                <div class="bg-white bg-opacity-5 p-4 rounded-lg inline-block">
                    <span class="text-2xl text-yellow-400 font-mono">log<sub>${base}</sub>(${value}) = ${result.toFixed(8)}</span>
                </div>
            </div>
            
            <div class="bg-white bg-opacity-5 p-4 rounded-lg mb-4">
                <h4 class="text-lg font-semibold text-white mb-2">Calculation Details</h4>
                <p class="text-gray-300">Base: ${baseDisplay}</p>
                <p class="text-gray-300">Input Value: ${value}</p>
                <p class="text-gray-300">Result: ${result.toFixed(8)}</p>
            </div>
            
            <div class="bg-white bg-opacity-5 p-4 rounded-lg">
                <h4 class="text-lg font-semibold text-white mb-2">Interpretation</h4>
                <p class="text-gray-300">${base}<sup>${result.toFixed(4)}</sup> = ${value}</p>
                <p class="text-gray-300 mt-2">This means that ${base} raised to the power of ${result.toFixed(4)} equals ${value}.</p>
            </div>
        `;
    }
    
    // Display error message
    function showError(message) {
        resultDisplay.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <p class="text-red-400 text-center font-semibold">${message}</p>
            </div>
        `;
    }
    
    // Input validation - only allow positive numbers
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = '';
            }
        });
    });
});