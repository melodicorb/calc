/**
 * Simple Interest Calculator JavaScript
 * Handles simple interest calculations based on principal, rate, and time
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const principalInput = document.getElementById('principal');
    const rateInput = document.getElementById('rate');
    const timeInput = document.getElementById('time');
    const timeUnitSelect = document.getElementById('time-unit');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('result');
    
    // Event Listeners
    calculateBtn.addEventListener('click', calculateSimpleInterest);
    resetBtn.addEventListener('click', resetCalculator);
    
    // Form submission event listener
    document.getElementById('simple-interest-form').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateSimpleInterest();
    });
    
    // Function to calculate simple interest
    function calculateSimpleInterest() {
        // Get input values
        const principal = parseFloat(principalInput.value);
        const rate = parseFloat(rateInput.value);
        const time = parseFloat(timeInput.value);
        const timeUnit = timeUnitSelect.value;
        
        // Validate inputs
        if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
            showError('Please enter valid numbers for all fields');
            return;
        }
        
        if (principal <= 0) {
            showError('Principal amount must be greater than zero');
            return;
        }
        
        if (rate < 0) {
            showError('Interest rate cannot be negative');
            return;
        }
        
        if (time <= 0) {
            showError('Time period must be greater than zero');
            return;
        }
        
        // Convert time to years based on selected unit
        let timeInYears = time;
        if (timeUnit === 'months') {
            timeInYears = time / 12;
        } else if (timeUnit === 'days') {
            timeInYears = time / 365;
        }
        
        // Calculate simple interest
        const interest = (principal * rate * timeInYears) / 100;
        const totalAmount = principal + interest;
        
        // Display results
        displayResults(principal, rate, time, timeUnit, interest, totalAmount);
    }
    
    // Function to display results
    function displayResults(principal, rate, time, timeUnit, interest, totalAmount) {
        // Format numbers for display
        const formattedPrincipal = formatCurrency(principal);
        const formattedInterest = formatCurrency(interest);
        const formattedTotal = formatCurrency(totalAmount);
        
        // Format time period for display
        let timeDisplay = `${time} ${timeUnit}`;
        
        // Calculate interest earned per year/month/day
        let interestPerPeriod = '';
        if (timeUnit === 'years' && time > 1) {
            const interestPerYear = interest / time;
            interestPerPeriod = `<div class="flex justify-between items-center">
                <span class="text-gray-300">Interest per year:</span>
                <span class="text-white font-semibold">${formatCurrency(interestPerYear)}</span>
            </div>`;
        } else if (timeUnit === 'months' && time > 1) {
            const interestPerMonth = interest / time;
            interestPerPeriod = `<div class="flex justify-between items-center">
                <span class="text-gray-300">Interest per month:</span>
                <span class="text-white font-semibold">${formatCurrency(interestPerMonth)}</span>
            </div>`;
        } else if (timeUnit === 'days' && time > 1) {
            const interestPerDay = interest / time;
            interestPerPeriod = `<div class="flex justify-between items-center">
                <span class="text-gray-300">Interest per day:</span>
                <span class="text-white font-semibold">${formatCurrency(interestPerDay)}</span>
            </div>`;
        }
        
        resultDiv.innerHTML = `
            <div class="animate-fade-in">
                <h3 class="text-xl font-semibold text-white mb-4">Simple Interest Calculation Results</h3>
                
                <div class="bg-white bg-opacity-5 p-4 rounded-lg mb-6">
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Principal Amount:</span>
                        <span class="text-white font-semibold">${formattedPrincipal}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Interest Rate:</span>
                        <span class="text-white font-semibold">${rate}% per year</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Time Period:</span>
                        <span class="text-white font-semibold">${timeDisplay}</span>
                    </div>
                </div>
                
                <div class="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 mb-6 text-center">
                    <h4 class="text-lg font-semibold text-white mb-2">Interest Earned</h4>
                    <p class="text-3xl font-bold text-white">${formattedInterest}</p>
                </div>
                
                <div class="bg-white bg-opacity-5 p-4 rounded-lg">
                    <h4 class="text-lg font-semibold text-white mb-3">Summary</h4>
                    
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Principal Amount:</span>
                        <span class="text-white font-semibold">${formattedPrincipal}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Interest Earned:</span>
                        <span class="text-white font-semibold">${formattedInterest}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Total Amount:</span>
                        <span class="text-white font-semibold">${formattedTotal}</span>
                    </div>
                    
                    ${interestPerPeriod}
                </div>
            </div>
        `;
    }
    
    // Function to show error message
    function showError(message) {
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <p class="text-red-300 text-center">${message}</p>
            </div>
        `;
    }
    
    // Function to reset calculator
    function resetCalculator() {
        principalInput.value = '';
        rateInput.value = '';
        timeInput.value = '';
        timeUnitSelect.value = 'years';
        
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-calculator text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-300 text-center">Enter values and click Calculate to see the results</p>
            </div>
        `;
    }
    
    // Function to format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
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