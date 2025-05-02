/**
 * Currency Converter JavaScript
 * Handles currency conversion and exchange rate table generation
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const swapBtn = document.getElementById('swap-btn');
    const convertBtn = document.getElementById('convert-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('result');
    const exchangeRateTable = document.getElementById('exchange-rate-table');
    
    // Exchange rates (fixed rates relative to USD for demonstration)
    const exchangeRates = {
        USD: 1.00,    // US Dollar (base currency)
        EUR: 0.85,    // Euro
        GBP: 0.75,    // British Pound
        JPY: 110.25,  // Japanese Yen
        CAD: 1.25,    // Canadian Dollar
        AUD: 1.35,    // Australian Dollar
        CHF: 0.92,    // Swiss Franc
        CNY: 6.45,    // Chinese Yuan
        INR: 74.50,   // Indian Rupee
        MXN: 20.15    // Mexican Peso
    };
    
    // Currency symbols for display
    const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        CAD: 'C$',
        AUD: 'A$',
        CHF: 'CHF',
        CNY: '¥',
        INR: '₹',
        MXN: 'Mex$'
    };
    
    // Event Listeners
    convertBtn.addEventListener('click', convertCurrency);
    resetBtn.addEventListener('click', resetConverter);
    swapBtn.addEventListener('click', swapCurrencies);
    
    // Form submission event listener
    document.getElementById('currency-converter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        convertCurrency();
    });
    
    // Initialize exchange rate table
    initializeExchangeRateTable();
    
    // Function to convert currency
    function convertCurrency() {
        // Get input values
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        // Validate input
        if (isNaN(amount) || amount <= 0) {
            showError('Please enter a valid amount greater than zero');
            return;
        }
        
        // Convert to USD first (as base currency), then to target currency
        const amountInUSD = amount / exchangeRates[fromCurrency];
        const convertedAmount = amountInUSD * exchangeRates[toCurrency];
        
        // Calculate exchange rate between the two currencies
        const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
        
        // Display result
        displayResult(amount, fromCurrency, convertedAmount, toCurrency, rate);
    }
    
    // Function to display conversion result
    function displayResult(amount, fromCurrency, convertedAmount, toCurrency, rate) {
        // Format numbers for display
        const formattedAmount = formatCurrency(amount, fromCurrency);
        const formattedConvertedAmount = formatCurrency(convertedAmount, toCurrency);
        
        resultDiv.innerHTML = `
            <div class="animate-fade-in">
                <h3 class="text-xl font-semibold text-white mb-4">Conversion Result</h3>
                
                <div class="bg-white bg-opacity-20 p-4 rounded-lg mb-6">
                    <div class="flex justify-between items-center border-b border-white border-opacity-30 pb-2 mb-2">
                        <span class="text-white font-medium">Amount:</span>
                        <span class="text-white font-semibold">${formattedAmount}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-30 pb-2 mb-2">
                        <span class="text-white font-medium">From Currency:</span>
                        <span class="text-white font-semibold">${fromCurrency}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-30 pb-2 mb-2">
                        <span class="text-white font-medium">To Currency:</span>
                        <span class="text-white font-semibold">${toCurrency}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-white font-medium">Exchange Rate:</span>
                        <span class="text-white font-semibold">1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}</span>
                    </div>
                </div>
                
                <div class="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6 mb-6 text-center">
                    <h4 class="text-lg font-semibold text-white mb-2">Converted Amount</h4>
                    <p class="text-3xl font-bold text-white">${formattedConvertedAmount}</p>
                </div>
                
                <div class="bg-white bg-opacity-20 p-4 rounded-lg">
                    <h4 class="text-lg font-semibold text-white mb-3">Common Conversions</h4>
                    
                    <div class="flex justify-between items-center border-b border-white border-opacity-30 pb-2 mb-2">
                        <span class="text-white">10 ${fromCurrency}:</span>
                        <span class="text-white font-semibold">${formatCurrency(10 * rate, toCurrency)}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-30 pb-2 mb-2">
                        <span class="text-white">50 ${fromCurrency}:</span>
                        <span class="text-white font-semibold">${formatCurrency(50 * rate, toCurrency)}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-30 pb-2 mb-2">
                        <span class="text-white">100 ${fromCurrency}:</span>
                        <span class="text-white font-semibold">${formatCurrency(100 * rate, toCurrency)}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-white">500 ${fromCurrency}:</span>
                        <span class="text-white font-semibold">${formatCurrency(500 * rate, toCurrency)}</span>
                    </div>
                </div>
                
                <div class="mt-6 text-center">
                    <button id="new-conversion-btn" class="bg-white bg-opacity-10 text-white font-semibold py-2 px-6 rounded-lg hover:bg-opacity-20 transition-all duration-300">
                        <i class="fas fa-sync-alt mr-2"></i> New Conversion
                    </button>
                </div>
            </div>
        `;
        
        // Add event listener to new conversion button
        document.getElementById('new-conversion-btn').addEventListener('click', function() {
            resetConverter(false); // Reset without clearing inputs
        });
    }
    
    // Function to initialize exchange rate table
    function initializeExchangeRateTable() {
        let tableHTML = '';
        
        // Create rows for each currency
        Object.keys(exchangeRates).forEach(currency => {
            if (currency !== 'USD' && currency !== 'EUR' && currency !== 'GBP') {
                tableHTML += `
                    <tr class="border-b border-white border-opacity-40 hover:bg-purple-700 hover:bg-opacity-50">
                        <td class="py-2 px-3 font-medium">${currency}</td>
                        <td class="py-2 px-3 text-right">${(exchangeRates[currency]).toFixed(4)}</td>
                        <td class="py-2 px-3 text-right">${(exchangeRates[currency] / exchangeRates['EUR']).toFixed(4)}</td>
                        <td class="py-2 px-3 text-right">${(exchangeRates[currency] / exchangeRates['GBP']).toFixed(4)}</td>
                    </tr>
                `;
            }
        });
        
        // Add USD, EUR, GBP rows at the top
        tableHTML = `
            <tr class="border-b border-white border-opacity-30 hover:bg-white hover:bg-opacity-15">
                <td class="py-2 px-3 font-medium">USD</td>
                <td class="py-2 px-3 text-right">1.0000</td>
                <td class="py-2 px-3 text-right">${(1 / exchangeRates['EUR']).toFixed(4)}</td>
                <td class="py-2 px-3 text-right">${(1 / exchangeRates['GBP']).toFixed(4)}</td>
            </tr>
            <tr class="border-b border-white border-opacity-30 hover:bg-white hover:bg-opacity-15">
                <td class="py-2 px-3 font-medium">EUR</td>
                <td class="py-2 px-3 text-right">${(exchangeRates['EUR']).toFixed(4)}</td>
                <td class="py-2 px-3 text-right">1.0000</td>
                <td class="py-2 px-3 text-right">${(exchangeRates['EUR'] / exchangeRates['GBP']).toFixed(4)}</td>
            </tr>
            <tr class="border-b border-white border-opacity-30 hover:bg-white hover:bg-opacity-15">
                <td class="py-2 px-3 font-medium">GBP</td>
                <td class="py-2 px-3 text-right">${(exchangeRates['GBP']).toFixed(4)}</td>
                <td class="py-2 px-3 text-right">${(exchangeRates['GBP'] / exchangeRates['EUR']).toFixed(4)}</td>
                <td class="py-2 px-3 text-right">1.0000</td>
            </tr>
        ` + tableHTML;
        
        // Update exchange rate table
        exchangeRateTable.innerHTML = tableHTML;
    }
    
    // Function to swap currencies
    function swapCurrencies() {
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        fromCurrencySelect.value = toCurrency;
        toCurrencySelect.value = fromCurrency;
        
        // If there's a value in the amount input, recalculate
        if (amountInput.value.trim() !== '') {
            convertCurrency();
        }
    }
    
    // Function to reset converter
    function resetConverter(clearInputs = true) {
        if (clearInputs) {
            amountInput.value = '';
            fromCurrencySelect.value = 'USD';
            toCurrencySelect.value = 'EUR';
        }
        
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-exchange-alt text-4xl text-yellow-300 mb-4"></i>
                <p class="text-white font-medium text-center">Enter amount and select currencies to see the conversion result</p>
            </div>
        `;
    }
    
    // Function to show error message
    function showError(message) {
        resultDiv.innerHTML = `
            <div class="animate-fade-in">
                <div class="bg-red-500 bg-opacity-40 p-4 rounded-lg border border-red-500 border-opacity-50">
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-circle text-white text-2xl mr-3"></i>
                        <p class="text-white font-medium">${message}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Function to format currency
    function formatCurrency(amount, currencyCode) {
        const symbol = currencySymbols[currencyCode] || '';
        
        // Special formatting for JPY (no decimal places)
        if (currencyCode === 'JPY') {
            return `${symbol}${Math.round(amount).toLocaleString()}`;
        }
        
        return `${symbol}${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }
});