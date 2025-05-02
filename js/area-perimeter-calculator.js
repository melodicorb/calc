document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabs = ['square', 'rectangle', 'circle', 'triangle'];
    
    tabs.forEach(tab => {
        document.getElementById(`tab-${tab}`).addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => {
                document.getElementById(`tab-${t}`).classList.remove('tab-active');
                document.getElementById(`calc-${t}`).classList.add('hidden');
            });
            
            // Add active class to clicked tab
            this.classList.add('tab-active');
            document.getElementById(`calc-${tab}`).classList.remove('hidden');
        });
    });
    
    // Square calculation
    document.getElementById('calculate-square-btn').addEventListener('click', function() {
        const side = parseFloat(document.getElementById('square-side').value);
        
        if (isNaN(side) || side <= 0) {
            showError('Please enter a valid positive number for the side length.');
            return;
        }
        
        const area = side * side;
        const perimeter = 4 * side;
        
        displayResult('Square', {
            'Side Length': formatNumber(side),
            'Area': formatNumber(area),
            'Perimeter': formatNumber(perimeter)
        });
    });
    
    // Rectangle calculation
    document.getElementById('calculate-rectangle-btn').addEventListener('click', function() {
        const length = parseFloat(document.getElementById('rectangle-length').value);
        const width = parseFloat(document.getElementById('rectangle-width').value);
        
        if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
            showError('Please enter valid positive numbers for length and width.');
            return;
        }
        
        const area = length * width;
        const perimeter = 2 * (length + width);
        
        displayResult('Rectangle', {
            'Length': formatNumber(length),
            'Width': formatNumber(width),
            'Area': formatNumber(area),
            'Perimeter': formatNumber(perimeter)
        });
    });
    
    // Circle calculation
    document.getElementById('calculate-circle-btn').addEventListener('click', function() {
        const radius = parseFloat(document.getElementById('circle-radius').value);
        
        if (isNaN(radius) || radius <= 0) {
            showError('Please enter a valid positive number for the radius.');
            return;
        }
        
        const area = Math.PI * radius * radius;
        const circumference = 2 * Math.PI * radius;
        
        displayResult('Circle', {
            'Radius': formatNumber(radius),
            'Area': formatNumber(area),
            'Circumference': formatNumber(circumference)
        });
    });
    
    // Triangle calculation
    document.getElementById('calculate-triangle-btn').addEventListener('click', function() {
        const side1 = parseFloat(document.getElementById('triangle-side1').value);
        const side2 = parseFloat(document.getElementById('triangle-side2').value);
        const side3 = parseFloat(document.getElementById('triangle-side3').value);
        
        if (isNaN(side1) || isNaN(side2) || isNaN(side3) || side1 <= 0 || side2 <= 0 || side3 <= 0) {
            showError('Please enter valid positive numbers for all sides.');
            return;
        }
        
        // Check if triangle is valid
        if (side1 + side2 <= side3 || side1 + side3 <= side2 || side2 + side3 <= side1) {
            showError('The sides do not form a valid triangle. The sum of any two sides must be greater than the third side.');
            return;
        }
        
        const perimeter = side1 + side2 + side3;
        const s = perimeter / 2; // Semi-perimeter
        const area = Math.sqrt(s * (s - side1) * (s - side2) * (s - side3)); // Heron's formula
        
        displayResult('Triangle', {
            'Side 1': formatNumber(side1),
            'Side 2': formatNumber(side2),
            'Side 3': formatNumber(side3),
            'Area': formatNumber(area),
            'Perimeter': formatNumber(perimeter)
        });
    });
    
    // Helper functions
    function showError(message) {
        const resultDiv = document.getElementById('area-perimeter-result');
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <p class="text-red-300 text-center">${message}</p>
            </div>
        `;
    }
    
    function displayResult(shape, results) {
        const resultDiv = document.getElementById('area-perimeter-result');
        let resultHTML = `
            <div class="text-center mb-4">
                <h3 class="text-xl font-bold text-white">${shape} Results</h3>
            </div>
            <div class="space-y-3">
        `;
        
        for (const [key, value] of Object.entries(results)) {
            resultHTML += `
                <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2">
                    <span class="text-gray-300">${key}:</span>
                    <span class="text-white font-semibold">${value}</span>
                </div>
            `;
        }
        
        resultHTML += `</div>`;
        resultDiv.innerHTML = resultHTML;
    }
    
    function formatNumber(num) {
        return num.toFixed(2);
    }
});