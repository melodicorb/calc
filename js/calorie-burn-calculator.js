/**
 * Calorie Burn Calculator JavaScript
 * Handles calorie burn calculations and result display
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const unitSystemRadios = document.querySelectorAll('input[name="unit-system"]');
    const metricWeightDiv = document.getElementById('metric-weight');
    const imperialWeightDiv = document.getElementById('imperial-weight');
    const weightKgInput = document.getElementById('weight-kg');
    const weightLbsInput = document.getElementById('weight-lbs');
    const activityTypeSelect = document.getElementById('activity-type');
    const durationInput = document.getElementById('duration');
    const durationUnitSelect = document.getElementById('duration-unit');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('result');
    
    // MET values for different activities
    const metValues = {
        // Light Intensity Activities
        walking_slow: 2.0,        // Walking 2 mph
        walking_moderate: 3.0,    // Walking 3 mph
        cycling_light: 4.0,       // Cycling light effort
        swimming_light: 4.5,      // Swimming light effort
        yoga: 2.5,                // Yoga
        stretching: 2.3,          // Stretching
        
        // Moderate Intensity Activities
        walking_brisk: 4.3,       // Walking 4 mph
        hiking: 5.3,              // Hiking
        cycling_moderate: 6.8,    // Cycling moderate effort
        swimming_moderate: 5.8,   // Swimming moderate effort
        dancing: 4.8,             // Dancing
        aerobics: 6.0,            // Aerobics
        weight_training: 3.5,     // Weight training
        
        // Vigorous Intensity Activities
        running_5mph: 8.3,        // Running 5 mph
        running_6mph: 9.8,        // Running 6 mph
        running_7mph: 11.0,       // Running 7 mph
        running_8mph: 11.8,       // Running 8 mph
        cycling_vigorous: 8.0,    // Cycling vigorous
        swimming_vigorous: 8.0,   // Swimming vigorous
        hiit: 8.0,                // HIIT
        jump_rope: 10.0,          // Jump rope
        
        // Sports
        basketball: 6.5,          // Basketball
        football: 8.0,            // Football
        soccer: 7.0,              // Soccer
        tennis: 7.3,              // Tennis
        volleyball: 4.0,          // Volleyball
        
        // Daily Activities
        housework: 3.3,           // Housework
        gardening: 3.8,           // Gardening
        shopping: 2.3,            // Shopping
        cooking: 2.0              // Cooking
    };
    
    // Activity intensity categories
    const activityCategories = {
        light: ['walking_slow', 'walking_moderate', 'yoga', 'stretching', 'shopping', 'cooking'],
        moderate: ['walking_brisk', 'cycling_light', 'swimming_light', 'dancing', 'weight_training', 'housework', 'gardening', 'volleyball'],
        vigorous: ['hiking', 'cycling_moderate', 'swimming_moderate', 'aerobics', 'basketball', 'tennis', 'soccer'],
        very_vigorous: ['running_5mph', 'running_6mph', 'running_7mph', 'running_8mph', 'cycling_vigorous', 'swimming_vigorous', 'hiit', 'jump_rope', 'football']
    };
    
    // Event Listeners
    unitSystemRadios.forEach(radio => {
        radio.addEventListener('change', toggleUnitSystem);
    });
    
    calculateBtn.addEventListener('click', calculateCaloriesBurned);
    resetBtn.addEventListener('click', resetCalculator);
    
    // Form submission event listener
    document.getElementById('calorie-burn-form').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateCaloriesBurned();
    });
    
    // Function to toggle between metric and imperial unit systems
    function toggleUnitSystem() {
        const unitSystem = document.querySelector('input[name="unit-system"]:checked').value;
        
        if (unitSystem === 'metric') {
            metricWeightDiv.classList.remove('hidden');
            imperialWeightDiv.classList.add('hidden');
            
            // Convert imperial to metric if there's a value
            if (weightLbsInput.value) {
                weightKgInput.value = (parseFloat(weightLbsInput.value) * 0.453592).toFixed(1);
            }
        } else {
            metricWeightDiv.classList.add('hidden');
            imperialWeightDiv.classList.remove('hidden');
            
            // Convert metric to imperial if there's a value
            if (weightKgInput.value) {
                weightLbsInput.value = (parseFloat(weightKgInput.value) * 2.20462).toFixed(1);
            }
        }
    }
    
    // Function to calculate calories burned
    function calculateCaloriesBurned() {
        // Get input values
        const unitSystem = document.querySelector('input[name="unit-system"]:checked').value;
        const activityType = activityTypeSelect.value;
        const duration = parseFloat(durationInput.value);
        const durationUnit = durationUnitSelect.value;
        const age = parseInt(ageInput.value) || null;
        const gender = genderSelect.value || null;
        
        // Validate inputs
        if (!validateInputs(unitSystem, activityType, duration)) {
            return;
        }
        
        // Get weight in kg regardless of unit system
        let weightKg;
        if (unitSystem === 'metric') {
            weightKg = parseFloat(weightKgInput.value);
        } else {
            weightKg = parseFloat(weightLbsInput.value) * 0.453592; // Convert lbs to kg
        }
        
        // Get MET value for the selected activity
        const met = metValues[activityType];
        
        // Convert duration to hours
        let durationHours = duration;
        if (durationUnit === 'minutes') {
            durationHours = duration / 60;
        }
        
        // Calculate calories burned
        // Formula: Calories = MET × Weight(kg) × Duration(hours)
        const caloriesBurned = met * weightKg * durationHours;
        
        // Get activity category
        let activityCategory = '';
        for (const [category, activities] of Object.entries(activityCategories)) {
            if (activities.includes(activityType)) {
                activityCategory = category;
                break;
            }
        }
        
        // Display results
        displayResults(caloriesBurned, activityType, met, weightKg, duration, durationUnit, activityCategory);
    }
    
    // Function to validate inputs
    function validateInputs(unitSystem, activityType, duration) {
        // Check if activity is selected
        if (!activityType) {
            showError('Please select an activity');
            return false;
        }
        
        // Check if duration is valid
        if (isNaN(duration) || duration <= 0) {
            showError('Please enter a valid duration');
            return false;
        }
        
        // Check if weight is valid
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
        
        return true;
    }
    
    // Function to display results
    function displayResults(caloriesBurned, activityType, met, weightKg, duration, durationUnit, activityCategory) {
        // Format activity name for display
        const activityName = formatActivityName(activityType);
        
        // Format weight for display
        const unitSystem = document.querySelector('input[name="unit-system"]:checked').value;
        let weightDisplay;
        if (unitSystem === 'metric') {
            weightDisplay = weightKg.toFixed(1) + ' kg';
        } else {
            weightDisplay = (weightKg * 2.20462).toFixed(1) + ' lbs';
        }
        
        // Format duration for display
        const durationDisplay = duration + ' ' + durationUnit;
        
        // Round calories burned to nearest whole number
        const roundedCalories = Math.round(caloriesBurned);
        
        // Get color based on activity category
        let categoryColor;
        switch (activityCategory) {
            case 'light':
                categoryColor = 'blue-500';
                break;
            case 'moderate':
                categoryColor = 'green-500';
                break;
            case 'vigorous':
                categoryColor = 'orange-500';
                break;
            case 'very_vigorous':
                categoryColor = 'red-500';
                break;
            default:
                categoryColor = 'purple-500';
        }
        
        // Calculate equivalent activities
        const equivalentActivities = calculateEquivalentActivities(roundedCalories);
        
        // Generate HTML for equivalent activities
        let equivalentActivitiesHTML = '';
        equivalentActivities.forEach(item => {
            equivalentActivitiesHTML += `
                <div class="flex items-center justify-between border-b border-white border-opacity-10 py-2">
                    <span>${item.description}</span>
                    <span class="font-semibold">${item.value}</span>
                </div>
            `;
        });
        
        // Display results
        resultDiv.innerHTML = `
            <div class="animate-fade-in">
                <h3 class="text-xl font-semibold text-white mb-4">Your Calorie Burn Results</h3>
                
                <div class="bg-white bg-opacity-15 p-4 rounded-lg mb-6 shadow-md border border-white border-opacity-20">
                    <div class="flex justify-between items-center border-b border-white border-opacity-20 pb-2 mb-2">
                        <span class="text-gray-200 font-medium">Activity:</span>
                        <span class="text-white font-semibold">${activityName}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-20 pb-2 mb-2">
                        <span class="text-gray-200 font-medium">Weight:</span>
                        <span class="text-white font-semibold">${weightDisplay}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-white border-opacity-20 pb-2 mb-2">
                        <span class="text-gray-200 font-medium">Duration:</span>
                        <span class="text-white font-semibold">${durationDisplay}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-200 font-medium">MET Value:</span>
                        <span class="text-white font-semibold">${met.toFixed(1)}</span>
                    </div>
                </div>
                
                <div class="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 mb-6 text-center">
                    <h4 class="text-lg font-semibold text-white mb-2">Calories Burned</h4>
                    <p class="text-3xl font-bold text-white">${roundedCalories}</p>
                    <p class="text-white font-semibold mt-2">calories</p>
                </div>
                
                <div class="bg-white bg-opacity-5 p-4 rounded-lg mb-6">
                    <h4 class="text-lg font-semibold text-white mb-3">Activity Intensity</h4>
                    <div class="relative h-4 bg-gradient-to-r from-blue-500 via-green-500 via-orange-500 to-red-500 rounded-full overflow-hidden">
                        <div class="absolute h-full w-1 bg-white" style="left: ${(met / 12) * 100}%; transform: translateX(-50%);"></div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-300 mt-1">
                        <span>Light</span>
                        <span>Moderate</span>
                        <span>Vigorous</span>
                        <span>Very Vigorous</span>
                    </div>
                </div>
                
                <div class="bg-white bg-opacity-5 p-4 rounded-lg">
                    <h4 class="text-lg font-semibold text-white mb-3">Calorie Equivalents</h4>
                    <div class="space-y-1">
                        ${equivalentActivitiesHTML}
                    </div>
                    <p class="mt-4 text-yellow-400 text-sm">
                        <i class="fas fa-info-circle mr-2"></i> These calculations are estimates based on average values and may vary based on individual factors.
                    </p>
                </div>
            </div>
        `;
    }
    
    // Function to format activity name for display
    function formatActivityName(activityType) {
        return activityType
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    // Function to calculate equivalent activities
    function calculateEquivalentActivities(calories) {
        return [
            {
                description: 'Slices of pizza:',
                value: Math.round(calories / 285)
            },
            {
                description: 'Chocolate bars (1.55 oz):',
                value: Math.round(calories / 210)
            },
            {
                description: 'Glasses of wine (5 oz):',
                value: Math.round(calories / 125)
            },
            {
                description: 'Cans of soda (12 oz):',
                value: Math.round(calories / 150)
            },
            {
                description: 'Miles of walking:',
                value: Math.round(calories / 100)
            }
        ];
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
        document.getElementById('calorie-burn-form').reset();
        
        // Reset to metric system
        document.querySelector('input[name="unit-system"][value="metric"]').checked = true;
        toggleUnitSystem();
        
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-fire text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-300 text-center">Enter your details and select an activity to calculate calories burned</p>
            </div>
        `;
    }
});