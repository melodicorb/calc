/**
 * Loan EMI Calculator JavaScript
 * Handles loan EMI calculations and amortization schedule generation
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loanAmountInput = document.getElementById('loan-amount');
    const interestRateInput = document.getElementById('interest-rate');
    const loanTermInput = document.getElementById('loan-term');
    const termUnitSelect = document.getElementById('term-unit');
    const startDateInput = document.getElementById('start-date');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('result');
    const amortizationSection = document.getElementById('amortization-section');
    const amortizationTable = document.getElementById('amortization-table');
    
    // Set default start date to today
    const today = new Date();
    startDateInput.valueAsDate = today;
    
    // Event Listeners
    calculateBtn.addEventListener('click', calculateLoanEMI);
    resetBtn.addEventListener('click', resetCalculator);
    
    // Form submission event listener
    document.getElementById('loan-emi-form').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateLoanEMI();
    });
    
    // Function to calculate loan EMI
    function calculateLoanEMI() {
        // Get input values
        const loanAmount = parseFloat(loanAmountInput.value);
        const interestRate = parseFloat(interestRateInput.value);
        const loanTerm = parseFloat(loanTermInput.value);
        const termUnit = termUnitSelect.value;
        const startDate = startDateInput.value ? new Date(startDateInput.value) : new Date();
        
        // Validate inputs
        if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
            showError('Please enter valid numbers for all required fields');
            return;
        }
        
        if (loanAmount <= 0) {
            showError('Loan amount must be greater than zero');
            return;
        }
        
        if (interestRate <= 0) {
            showError('Interest rate must be greater than zero');
            return;
        }
        
        if (loanTerm <= 0) {
            showError('Loan term must be greater than zero');
            return;
        }
        
        // Convert loan term to months
        let loanTermMonths = loanTerm;
        if (termUnit === 'years') {
            loanTermMonths = loanTerm * 12;
        }
        
        // Calculate monthly interest rate (annual rate / 12 / 100)
        const monthlyInterestRate = interestRate / 12 / 100;
        
        // Calculate EMI using formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
        const emi = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths) / 
                  (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
        
        // Calculate total payment and total interest
        const totalPayment = emi * loanTermMonths;
        const totalInterest = totalPayment - loanAmount;
        
        // Generate amortization schedule
        const schedule = generateAmortizationSchedule(
            loanAmount, monthlyInterestRate, loanTermMonths, emi, startDate
        );
        
        // Display results
        displayResults(loanAmount, interestRate, loanTerm, termUnit, emi, totalPayment, totalInterest);
        
        // Display amortization schedule
        displayAmortizationSchedule(schedule);
    }
    
    // Function to generate amortization schedule
    function generateAmortizationSchedule(loanAmount, monthlyInterestRate, loanTermMonths, emi, startDate) {
        const schedule = [];
        let remainingBalance = loanAmount;
        let paymentDate = new Date(startDate);
        
        for (let month = 1; month <= loanTermMonths; month++) {
            // Calculate interest and principal for this month
            const interestPayment = remainingBalance * monthlyInterestRate;
            const principalPayment = emi - interestPayment;
            
            // Update remaining balance
            remainingBalance -= principalPayment;
            
            // Ensure the last payment adjusts for any rounding errors
            if (month === loanTermMonths) {
                if (Math.abs(remainingBalance) < 0.01) {
                    remainingBalance = 0;
                }
            }
            
            // Calculate payment date
            paymentDate.setMonth(paymentDate.getMonth() + 1);
            const paymentDateStr = formatDate(new Date(paymentDate));
            
            // Add to schedule
            schedule.push({
                month: month,
                paymentDate: paymentDateStr,
                emi: emi,
                principal: principalPayment,
                interest: interestPayment,
                balance: remainingBalance > 0 ? remainingBalance : 0
            });
        }
        
        return schedule;
    }
    
    // Function to display results
    function displayResults(loanAmount, interestRate, loanTerm, termUnit, emi, totalPayment, totalInterest) {
        // Format numbers for display
        const formattedLoanAmount = formatCurrency(loanAmount);
        const formattedEMI = formatCurrency(emi);
        const formattedTotalPayment = formatCurrency(totalPayment);
        const formattedTotalInterest = formatCurrency(totalInterest);
        
        // Format loan term for display
        let loanTermDisplay = `${loanTerm} ${termUnit}`;
        
        resultDiv.innerHTML = `
            <div class="animate-fade-in">
                <h3 class="text-xl font-semibold text-white mb-4">Loan EMI Calculation Results</h3>
                
                <div class="bg-white bg-opacity-5 p-4 rounded-lg mb-6">
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Loan Amount:</span>
                        <span class="text-white font-semibold">${formattedLoanAmount}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Interest Rate:</span>
                        <span class="text-white font-semibold">${interestRate}% per year</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Loan Term:</span>
                        <span class="text-white font-semibold">${loanTermDisplay}</span>
                    </div>
                </div>
                
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 mb-6 text-center">
                    <h4 class="text-lg font-semibold text-white mb-2">Monthly EMI</h4>
                    <p class="text-3xl font-bold text-white">${formattedEMI}</p>
                </div>
                
                <div class="bg-white bg-opacity-5 p-4 rounded-lg">
                    <h4 class="text-lg font-semibold text-white mb-3">Loan Summary</h4>
                    
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Principal Amount:</span>
                        <span class="text-white font-semibold">${formattedLoanAmount}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Total Interest:</span>
                        <span class="text-white font-semibold">${formattedTotalInterest}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Total Payment:</span>
                        <span class="text-white font-semibold">${formattedTotalPayment}</span>
                    </div>
                </div>
                
                <div class="mt-6">
                    <div class="bg-white bg-opacity-5 p-4 rounded-lg">
                        <h4 class="text-lg font-semibold text-white mb-3">Payment Breakdown</h4>
                        <div class="flex items-center justify-center space-x-2 mb-4">
                            <div class="w-6 h-6 rounded-full bg-purple-500"></div>
                            <span class="text-gray-300 mr-4">Principal (${Math.round(loanAmount / totalPayment * 100)}%)</span>
                            <div class="w-6 h-6 rounded-full bg-pink-500"></div>
                            <span class="text-gray-300">Interest (${Math.round(totalInterest / totalPayment * 100)}%)</span>
                        </div>
                        <div class="w-full bg-white bg-opacity-20 rounded-full h-6 overflow-hidden">
                            <div class="bg-purple-500 h-full" style="width: ${Math.round(loanAmount / totalPayment * 100)}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 text-center">
                    <button id="view-schedule-btn" class="bg-white bg-opacity-10 text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-20 transition-all duration-300">
                        <i class="fas fa-table mr-2"></i> View Complete Amortization Schedule
                    </button>
                </div>
            </div>
        `;
        
        // Add event listener to view schedule button
        document.getElementById('view-schedule-btn').addEventListener('click', function() {
            // Toggle amortization section visibility
            amortizationSection.classList.toggle('hidden');
            
            // Scroll to amortization section if visible
            if (!amortizationSection.classList.contains('hidden')) {
                amortizationSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Function to display amortization schedule
    function displayAmortizationSchedule(schedule) {
        // Show amortization section
        amortizationSection.classList.add('hidden'); // Initially hidden, will be shown when user clicks "View Schedule"
        
        // Create table HTML
        let tableHTML = `
            <table class="w-full text-sm text-white">
                <thead>
                    <tr class="bg-purple-600 bg-opacity-50">
                        <th class="py-2 px-3 text-left">Payment #</th>
                        <th class="py-2 px-3 text-left">Payment Date</th>
                        <th class="py-2 px-3 text-right">EMI</th>
                        <th class="py-2 px-3 text-right">Principal</th>
                        <th class="py-2 px-3 text-right">Interest</th>
                        <th class="py-2 px-3 text-right">Balance</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Add rows for each payment
        schedule.forEach(payment => {
            tableHTML += `
                <tr class="border-b border-white border-opacity-20 hover:bg-white hover:bg-opacity-15">
                    <td class="py-2 px-3">${payment.month}</td>
                    <td class="py-2 px-3">${payment.paymentDate}</td>
                    <td class="py-2 px-3 text-right">${formatCurrency(payment.emi)}</td>
                    <td class="py-2 px-3 text-right">${formatCurrency(payment.principal)}</td>
                    <td class="py-2 px-3 text-right">${formatCurrency(payment.interest)}</td>
                    <td class="py-2 px-3 text-right">${formatCurrency(payment.balance)}</td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        // Update amortization table
        amortizationTable.innerHTML = tableHTML;
    }
    
    // Function to show error message
    function showError(message) {
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <p class="text-red-300 text-center">${message}</p>
            </div>
        `;
        
        // Hide amortization section
        amortizationSection.classList.add('hidden');
    }
    
    // Function to reset calculator
    function resetCalculator() {
        loanAmountInput.value = '';
        interestRateInput.value = '';
        loanTermInput.value = '';
        termUnitSelect.value = 'years';
        startDateInput.valueAsDate = today;
        
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-calculator text-4xl text-white text-opacity-70 mb-4"></i>
                <p class="text-white text-opacity-80 text-center">Enter loan details and click Calculate to see the results</p>
            </div>
        `;
        
        // Hide amortization section
        amortizationSection.classList.add('hidden');
    }
    
    // Function to format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
    // Function to format date
    function formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
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