/**
 * Basic Calculator JavaScript
 * Handles basic arithmetic operations with proper order of precedence
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const display = document.getElementById('calc-display');
    const history = document.getElementById('calc-history');
    const numberButtons = document.querySelectorAll('.calc-number');
    const operationButtons = document.querySelectorAll('.calc-operation');
    const equalsButton = document.querySelector('.calc-equals');
    const clearButton = document.querySelector('.calc-clear');
    
    // Calculator State
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;
    let calculationPerformed = false;
    
    // Initialize display
    updateDisplay();
    
    // Update the calculator display
    function updateDisplay() {
        // Format large numbers with commas but keep decimal places
        let displayValue = currentInput;
        
        // Handle display overflow
        if (displayValue.length > 12) {
            // If number is very large, use scientific notation
            if (parseFloat(displayValue) > 999999999999 || parseFloat(displayValue) < -999999999999) {
                displayValue = parseFloat(displayValue).toExponential(6);
            } else {
                // Otherwise truncate with ellipsis
                displayValue = displayValue.substring(0, 12) + '...';
            }
        }
        
        display.textContent = displayValue;
    }
    
    // Update the calculation history display
    function updateHistory(text) {
        history.textContent = text;
    }
    
    // Handle number button clicks
    function inputNumber(number) {
        if (shouldResetDisplay || currentInput === '0' || calculationPerformed) {
            currentInput = number;
            shouldResetDisplay = false;
            calculationPerformed = false;
        } else {
            // Prevent multiple decimal points
            if (number === '.' && currentInput.includes('.')) return;
            
            // Limit input length to prevent overflow
            if (currentInput.length < 15) {
                currentInput += number;
            }
        }
        updateDisplay();
    }
    
    // Handle operation button clicks
    function handleOperation(op) {
        // Handle special operations
        if (op === 'backspace') {
            handleBackspace();
            return;
        }
        
        if (op === '+/-') {
            handleToggleSign();
            return;
        }
        
        // Convert string to number for calculations
        const currentValue = parseFloat(currentInput);
        
        // If there's a pending operation, perform it
        if (operation !== null && !shouldResetDisplay) {
            const previousValue = parseFloat(previousInput);
            const result = calculate(previousValue, currentValue, operation);
            
            currentInput = String(result);
            calculationPerformed = true;
            updateDisplay();
        }
        
        // Store current input and operation for next calculation
        previousInput = currentInput;
        operation = op;
        shouldResetDisplay = true;
        
        // Update history display
        updateHistory(`${previousInput} ${getOperationSymbol(op)}`);
    }
    
    // Get the display symbol for an operation
    function getOperationSymbol(op) {
        switch(op) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return op;
        }
    }
    
    // Handle equals button click
    function handleEquals() {
        // If no operation is set, just return
        if (operation === null) return;
        
        // Convert strings to numbers for calculation
        const currentValue = parseFloat(currentInput);
        const previousValue = parseFloat(previousInput);
        
        // Perform the calculation
        const result = calculate(previousValue, currentValue, operation);
        
        // Update history to show the full calculation
        updateHistory(`${previousInput} ${getOperationSymbol(operation)} ${currentInput} =`);
        
        // Update the display with the result
        currentInput = String(result);
        operation = null;
        shouldResetDisplay = true;
        calculationPerformed = true;
        updateDisplay();
    }
    
    // Perform calculation based on operation
    function calculate(a, b, operation) {
        switch(operation) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                // Handle division by zero
                if (b === 0) {
                    alert('Cannot divide by zero');
                    return 0;
                }
                return a / b;
            default:
                return b;
        }
    }
    
    // Handle backspace button
    function handleBackspace() {
        if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
            currentInput = '0';
        } else {
            currentInput = currentInput.slice(0, -1);
        }
        updateDisplay();
    }
    
    // Handle +/- button to toggle sign
    function handleToggleSign() {
        if (currentInput !== '0') {
            if (currentInput.startsWith('-')) {
                currentInput = currentInput.substring(1);
            } else {
                currentInput = '-' + currentInput;
            }
            updateDisplay();
        }
    }
    
    // Handle clear button
    function handleClear() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        shouldResetDisplay = false;
        calculationPerformed = false;
        updateDisplay();
        updateHistory('');
    }
    
    // Event Listeners
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            inputNumber(button.textContent);
        });
    });
    
    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const op = button.dataset.op || button.textContent;
            handleOperation(op);
        });
    });
    
    equalsButton.addEventListener('click', handleEquals);
    clearButton.addEventListener('click', handleClear);
    
    // Keyboard support
    document.addEventListener('keydown', (event) => {
        // Numbers 0-9 and decimal point
        if (/^[0-9.]$/.test(event.key)) {
            inputNumber(event.key);
        }
        
        // Operations
        if (['+', '-', '*', '/'].includes(event.key)) {
            handleOperation(event.key);
        }
        
        // Equals (Enter or =)
        if (event.key === 'Enter' || event.key === '=') {
            handleEquals();
        }
        
        // Clear (Escape or Delete)
        if (event.key === 'Escape' || event.key === 'Delete') {
            handleClear();
        }
        
        // Backspace
        if (event.key === 'Backspace') {
            handleBackspace();
        }
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