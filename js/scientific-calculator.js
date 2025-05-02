/**
 * Scientific Calculator JavaScript
 * Handles advanced mathematical operations including trigonometry, logarithms, and exponents
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const display = document.getElementById('calc-display');
    const history = document.getElementById('calc-history');
    const numberButtons = document.querySelectorAll('.calc-number');
    const operationButtons = document.querySelectorAll('.calc-operation');
    const functionButtons = document.querySelectorAll('.function-btn');
    const constantButtons = document.querySelectorAll('.constant-btn');
    const memoryButtons = document.querySelectorAll('.memory-btn');
    const equalsButton = document.querySelector('.calc-equals');
    const clearButton = document.querySelector('.calc-clear');
    const degButton = document.getElementById('deg-mode');
    const radButton = document.getElementById('rad-mode');
    const memoryDisplay = document.getElementById('memory-display');
    
    // Calculator State
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;
    let calculationPerformed = false;
    let memoryValue = 0;
    let isRadianMode = false;
    let expressionStack = [];
    let parenCount = 0;
    
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
        expressionStack = [];
        parenCount = 0;
        updateDisplay();
        updateHistory('');
    }
    
    // Handle scientific functions
    function handleFunction(func) {
        // Get current value as number
        const value = parseFloat(currentInput);
        let result;
        
        // Handle different functions
        switch(func) {
            case 'sin':
                result = isRadianMode ? Math.sin(value) : Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = isRadianMode ? Math.cos(value) : Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = isRadianMode ? Math.tan(value) : Math.tan(value * Math.PI / 180);
                break;
            case 'asin':
                result = isRadianMode ? Math.asin(value) : Math.asin(value) * 180 / Math.PI;
                break;
            case 'acos':
                result = isRadianMode ? Math.acos(value) : Math.acos(value) * 180 / Math.PI;
                break;
            case 'atan':
                result = isRadianMode ? Math.atan(value) : Math.atan(value) * 180 / Math.PI;
                break;
            case 'log':
                if (value <= 0) {
                    alert('Cannot calculate logarithm of zero or negative number');
                    return;
                }
                result = Math.log10(value);
                break;
            case 'ln':
                if (value <= 0) {
                    alert('Cannot calculate natural logarithm of zero or negative number');
                    return;
                }
                result = Math.log(value);
                break;
            case '10^x':
                result = Math.pow(10, value);
                break;
            case 'e^x':
                result = Math.exp(value);
                break;
            case 'sqrt':
                if (value < 0) {
                    alert('Cannot calculate square root of negative number');
                    return;
                }
                result = Math.sqrt(value);
                break;
            case 'square':
                result = Math.pow(value, 2);
                break;
            case 'cube':
                result = Math.pow(value, 3);
                break;
            case 'pow':
                // Store the base and wait for the exponent
                previousInput = currentInput;
                operation = 'pow';
                shouldResetDisplay = true;
                updateHistory(`${previousInput} ^`);
                return;
            case '1/x':
                if (value === 0) {
                    alert('Cannot divide by zero');
                    return;
                }
                result = 1 / value;
                break;
            case 'abs':
                result = Math.abs(value);
                break;
            case 'fact':
                if (value < 0 || !Number.isInteger(value)) {
                    alert('Factorial is only defined for non-negative integers');
                    return;
                }
                result = factorial(value);
                break;
            case 'mod':
                // Store the value and wait for the modulus
                previousInput = currentInput;
                operation = 'mod';
                shouldResetDisplay = true;
                updateHistory(`${previousInput} mod`);
                return;
            case '(':
                // Handle opening parenthesis
                expressionStack.push({
                    value: parseFloat(currentInput),
                    operation: operation
                });
                parenCount++;
                operation = null;
                shouldResetDisplay = true;
                updateHistory(history.textContent + ' (');
                return;
            case ')':
                // Handle closing parenthesis
                if (parenCount > 0) {
                    const lastExpression = expressionStack.pop();
                    parenCount--;
                    
                    // Calculate the result inside parentheses
                    if (operation !== null) {
                        const currentValue = parseFloat(currentInput);
                        const previousValue = parseFloat(previousInput);
                        result = calculate(previousValue, currentValue, operation);
                    } else {
                        result = parseFloat(currentInput);
                    }
                    
                    // Apply the result to the outer expression
                    if (lastExpression.operation !== null) {
                        result = calculate(lastExpression.value, result, lastExpression.operation);
                    }
                    
                    operation = null;
                    updateHistory(history.textContent + ' )');
                } else {
                    // No matching opening parenthesis
                    return;
                }
                break;
            default:
                return;
        }
        
        // Update display with the result
        currentInput = String(result);
        calculationPerformed = true;
        updateDisplay();
    }
    
    // Calculate factorial
    function factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
            // Check for overflow
            if (!isFinite(result)) break;
        }
        return result;
    }
    
    // Handle constants
    function handleConstant(constant) {
        switch(constant) {
            case 'pi':
                currentInput = String(Math.PI);
                break;
            case 'e':
                currentInput = String(Math.E);
                break;
            default:
                return;
        }
        calculationPerformed = true;
        updateDisplay();
    }
    
    // Handle memory functions
    function handleMemory(action) {
        const currentValue = parseFloat(currentInput);
        
        switch(action) {
            case 'mc': // Memory Clear
                memoryValue = 0;
                memoryDisplay.classList.add('hidden');
                break;
            case 'mr': // Memory Recall
                currentInput = String(memoryValue);
                calculationPerformed = true;
                updateDisplay();
                break;
            case 'm+': // Memory Add
                memoryValue += currentValue;
                memoryDisplay.classList.remove('hidden');
                break;
            case 'm-': // Memory Subtract
                memoryValue -= currentValue;
                memoryDisplay.classList.remove('hidden');
                break;
            case 'ms': // Memory Store
                memoryValue = currentValue;
                memoryDisplay.classList.remove('hidden');
                break;
            default:
                return;
        }
    }
    
    // Toggle between degrees and radians mode
    function toggleAngleMode() {
        isRadianMode = !isRadianMode;
        
        if (isRadianMode) {
            degButton.classList.remove('active', 'bg-indigo-600');
            degButton.classList.add('bg-indigo-400');
            radButton.classList.add('active', 'bg-indigo-600');
            radButton.classList.remove('bg-indigo-400');
        } else {
            radButton.classList.remove('active', 'bg-indigo-600');
            radButton.classList.add('bg-indigo-400');
            degButton.classList.add('active', 'bg-indigo-600');
            degButton.classList.remove('bg-indigo-400');
        }
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
    
    functionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const func = button.dataset.func;
            handleFunction(func);
        });
    });
    
    constantButtons.forEach(button => {
        button.addEventListener('click', () => {
            const constant = button.dataset.const;
            handleConstant(constant);
        });
    });
    
    memoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            handleMemory(action);
        });
    });
    
    equalsButton.addEventListener('click', handleEquals);
    clearButton.addEventListener('click', handleClear);
    
    // Angle mode toggle
    degButton.addEventListener('click', () => {
        if (isRadianMode) toggleAngleMode();
    });
    
    radButton.addEventListener('click', () => {
        if (!isRadianMode) toggleAngleMode();
    });
    
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
        
        // Parentheses
        if (event.key === '(') {
            handleFunction('(');
        }
        if (event.key === ')') {
            handleFunction(')');
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