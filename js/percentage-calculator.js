/**
 * Percentage Calculator JavaScript
 * Handles percentage calculations, percentage changes, and percentage distributions
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Tabs
    const tabPercentOf = document.getElementById('tab-percent-of');
    const tabPercentChange = document.getElementById('tab-percent-change');
    const tabFindPercent = document.getElementById('tab-find-percent');
    
    // DOM Elements - Calculator Sections
    const calcPercentOf = document.getElementById('calc-percent-of');
    const calcPercentChange = document.getElementById('calc-percent-change');
    const calcFindPercent = document.getElementById('calc-find-percent');
    
    // DOM Elements - Buttons
    const calculatePercentOfBtn = document.getElementById('calculate-percent-of-btn');
    const calculatePercentChangeBtn = document.getElementById('calculate-percent-change-btn');
    const calculateFindPercentBtn = document.getElementById('calculate-find-percent-btn');
    
    // DOM Elements - Result
    const percentageResult = document.getElementById('percentage-result');
    
    // Tab switching functionality
    function switchTab(activeTab, activeCalc) {
        // Reset all tabs
        [tabPercentOf, tabPercentChange, tabFindPercent].forEach(tab => {
            tab.classList.remove('tab-active');
            tab.classList.remove('bg-white', 'bg-opacity-10');
        });
        
        // Reset all calculator sections
        [calcPercentOf, calcPercentChange, calcFindPercent].forEach(calc => {
            calc.classList.add('hidden');
        });
        
        // Set active tab
        activeTab.classList.add('tab-active');
        activeTab.classList.add('bg-white', 'bg-opacity-10');
        
        // Show active calculator section
        activeCalc.classList.remove('hidden');
        
        // Reset result display
        resetResultDisplay();
    }
    
    // Reset result display to initial state
    function resetResultDisplay() {
        percentageResult.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-calculator text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-300 text-center">Enter values and click Calculate to see the result</p>
            </div>
        `;
    }
    
    // Display result with animation
    function displayResult(title, result, explanation = '') {
        percentageResult.innerHTML = `
            <div class="animate-fade-in">
                <h3 class="text-xl font-semibold text-white mb-4">${title}</h3>
                <div class="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
                    <p class="text-3xl font-bold text-yellow-400 text-center">${result}</p>
                </div>
                ${explanation ? `<p class="text-gray-300">${explanation}</p>` : ''}
            </div>
        `;
    }
    
    // Format number for display
    function formatNumber(num) {
        // Handle potential errors
        if (isNaN(num)) return 'Invalid number';
        if (!isFinite(num)) return 'Infinity';
        
        // Format with up to 2 decimal places, but remove trailing zeros
        return parseFloat(num.toFixed(2)).toLocaleString();
    }
    
    // Calculate percentage of a number
    function calculatePercentOf() {
        const percentValue = parseFloat(document.getElementById('percent-value').value);
        const ofValue = parseFloat(document.getElementById('of-value').value);
        
        // Validate inputs
        if (isNaN(percentValue) || isNaN(ofValue)) {
            displayResult('Error', 'Please enter valid numbers');
            return;
        }
        
        const result = (percentValue / 100) * ofValue;
        
        displayResult(
            'Result',
            formatNumber(result),
            `${formatNumber(percentValue)}% of ${formatNumber(ofValue)} is ${formatNumber(result)}`
        );
    }
    
    // Calculate percentage change
    function calculatePercentChange() {
        const fromValue = parseFloat(document.getElementById('from-value').value);
        const toValue = parseFloat(document.getElementById('to-value').value);
        
        // Validate inputs
        if (isNaN(fromValue) || isNaN(toValue)) {
            displayResult('Error', 'Please enter valid numbers');
            return;
        }
        
        // Prevent division by zero
        if (fromValue === 0) {
            displayResult('Error', 'Original value cannot be zero');
            return;
        }
        
        const change = toValue - fromValue;
        const percentChange = (change / Math.abs(fromValue)) * 100;
        
        // Determine if it's an increase or decrease
        const changeType = percentChange >= 0 ? 'increase' : 'decrease';
        
        displayResult(
            'Percentage Change',
            `${formatNumber(Math.abs(percentChange))}%`,
            `From ${formatNumber(fromValue)} to ${formatNumber(toValue)} is a ${changeType} of ${formatNumber(Math.abs(percentChange))}%`
        );
    }
    
    // Find what percentage X is of Y
    function calculateFindPercent() {
        const xValue = parseFloat(document.getElementById('x-value').value);
        const yValue = parseFloat(document.getElementById('y-value').value);
        
        // Validate inputs
        if (isNaN(xValue) || isNaN(yValue)) {
            displayResult('Error', 'Please enter valid numbers');
            return;
        }
        
        // Prevent division by zero
        if (yValue === 0) {
            displayResult('Error', 'Whole value cannot be zero');
            return;
        }
        
        const percentResult = (xValue / yValue) * 100;
        
        displayResult(
            'Percentage Result',
            `${formatNumber(percentResult)}%`,
            `${formatNumber(xValue)} is ${formatNumber(percentResult)}% of ${formatNumber(yValue)}`
        );
    }
    
    // Event Listeners - Tab Switching
    tabPercentOf.addEventListener('click', () => switchTab(tabPercentOf, calcPercentOf));
    tabPercentChange.addEventListener('click', () => switchTab(tabPercentChange, calcPercentChange));
    tabFindPercent.addEventListener('click', () => switchTab(tabFindPercent, calcFindPercent));
    
    // Event Listeners - Calculate Buttons
    calculatePercentOfBtn.addEventListener('click', calculatePercentOf);
    calculatePercentChangeBtn.addEventListener('click', calculatePercentChange);
    calculateFindPercentBtn.addEventListener('click', calculateFindPercent);
    
    // Event Listeners - Form Submissions (prevent default and trigger calculation)
    document.getElementById('percent-of-form').addEventListener('submit', (e) => {
        e.preventDefault();
        calculatePercentOf();
    });
    
    document.getElementById('percent-change-form').addEventListener('submit', (e) => {
        e.preventDefault();
        calculatePercentChange();
    });
    
    document.getElementById('find-percent-form').addEventListener('submit', (e) => {
        e.preventDefault();
        calculateFindPercent();
    });
    
    // Initialize mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileDropdownButton = document.getElementById('mobile-dropdown-button');
    const mobileDropdown = document.getElementById('mobile-dropdown');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    if (mobileDropdownButton && mobileDropdown) {
        mobileDropdownButton.addEventListener('click', function() {
            mobileDropdown.classList.toggle('hidden');
        });
    }
});