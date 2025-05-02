/**
 * Water Intake Calculator JavaScript
 * Handles water intake calculations and result display
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const unitSystemRadios = document.querySelectorAll('input[name="unit-system"]');
    const metricWeightDiv = document.getElementById('metric-weight');
    const imperialWeightDiv = document.getElementById('imperial-weight');
    const weightKgInput = document.getElementById('weight-kg');
    const weightLbsInput = document.getElementById('weight-lbs');
    const activityLevelSelect = document.getElementById('activity-level');
    const climateSelect = document.getElementById('climate');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('result');
    
    // Mobile menu functionality
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
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        });
    }
    
    // Event Listeners
    unitSystemRadios.forEach(radio => {
        radio.addEventListener('change', toggleUnitSystem);
    });
    
    calculateBtn.addEventListener('click', calculateWaterIntake);
    resetBtn.addEventListener('click', resetCalculator);
    
    // Form submission event listener
    document.getElementById('water-intake-form').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateWaterIntake();
    });
    
    // Function to toggle between metric and imperial unit systems
    function toggleUnitSystem() {
        const unitSystem = document.querySelector('input[name="unit-system"]:checked').value;
        
        if (unitSystem === 'metric') {
            metricWeightDiv.classList.remove('hidden');
            imperialWeightDiv.classList.add('hidden');
        } else {
            metricWeightDiv.classList.add('hidden');
            imperialWeightDiv.classList.remove('hidden');
        }
    }
    
    // Function to calculate water intake
    function calculateWaterIntake() {
        // Validate inputs
        if (!validateInputs()) {
            return;
        }
        
        const unitSystem = document.querySelector('input[name="unit-system"]:checked').value;
        let weight;
        
        // Get weight based on unit system
        if (unitSystem === 'metric') {
            weight = parseFloat(weightKgInput.value);
        } else {
            weight = parseFloat(weightLbsInput.value) * 0.453592; // Convert lbs to kg
        }
        
        const activityLevel = activityLevelSelect.value;
        const climate = climateSelect.value;
        const age = ageInput.value ? parseInt(ageInput.value) : null;
        const gender = genderSelect.value;
        
        // Calculate base water intake (in ml) based on weight
        // Standard formula: 30-35ml per kg of body weight
        let baseWaterIntake = weight * 33; // Using 33ml per kg as a middle value
        
        // Apply activity level adjustments
        const activityMultipliers = {
            'sedentary': 1.0,
            'light': 1.1,
            'moderate': 1.2,
            'very': 1.3,
            'extra': 1.4
        };
        
        baseWaterIntake *= activityMultipliers[activityLevel] || 1.0;
        
        // Apply climate adjustments
        const climateMultipliers = {
            'cold': 0.9,
            'temperate': 1.0,
            'warm': 1.1,
            'hot': 1.2
        };
        
        baseWaterIntake *= climateMultipliers[climate] || 1.0;
        
        // Apply age adjustments (if provided)
        if (age) {
            if (age > 65) {
                // Older adults may need slightly less water
                baseWaterIntake *= 0.95;
            } else if (age < 18) {
                // Children and teenagers may need slightly more water per kg
                baseWaterIntake *= 1.05;
            }
        }
        
        // Apply gender adjustments (if provided)
        if (gender) {
            if (gender === 'male') {
                // Men typically need slightly more water
                baseWaterIntake *= 1.05;
            } else if (gender === 'female') {
                // Women typically need slightly less water
                baseWaterIntake *= 0.95;
            }
        }
        
        // Round to nearest 50ml
        baseWaterIntake = Math.round(baseWaterIntake / 50) * 50;
        
        // Convert to liters for display
        const waterIntakeLiters = baseWaterIntake / 1000;
        
        // Convert to cups (1 cup = 237ml)
        const waterIntakeCups = baseWaterIntake / 237;
        
        // Convert to ounces (1 oz = 29.5735ml)
        const waterIntakeOunces = baseWaterIntake / 29.5735;
        
        // Display results
        displayResults(baseWaterIntake, waterIntakeLiters, waterIntakeCups, waterIntakeOunces);
    }
    
    // Function to validate inputs
    function validateInputs() {
        const unitSystem = document.querySelector('input[name="unit-system"]:checked').value;
        let weight;
        
        if (unitSystem === 'metric') {
            weight = parseFloat(weightKgInput.value);
            if (isNaN(weight) || weight < 20 || weight > 300) {
                showError('Please enter a valid weight between 20kg and 300kg');
                return false;
            }
        } else {
            weight = parseFloat(weightLbsInput.value);
            if (isNaN(weight) || weight < 40 || weight > 660) {
                showError('Please enter a valid weight between 40lbs and 660lbs');
                return false;
            }
        }
        
        if (!activityLevelSelect.value) {
            showError('Please select your activity level');
            return false;
        }
        
        if (!climateSelect.value) {
            showError('Please select your climate');
            return false;
        }
        
        // Validate optional age input if provided
        if (ageInput.value) {
            const age = parseInt(ageInput.value);
            if (isNaN(age) || age < 1 || age > 120) {
                showError('Please enter a valid age between 1 and 120');
                return false;
            }
        }
        
        return true;
    }
    
    // Function to display results
    function displayResults(waterIntakeML, waterIntakeLiters, waterIntakeCups, waterIntakeOunces) {
        // Format numbers for display
        const formattedLiters = waterIntakeLiters.toFixed(1);
        const formattedCups = Math.round(waterIntakeCups);
        const formattedOunces = Math.round(waterIntakeOunces);
        
        // Create HTML for results
        let resultsHTML = `
            <div class="text-center mb-6">
                <div class="h-24 w-24 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center transform transition-transform hover:scale-110">
                    <i class="fas fa-tint text-4xl text-white"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">Your Daily Water Intake</h3>
                <div class="text-4xl font-bold text-yellow-400 mb-2">${formattedLiters} Liters</div>
                <p class="text-white">or approximately ${formattedCups} cups / ${formattedOunces} fl oz</p>
            </div>
            
            <div class="space-y-4">
                <div class="bg-white bg-opacity-15 p-4 rounded-lg border border-white border-opacity-30 shadow-md">
                    <h4 class="text-xl font-semibold text-white mb-2">Recommended Distribution</h4>
                    <ul class="text-white space-y-2">
                        <li><i class="fas fa-sun text-yellow-400 mr-2"></i> Morning: ${Math.round(waterIntakeML * 0.3)}ml (30%)</li>
                        <li><i class="fas fa-cloud-sun text-yellow-400 mr-2"></i> Afternoon: ${Math.round(waterIntakeML * 0.5)}ml (50%)</li>
                        <li><i class="fas fa-moon text-yellow-400 mr-2"></i> Evening: ${Math.round(waterIntakeML * 0.2)}ml (20%)</li>
                    </ul>
                </div>
                
                <div class="bg-white bg-opacity-15 p-4 rounded-lg border border-white border-opacity-30 shadow-md">
                    <h4 class="text-xl font-semibold text-white mb-2">Personalized Tips</h4>
                    <ul class="text-white space-y-2">
                        <li><i class="fas fa-check-circle text-green-400 mr-2"></i> Drink about 1-2 cups of water when you wake up</li>
                        <li><i class="fas fa-check-circle text-green-400 mr-2"></i> Have a glass of water 30 minutes before each meal</li>
                        <li><i class="fas fa-check-circle text-green-400 mr-2"></i> Carry a reusable water bottle with time markers</li>
                        <li><i class="fas fa-check-circle text-green-400 mr-2"></i> Set reminders on your phone to drink water regularly</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Update the result div with the HTML
        resultDiv.innerHTML = resultsHTML;
        
        // Scroll to results
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Function to show error message
    function showError(message) {
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <p class="text-white text-center font-semibold">${message}</p>
            </div>
        `;
    }
    
    // Function to reset calculator
    function resetCalculator() {
        // Reset form
        document.getElementById('water-intake-form').reset();
        
        // Reset unit system display
        metricWeightDiv.classList.remove('hidden');
        imperialWeightDiv.classList.add('hidden');
        
        // Reset result display
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-tint text-4xl text-blue-400 mb-4"></i>
                <p class="text-white text-center">Enter your details to calculate your recommended daily water intake</p>
            </div>
        `;
    }
});

// Toggle FAQ answers function (already defined in HTML)
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (answer.style.maxHeight === '0px' || answer.style.maxHeight === '') {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    } else {
        answer.style.maxHeight = '0px';
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    }
}