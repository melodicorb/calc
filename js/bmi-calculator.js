/**
 * BMI Calculator JavaScript
 * Handles BMI calculations and result display
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const unitSystemRadios = document.querySelectorAll('input[name="unit-system"]');
    const metricInputs = document.getElementById('metric-inputs');
    const imperialInputs = document.getElementById('imperial-inputs');
    const heightCmInput = document.getElementById('height-cm');
    const weightKgInput = document.getElementById('weight-kg');
    const heightFtInput = document.getElementById('height-ft');
    const heightInInput = document.getElementById('height-in');
    const weightLbsInput = document.getElementById('weight-lbs');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('result');
    
    // Event Listeners
    unitSystemRadios.forEach(radio => {
        radio.addEventListener('change', toggleUnitSystem);
    });
    
    calculateBtn.addEventListener('click', calculateBMI);
    resetBtn.addEventListener('click', resetCalculator);
    
    // Form submission event listener
    document.getElementById('bmi-form').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateBMI();
    });
    
    // Function to toggle between metric and imperial unit systems
    function toggleUnitSystem() {
        const unitSystem = document.querySelector('input[name="unit-system"]:checked').value;
        
        if (unitSystem === 'metric') {
            metricInputs.classList.remove('hidden');
            imperialInputs.classList.add('hidden');
        } else {
            metricInputs.classList.add('hidden');
            imperialInputs.classList.remove('hidden');
        }
    }
    
    // Function to calculate BMI
    function calculateBMI() {
        const unitSystem = document.querySelector('input[name="unit-system"]:checked').value;
        let height, weight, bmi;
        
        // Get height and weight based on unit system
        if (unitSystem === 'metric') {
            // Validate metric inputs
            if (!validateMetricInputs()) {
                return;
            }
            
            height = parseFloat(heightCmInput.value) / 100; // Convert cm to meters
            weight = parseFloat(weightKgInput.value);
            
            // Calculate BMI using metric formula: weight (kg) / height^2 (m)
            bmi = weight / (height * height);
        } else {
            // Validate imperial inputs
            if (!validateImperialInputs()) {
                return;
            }
            
            const heightFt = parseFloat(heightFtInput.value);
            const heightIn = parseFloat(heightInInput.value);
            const totalHeightInches = (heightFt * 12) + heightIn;
            weight = parseFloat(weightLbsInput.value);
            
            // Calculate BMI using imperial formula: (weight (lbs) / height^2 (in)) * 703
            bmi = (weight / (totalHeightInches * totalHeightInches)) * 703;
        }
        
        // Round BMI to 1 decimal place
        bmi = Math.round(bmi * 10) / 10;
        
        // Get BMI category and recommendations
        const bmiCategory = getBMICategory(bmi);
        const recommendations = getRecommendations(bmi, bmiCategory);
        
        // Display results
        displayResults(bmi, bmiCategory, recommendations);
    }
    
    // Function to validate metric inputs
    function validateMetricInputs() {
        const height = parseFloat(heightCmInput.value);
        const weight = parseFloat(weightKgInput.value);
        
        if (isNaN(height) || isNaN(weight)) {
            showError('Please enter valid numbers for height and weight');
            return false;
        }
        
        if (height < 50 || height > 300) {
            showError('Please enter a valid height between 50cm and 300cm');
            return false;
        }
        
        if (weight < 20 || weight > 500) {
            showError('Please enter a valid weight between 20kg and 500kg');
            return false;
        }
        
        return true;
    }
    
    // Function to validate imperial inputs
    function validateImperialInputs() {
        const heightFt = parseFloat(heightFtInput.value);
        const heightIn = parseFloat(heightInInput.value);
        const weight = parseFloat(weightLbsInput.value);
        
        if (isNaN(heightFt) || isNaN(heightIn) || isNaN(weight)) {
            showError('Please enter valid numbers for height and weight');
            return false;
        }
        
        if (heightFt < 1 || heightFt > 8) {
            showError('Please enter a valid height between 1ft and 8ft');
            return false;
        }
        
        if (heightIn < 0 || heightIn > 11) {
            showError('Please enter a valid inch value between 0 and 11');
            return false;
        }
        
        if (weight < 40 || weight > 1000) {
            showError('Please enter a valid weight between 40lbs and 1000lbs');
            return false;
        }
        
        return true;
    }
    
    // Function to get BMI category based on BMI value
    function getBMICategory(bmi) {
        if (bmi < 18.5) {
            return {
                name: 'Underweight',
                color: 'blue-500'
            };
        } else if (bmi >= 18.5 && bmi < 25) {
            return {
                name: 'Normal weight',
                color: 'green-500'
            };
        } else if (bmi >= 25 && bmi < 30) {
            return {
                name: 'Overweight',
                color: 'yellow-500'
            };
        } else if (bmi >= 30 && bmi < 35) {
            return {
                name: 'Obesity (Class 1)',
                color: 'orange-500'
            };
        } else if (bmi >= 35 && bmi < 40) {
            return {
                name: 'Obesity (Class 2)',
                color: 'red-500'
            };
        } else {
            return {
                name: 'Obesity (Class 3)',
                color: 'red-700'
            };
        }
    }
    
    // Function to get health recommendations based on BMI category
    function getRecommendations(bmi, category) {
        const age = parseInt(ageInput.value) || null;
        const gender = genderSelect.value || null;
        
        let recommendations = [];
        
        // General recommendations based on BMI category
        if (bmi < 18.5) {
            recommendations = [
                'Consider consulting with a healthcare provider about healthy weight gain strategies',
                'Focus on nutrient-dense foods that provide healthy calories',
                'Include strength training to build muscle mass',
                'Aim for balanced meals with adequate protein intake'
            ];
        } else if (bmi >= 18.5 && bmi < 25) {
            recommendations = [
                'Maintain your healthy weight with a balanced diet',
                'Stay physically active with regular exercise',
                'Continue regular health check-ups',
                'Focus on overall wellness and disease prevention'
            ];
        } else if (bmi >= 25 && bmi < 30) {
            recommendations = [
                'Consider moderate weight loss through improved diet and increased physical activity',
                'Aim for 150 minutes of moderate exercise per week',
                'Focus on portion control and reducing processed foods',
                'Monitor other health markers like blood pressure and cholesterol'
            ];
        } else {
            recommendations = [
                'Seek medical advice for a comprehensive weight management plan',
                'Consider consulting with a registered dietitian',
                'Start with modest, sustainable lifestyle changes',
                'Regular monitoring of health markers is important',
                'Focus on health improvements rather than just weight loss'
            ];
        }
        
        // Add age-specific recommendations if age is provided
        if (age !== null) {
            if (age < 18) {
                recommendations.push('As you are under 18, consult with a pediatrician for age-appropriate advice');
            } else if (age > 65) {
                recommendations.push('For seniors, focus on maintaining muscle mass and bone density alongside weight management');
            }
        }
        
        return recommendations;
    }
    
    // Function to display BMI results
    function displayResults(bmi, category, recommendations) {
        const unitSystem = document.querySelector('input[name="unit-system"]:checked').value;
        
        // Get input values for display
        let heightDisplay, weightDisplay;
        
        if (unitSystem === 'metric') {
            heightDisplay = heightCmInput.value + ' cm';
            weightDisplay = weightKgInput.value + ' kg';
        } else {
            heightDisplay = heightFtInput.value + ' ft ' + heightInInput.value + ' in';
            weightDisplay = weightLbsInput.value + ' lbs';
        }
        
        // Create recommendations HTML
        let recommendationsHTML = '';
        recommendations.forEach(rec => {
            recommendationsHTML += `<li class="mb-2"><i class="fas fa-check-circle text-${category.color} mr-2"></i>${rec}</li>`;
        });
        
        // Create BMI scale indicator
        const scalePosition = Math.min(Math.max((bmi - 10) / 40, 0), 1) * 100;
        
        resultDiv.innerHTML = `
            <div class="animate-fade-in">
                <h3 class="text-xl font-semibold text-white mb-4">Your BMI Results</h3>
                
                <div class="bg-white bg-opacity-5 p-4 rounded-lg mb-6">
                    <div class="flex justify-between items-center border-b border-white border-opacity-10 pb-2 mb-2">
                        <span class="text-gray-300">Height:</span>
                        <span class="text-white font-semibold">${heightDisplay}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">Weight:</span>
                        <span class="text-white font-semibold">${weightDisplay}</span>
                    </div>
                </div>
                
                <div class="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 mb-6 text-center">
                    <h4 class="text-lg font-semibold text-white mb-2">Your BMI</h4>
                    <p class="text-3xl font-bold text-white">${bmi}</p>
                    <p class="text-white font-semibold mt-2">${category.name}</p>
                </div>
                
                <div class="mb-6">
                    <h4 class="text-lg font-semibold text-white mb-3">BMI Scale</h4>
                    <div class="relative h-8 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-700 rounded-full overflow-hidden">
                        <div class="absolute h-full w-1 bg-white" style="left: ${scalePosition}%; transform: translateX(-50%);"></div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-300 mt-1">
                        <span>Underweight</span>
                        <span>Normal</span>
                        <span>Overweight</span>
                        <span>Obese</span>
                    </div>
                </div>
                
                <div class="bg-white bg-opacity-5 p-4 rounded-lg">
                    <h4 class="text-lg font-semibold text-white mb-3">Health Recommendations</h4>
                    <ul class="text-gray-200">
                        ${recommendationsHTML}
                    </ul>
                    <p class="mt-4 text-yellow-400 text-sm">
                        <i class="fas fa-exclamation-triangle mr-2"></i> These are general recommendations. Always consult with healthcare professionals for personalized advice.
                    </p>
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
        document.getElementById('bmi-form').reset();
        
        // Reset to metric system
        document.querySelector('input[name="unit-system"][value="metric"]').checked = true;
        toggleUnitSystem();
        
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-weight text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-300 text-center">Enter your height and weight to calculate your BMI</p>
            </div>
        `;
    }
});