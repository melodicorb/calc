/**
 * Investment Profit Calculator JavaScript
 * Handles investment profit calculations and growth chart generation
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const initialInvestmentInput = document.getElementById('initial-investment');
    const additionalContributionsInput = document.getElementById('additional-contributions');
    const returnRateInput = document.getElementById('return-rate');
    const investmentPeriodInput = document.getElementById('investment-period');
    const periodUnitSelect = document.getElementById('period-unit');
    const compoundFrequencySelect = document.getElementById('compound-frequency');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('result');
    const growthChartSection = document.getElementById('growth-chart-section');
    const growthChartDiv = document.getElementById('growth-chart');
    
    // Event Listeners
    calculateBtn.addEventListener('click', calculateInvestmentProfit);
    resetBtn.addEventListener('click', resetCalculator);
    
    // Form submission event listener
    document.getElementById('investment-profit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateInvestmentProfit();
    });
    
    // Function to calculate investment profit
    function calculateInvestmentProfit() {
        // Get input values
        const initialInvestment = parseFloat(initialInvestmentInput.value);
        const additionalContributions = parseFloat(additionalContributionsInput.value) || 0;
        const returnRate = parseFloat(returnRateInput.value);
        const investmentPeriod = parseFloat(investmentPeriodInput.value);
        const periodUnit = periodUnitSelect.value;
        const compoundFrequency = compoundFrequencySelect.value;
        
        // Validate inputs
        if (isNaN(initialInvestment) || isNaN(returnRate) || isNaN(investmentPeriod)) {
            showError('Please enter valid numbers for all required fields');
            return;
        }
        
        if (initialInvestment <= 0) {
            showError('Initial investment must be greater than zero');
            return;
        }
        
        if (returnRate <= 0) {
            showError('Return rate must be greater than zero');
            return;
        }
        
        if (investmentPeriod <= 0) {
            showError('Investment period must be greater than zero');
            return;
        }
        
        // Convert investment period to months
        let investmentPeriodMonths = investmentPeriod;
        if (periodUnit === 'years') {
            investmentPeriodMonths = investmentPeriod * 12;
        }
        
        // Convert annual return rate to decimal
        const annualReturnRate = returnRate / 100;
        
        // Determine number of compounds per year based on frequency
        let compoundsPerYear;
        switch (compoundFrequency) {
            case 'annually':
                compoundsPerYear = 1;
                break;
            case 'semi-annually':
                compoundsPerYear = 2;
                break;
            case 'quarterly':
                compoundsPerYear = 4;
                break;
            case 'monthly':
                compoundsPerYear = 12;
                break;
            case 'daily':
                compoundsPerYear = 365;
                break;
            default:
                compoundsPerYear = 12; // Default to monthly
        }
        
        // Calculate total investment period in years for the formula
        const periodInYears = investmentPeriodMonths / 12;
        
        // Calculate future value without additional contributions
        const ratePerPeriod = annualReturnRate / compoundsPerYear;
        const periods = compoundsPerYear * periodInYears;
        
        let futureValue;
        
        if (additionalContributions > 0) {
            // Calculate future value with regular contributions
            // For monthly contributions, we need to adjust the formula
            const contributionsPerYear = 12; // Assuming monthly contributions
            const contributionAmount = additionalContributions;
            
            // Generate growth data for each period
            const growthData = generateGrowthData(
                initialInvestment,
                contributionAmount,
                annualReturnRate,
                compoundsPerYear,
                contributionsPerYear,
                periodInYears
            );
            
            // Get the final value
            futureValue = growthData[growthData.length - 1].value;
            
            // Display growth chart
            displayGrowthChart(growthData);
        } else {
            // Simple compound interest without additional contributions
            futureValue = initialInvestment * Math.pow(1 + ratePerPeriod, periods);
            
            // Generate growth data for chart
            const growthData = [];
            const intervalsToShow = Math.min(20, periodInYears * compoundsPerYear); // Limit to 20 data points
            const interval = periods / intervalsToShow;
            
            for (let i = 0; i <= intervalsToShow; i++) {
                const currentPeriod = Math.round(i * interval);
                const currentValue = initialInvestment * Math.pow(1 + ratePerPeriod, currentPeriod);
                const timeLabel = (currentPeriod / compoundsPerYear).toFixed(2) + ' years';
                
                growthData.push({
                    period: timeLabel,
                    value: currentValue,
                    principal: initialInvestment,
                    interest: currentValue - initialInvestment
                });
            }
            
            // Display growth chart
            displayGrowthChart(growthData);
        }
        
        // Calculate total contributions
        const totalContributions = initialInvestment + (additionalContributions * investmentPeriodMonths);
        
        // Calculate total profit
        const totalProfit = futureValue - totalContributions;
        
        // Calculate ROI
        const roi = (totalProfit / totalContributions) * 100;
        
        // Display results
        displayResults(
            initialInvestment,
            additionalContributions,
            returnRate,
            investmentPeriod,
            periodUnit,
            compoundFrequency,
            futureValue,
            totalContributions,
            totalProfit,
            roi
        );
    }
    
    // Function to generate growth data with regular contributions
    function generateGrowthData(initialInvestment, contributionAmount, annualRate, compoundsPerYear, contributionsPerYear, years) {
        const data = [];
        let currentValue = initialInvestment;
        let totalPrincipal = initialInvestment;
        const totalPeriods = years * compoundsPerYear;
        const contributionInterval = compoundsPerYear / contributionsPerYear;
        
        // Add initial point
        data.push({
            period: '0 years',
            value: currentValue,
            principal: totalPrincipal,
            interest: 0
        });
        
        // Calculate for each period
        for (let period = 1; period <= totalPeriods; period++) {
            // Apply interest for this period
            const interestForPeriod = currentValue * (annualRate / compoundsPerYear);
            currentValue += interestForPeriod;
            
            // Add contribution if it's a contribution period
            if (period % contributionInterval === 0) {
                currentValue += contributionAmount;
                totalPrincipal += contributionAmount;
            }
            
            // Only add data points at regular intervals to avoid too many points
            const intervalsToShow = Math.min(20, totalPeriods); // Limit to 20 data points
            const interval = totalPeriods / intervalsToShow;
            
            if (period % Math.ceil(interval) === 0 || period === totalPeriods) {
                const yearLabel = (period / compoundsPerYear).toFixed(2) + ' years';
                data.push({
                    period: yearLabel,
                    value: currentValue,
                    principal: totalPrincipal,
                    interest: currentValue - totalPrincipal
                });
            }
        }
        
        return data;
    }
    
    // Function to display growth chart
    function displayGrowthChart(growthData) {
        // Show growth chart section
        growthChartSection.classList.remove('hidden');
        
        // Create a simple bar chart using HTML/CSS
        let chartHTML = '<div class="relative h-full w-full">';
        
        // Find the maximum value for scaling
        const maxValue = Math.max(...growthData.map(item => item.value));
        
        // Create bars for each data point
        growthData.forEach((data, index) => {
            const barHeight = (data.value / maxValue) * 100;
            const principalHeight = (data.principal / maxValue) * 100;
            const interestHeight = (data.interest / maxValue) * 100;
            
            chartHTML += `
                <div class="absolute bottom-8 transform -translate-x-1/2" style="left: ${(index / (growthData.length - 1)) * 100}%">
                    <div class="flex flex-col items-center">
                        <div class="relative w-6 bg-gray-700 bg-opacity-30" style="height: ${barHeight}%">
                            <div class="absolute bottom-0 w-full bg-red-500" style="height: ${principalHeight}%"></div>
                            <div class="absolute bottom-0 w-full bg-pink-500" style="height: ${interestHeight}%; transform: translateY(-${principalHeight}%)"></div>
                        </div>
                        <div class="text-xs text-gray-300 mt-2 transform -rotate-45 origin-top-left">${data.period}</div>
                    </div>
                </div>
            `;
        });
        
        // Add y-axis labels
        chartHTML += `
            <div class="absolute left-0 bottom-8 w-full border-t border-white border-opacity-20"></div>
            <div class="absolute left-0 bottom-8 text-xs text-gray-300">$0</div>
            <div class="absolute left-0 top-0 text-xs text-gray-300">${formatCurrency(maxValue)}</div>
            <div class="absolute left-0 bottom-0 w-full flex justify-center">
                <div class="flex items-center space-x-4 text-xs text-gray-300">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-red-500 mr-1"></div>
                        <span>Principal</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-pink-500 mr-1"></div>
                        <span>Interest</span>
                    </div>
                </div>
            </div>
        `;
        
        chartHTML += '</div>';
        
        // Update growth chart div
        growthChartDiv.innerHTML = chartHTML;
    }
    
    // Function to display results
    function displayResults(
        initialInvestment,
        additionalContributions,
        returnRate,
        investmentPeriod,
        periodUnit,
        compoundFrequency,
        futureValue,
        totalContributions,
        totalProfit,
        roi
    ) {
        // Format numbers for display
        const formattedInitialInvestment = formatCurrency(initialInvestment);
        const formattedAdditionalContributions = formatCurrency(additionalContributions);
        const formattedFutureValue = formatCurrency(futureValue);
        const formattedTotalContributions = formatCurrency(totalContributions);
        const formattedTotalProfit = formatCurrency(totalProfit);
        
        // Format investment period for display
        let investmentPeriodDisplay = `${investmentPeriod} ${periodUnit}`;
        
        // Format compound frequency for display
        let compoundFrequencyDisplay = compoundFrequency.charAt(0).toUpperCase() + compoundFrequency.slice(1);
        
        resultDiv.innerHTML = `
            <div class="animate-fade-in">
                <h3 class="text-xl font-semibold text-white mb-4">Investment Profit Calculation Results</h3>
                
                <div class="bg-white bg-opacity-5 p-4 rounded-lg mb-6">
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Initial Investment:</span>
                        <span class="text-white font-semibold">${formattedInitialInvestment}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Monthly Contribution:</span>
                        <span class="text-white font-semibold">${formattedAdditionalContributions}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Annual Return Rate:</span>
                        <span class="text-white font-semibold">${returnRate}%</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Investment Period:</span>
                        <span class="text-white font-semibold">${investmentPeriodDisplay}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Compounding Frequency:</span>
                        <span class="text-white font-semibold">${compoundFrequencyDisplay}</span>
                    </div>
                </div>
                
                <div class="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-6 mb-6 text-center">
                    <h4 class="text-lg font-semibold text-white mb-2">Future Value</h4>
                    <p class="text-3xl font-bold text-white">${formattedFutureValue}</p>
                </div>
                
                <div class="bg-white bg-opacity-5 p-4 rounded-lg">
                    <h4 class="text-lg font-semibold text-white mb-3">Investment Summary</h4>
                    
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Total Contributions:</span>
                        <span class="text-white font-semibold">${formattedTotalContributions}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Total Profit:</span>
                        <span class="text-white font-semibold">${formattedTotalProfit}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Return on Investment (ROI):</span>
                        <span class="text-white font-semibold">${roi.toFixed(2)}%</span>
                    </div>
                </div>
                
                <div class="mt-6">
                    <div class="bg-white bg-opacity-5 p-4 rounded-lg">
                        <h4 class="text-lg font-semibold text-white mb-3">Investment Breakdown</h4>
                        <div class="flex items-center justify-center space-x-2 mb-4">
                            <div class="w-6 h-6 rounded-full bg-red-500"></div>
                            <span class="text-gray-300 mr-4">Principal (${Math.round(totalContributions / futureValue * 100)}%)</span>
                            <div class="w-6 h-6 rounded-full bg-pink-500"></div>
                            <span class="text-gray-300">Profit (${Math.round(totalProfit / futureValue * 100)}%)</span>
                        </div>
                        <div class="w-full bg-white bg-opacity-20 rounded-full h-6 overflow-hidden">
                            <div class="bg-red-500 h-full" style="width: ${Math.round(totalContributions / futureValue * 100)}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 text-center">
                    <button id="view-chart-btn" class="bg-white bg-opacity-10 text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-20 transition-all duration-300">
                        <i class="fas fa-chart-line mr-2"></i> View Growth Chart
                    </button>
                </div>
            </div>
        `;
        
        // Add event listener to view chart button
        document.getElementById('view-chart-btn').addEventListener('click', function() {
            // Scroll to growth chart section
            growthChartSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Function to show error message
    function showError(message) {
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <p class="text-red-300 text-center">${message}</p>
            </div>
        `;
        
        // Hide growth chart section
        growthChartSection.classList.add('hidden');
    }
    
    // Function to reset calculator
    function resetCalculator() {
        initialInvestmentInput.value = '';
        additionalContributionsInput.value = '';
        returnRateInput.value = '';
        investmentPeriodInput.value = '';
        periodUnitSelect.value = 'years';
        compoundFrequencySelect.value = 'monthly';
        
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-chart-pie text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-300 text-center">Enter investment details and click Calculate to see the results</p>
            </div>
        `;
        
        // Hide growth chart section
        growthChartSection.classList.add('hidden');
    }
    
    // Function to format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
});