/**
 * Compound Interest Calculator JavaScript
 * Handles compound interest calculations with different compounding frequencies
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const principalInput = document.getElementById('principal');
    const rateInput = document.getElementById('rate');
    const timeInput = document.getElementById('time');
    const timeUnitSelect = document.getElementById('time-unit');
    const compoundFrequencySelect = document.getElementById('compound-frequency');
    const additionalContributionInput = document.getElementById('additional-contribution');
    const contributionFrequencySelect = document.getElementById('contribution-frequency');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('result');
    
    // Event Listeners
    calculateBtn.addEventListener('click', calculateCompoundInterest);
    resetBtn.addEventListener('click', resetCalculator);
    
    // Form submission event listener
    document.getElementById('compound-interest-form').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateCompoundInterest();
    });
    
    // Function to calculate compound interest
    function calculateCompoundInterest() {
        // Get input values
        const principal = parseFloat(principalInput.value);
        const rate = parseFloat(rateInput.value);
        const time = parseFloat(timeInput.value);
        const timeUnit = timeUnitSelect.value;
        const compoundFrequency = compoundFrequencySelect.value;
        const additionalContribution = parseFloat(additionalContributionInput.value) || 0;
        const contributionFrequency = contributionFrequencySelect.value;
        
        // Validate inputs
        if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
            showError('Please enter valid numbers for all required fields');
            return;
        }
        
        if (principal < 0) {
            showError('Principal amount cannot be negative');
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
        
        if (additionalContribution < 0) {
            showError('Additional contribution cannot be negative');
            return;
        }
        
        // Convert time to years based on selected unit
        let timeInYears = time;
        if (timeUnit === 'months') {
            timeInYears = time / 12;
        }
        
        // Calculate compound interest based on compounding frequency
        let finalAmount = 0;
        let totalContributions = 0;
        let compoundsPerYear = getCompoundsPerYear(compoundFrequency);
        
        // If there are no additional contributions
        if (additionalContribution === 0) {
            if (compoundFrequency === 'continuous') {
                // Continuous compounding formula: A = P * e^(rt)
                finalAmount = principal * Math.exp((rate / 100) * timeInYears);
            } else {
                // Standard compound interest formula: A = P(1 + r/n)^(nt)
                finalAmount = principal * Math.pow(1 + (rate / 100) / compoundsPerYear, compoundsPerYear * timeInYears);
            }
            totalContributions = principal;
        } else {
            // With additional contributions
            let contributionsPerYear = (contributionFrequency === 'monthly') ? 12 : 1;
            let contributionAmount = (contributionFrequency === 'monthly') ? additionalContribution : additionalContribution;
            
            // For continuous compounding with contributions, we'll use a numerical approach
            if (compoundFrequency === 'continuous') {
                finalAmount = calculateWithContributions(principal, rate, timeInYears, contributionsPerYear, contributionAmount, 'continuous');
            } else {
                finalAmount = calculateWithContributions(principal, rate, timeInYears, contributionsPerYear, contributionAmount, compoundsPerYear);
            }
            
            // Calculate total contributions
            let numberOfContributions = contributionsPerYear * timeInYears;
            totalContributions = principal + (contributionAmount * numberOfContributions);
        }
        
        // Calculate interest earned
        const interestEarned = finalAmount - totalContributions;
        
        // Display results
        displayResults(principal, rate, time, timeUnit, compoundFrequency, additionalContribution, 
                      contributionFrequency, finalAmount, interestEarned, totalContributions);
    }
    
    // Function to calculate compound interest with regular contributions
    function calculateWithContributions(principal, rate, timeInYears, contributionsPerYear, contributionAmount, compoundsPerYear) {
        // For continuous compounding with contributions
        if (compoundsPerYear === 'continuous') {
            let balance = principal;
            const smallTimeStep = 1 / contributionsPerYear; // Time step for each contribution
            const totalSteps = timeInYears * contributionsPerYear;
            
            for (let i = 0; i < totalSteps; i++) {
                // Apply continuous compounding for the small time step
                balance = balance * Math.exp((rate / 100) * smallTimeStep);
                // Add contribution (except for the last period)
                if (i < totalSteps - 1) {
                    balance += contributionAmount;
                }
            }
            
            return balance;
        } else {
            // For regular compounding with contributions
            let balance = principal;
            const ratePerPeriod = (rate / 100) / compoundsPerYear;
            const periodsPerContribution = compoundsPerYear / contributionsPerYear;
            const totalCompoundingPeriods = compoundsPerYear * timeInYears;
            
            for (let i = 0; i < totalCompoundingPeriods; i++) {
                // Apply compound interest for one period
                balance = balance * (1 + ratePerPeriod);
                
                // Add contribution if this is a contribution period (except for the last period)
                if (i < totalCompoundingPeriods - 1 && i % periodsPerContribution === 0) {
                    balance += contributionAmount;
                }
            }
            
            return balance;
        }
    }
    
    // Function to get number of compounds per year based on frequency
    function getCompoundsPerYear(frequency) {
        switch (frequency) {
            case 'annually':
                return 1;
            case 'semi-annually':
                return 2;
            case 'quarterly':
                return 4;
            case 'monthly':
                return 12;
            case 'daily':
                return 365;
            case 'continuous':
                return 'continuous';
            default:
                return 12; // Default to monthly
        }
    }
    
    // Function to get frequency name for display
    function getFrequencyName(frequency) {
        switch (frequency) {
            case 'annually':
                return 'Annually (1 time per year)';
            case 'semi-annually':
                return 'Semi-annually (2 times per year)';
            case 'quarterly':
                return 'Quarterly (4 times per year)';
            case 'monthly':
                return 'Monthly (12 times per year)';
            case 'daily':
                return 'Daily (365 times per year)';
            case 'continuous':
                return 'Continuous';
            default:
                return frequency;
        }
    }
    
    // Function to display results
    function displayResults(principal, rate, time, timeUnit, compoundFrequency, additionalContribution, 
                          contributionFrequency, finalAmount, interestEarned, totalContributions) {
        // Format numbers for display
        const formattedPrincipal = formatCurrency(principal);
        const formattedFinalAmount = formatCurrency(finalAmount);
        const formattedInterestEarned = formatCurrency(interestEarned);
        const formattedTotalContributions = formatCurrency(totalContributions);
        const formattedAdditionalContribution = formatCurrency(additionalContribution);
        
        // Format time period for display
        let timeDisplay = `${time} ${timeUnit}`;
        
        // Create contribution display text
        let contributionText = '';
        if (additionalContribution > 0) {
            contributionText = `
                <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                    <span class="text-gray-300">Additional Contribution:</span>
                    <span class="text-white font-semibold">${formattedAdditionalContribution} per ${contributionFrequency === 'monthly' ? 'month' : 'year'}</span>
                </div>
            `;
        }
        
        // Create a growth chart (simplified text-based version)
        let growthChart = createGrowthChart(principal, rate, time, timeUnit, compoundFrequency, additionalContribution, contributionFrequency);
        
        resultDiv.innerHTML = `
            <div class="animate-fade-in">
                <h3 class="text-xl font-semibold text-white mb-4">Compound Interest Calculation Results</h3>
                
                <div class="bg-purple-800 bg-opacity-50 p-4 rounded-lg mb-6">
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
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Compounding Frequency:</span>
                        <span class="text-white font-semibold">${getFrequencyName(compoundFrequency)}</span>
                    </div>
                    ${contributionText}
                </div>
                
                <div class="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-6 mb-6 text-center">
                    <h4 class="text-lg font-semibold text-white mb-2">Final Amount</h4>
                    <p class="text-3xl font-bold text-white">${formattedFinalAmount}</p>
                </div>
                
                <div class="bg-purple-800 bg-opacity-50 p-4 rounded-lg mb-6">
                    <h4 class="text-lg font-semibold text-white mb-3">Summary</h4>
                    
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Initial Investment:</span>
                        <span class="text-white font-semibold">${formattedPrincipal}</span>
                    </div>
                    ${additionalContribution > 0 ? `
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Total Contributions:</span>
                        <span class="text-white font-semibold">${formattedTotalContributions}</span>
                    </div>
                    ` : ''}
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Interest Earned:</span>
                        <span class="text-white font-semibold">${formattedInterestEarned}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Final Balance:</span>
                        <span class="text-white font-semibold">${formattedFinalAmount}</span>
                    </div>
                </div>
                
                <div class="bg-purple-800 bg-opacity-50 p-4 rounded-lg">
                    <h4 class="text-lg font-semibold text-white mb-3">Growth Over Time</h4>
                    ${growthChart}
                </div>
            </div>
        `;
    }
    
    // Function to create a simple text-based growth chart
    function createGrowthChart(principal, rate, time, timeUnit, compoundFrequency, additionalContribution, contributionFrequency) {
        // Convert time to years if needed
        let timeInYears = time;
        if (timeUnit === 'months') {
            timeInYears = time / 12;
        }
        
        // Determine number of data points (years)
        const years = Math.ceil(timeInYears);
        const dataPoints = Math.min(years, 10); // Limit to 10 data points for readability
        const yearStep = Math.max(1, Math.floor(years / dataPoints));
        
        let compoundsPerYear = getCompoundsPerYear(compoundFrequency);
        let contributionsPerYear = (contributionFrequency === 'monthly') ? 12 : 1;
        let contributionAmount = additionalContribution;
        
        let tableRows = '';
        let currentAmount = principal;
        let totalContributions = principal;
        
        for (let year = 0; year <= years; year += yearStep) {
            // Skip intermediate years if we have too many
            if (year > 0 && year < years && dataPoints < years && year % yearStep !== 0) {
                continue;
            }
            
            // Calculate amount for this year
            if (year === 0) {
                currentAmount = principal;
                totalContributions = principal;
            } else {
                // Calculate for each year
                if (compoundFrequency === 'continuous') {
                    if (additionalContribution === 0) {
                        currentAmount = principal * Math.exp((rate / 100) * year);
                    } else {
                        currentAmount = calculateWithContributions(
                            principal, rate, year, contributionsPerYear, contributionAmount, 'continuous');
                    }
                } else {
                    if (additionalContribution === 0) {
                        currentAmount = principal * Math.pow(1 + (rate / 100) / compoundsPerYear, compoundsPerYear * year);
                    } else {
                        currentAmount = calculateWithContributions(
                            principal, rate, year, contributionsPerYear, contributionAmount, compoundsPerYear);
                    }
                }
                
                // Update total contributions
                if (additionalContribution > 0) {
                    let contributionsThisYear = contributionsPerYear * year;
                    totalContributions = principal + (contributionAmount * contributionsThisYear);
                }
            }
            
            // Calculate interest earned
            const interestEarned = currentAmount - totalContributions;
            
            // Add table row
            tableRows += `
                <tr class="border-b border-white border-opacity-10">
                    <td class="py-2 text-left">${year}</td>
                    <td class="py-2 text-right">${formatCurrency(totalContributions)}</td>
                    <td class="py-2 text-right">${formatCurrency(interestEarned)}</td>
                    <td class="py-2 text-right">${formatCurrency(currentAmount)}</td>
                </tr>
            `;
            
            // If this is the last year and it's not exactly the requested time, add the exact final year
            if (year < years && year + yearStep > years && years % yearStep !== 0) {
                year = years - yearStep; // Set up to show the final year on next iteration
            }
        }
        
        return `
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-white">
                    <thead>
                        <tr class="bg-purple-800 bg-opacity-70">
                            <th class="py-2 text-left">Year</th>
                            <th class="py-2 text-right">Total Contributions</th>
                            <th class="py-2 text-right">Interest Earned</th>
                            <th class="py-2 text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
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
        compoundFrequencySelect.value = 'monthly';
        additionalContributionInput.value = '';
        contributionFrequencySelect.value = 'monthly';
        
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