/**
 * Heart Rate Calculator JavaScript
 * Handles heart rate calculations and result display
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const ageInput = document.getElementById('age');
    const restingHeartRateInput = document.getElementById('resting-heart-rate');
    const fitnessLevelSelect = document.getElementById('fitness-level');
    const genderSelect = document.getElementById('gender');
    const formulaRadios = document.querySelectorAll('input[name="formula"]');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('result');
    
    // Mobile menu functionality
    const mobileDropdownButton = document.getElementById('mobile-dropdown-button');
    const mobileDropdown = document.getElementById('mobile-dropdown');
    
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
    calculateBtn.addEventListener('click', calculateHeartRate);
    resetBtn.addEventListener('click', resetCalculator);
    
    // Form submission event listener
    document.getElementById('heart-rate-form').addEventListener('submit', function(e) {
        e.preventDefault();
        calculateHeartRate();
    });
    
    // Function to calculate heart rate zones
    function calculateHeartRate() {
        // Validate inputs
        if (!validateInputs()) {
            return;
        }
        
        const age = parseInt(ageInput.value);
        const restingHR = restingHeartRateInput.value ? parseInt(restingHeartRateInput.value) : null;
        const fitnessLevel = fitnessLevelSelect.value;
        const gender = genderSelect.value;
        const formula = document.querySelector('input[name="formula"]:checked').value;
        
        // Calculate maximum heart rate based on selected formula
        let maxHR;
        let hrReserve;
        
        if (formula === 'traditional') {
            maxHR = 220 - age;
        } else if (formula === 'tanaka') {
            maxHR = 208 - (0.7 * age);
        } else if (formula === 'karvonen') {
            if (!restingHR) {
                showError('Resting heart rate is required for the Karvonen formula');
                return;
            }
            maxHR = 220 - age;
            hrReserve = maxHR - restingHR;
        }
        
        // Round max HR to nearest whole number
        maxHR = Math.round(maxHR);
        
        // Calculate heart rate zones
        const zones = calculateHeartRateZones(maxHR, restingHR, formula);
        
        // Apply fitness level adjustments
        applyFitnessLevelAdjustments(zones, fitnessLevel);
        
        // Display results
        displayResults(maxHR, zones, formula, restingHR);
    }
    
    // Function to validate inputs
    function validateInputs() {
        const age = parseInt(ageInput.value);
        const restingHR = restingHeartRateInput.value ? parseInt(restingHeartRateInput.value) : null;
        const formula = document.querySelector('input[name="formula"]:checked').value;
        
        if (isNaN(age) || age < 1 || age > 120) {
            showError('Please enter a valid age between 1 and 120');
            return false;
        }
        
        if (formula === 'karvonen' && (!restingHR || isNaN(restingHR) || restingHR < 30 || restingHR > 120)) {
            showError('Please enter a valid resting heart rate between 30 and 120 bpm for the Karvonen formula');
            return false;
        }
        
        if (restingHR && (isNaN(restingHR) || restingHR < 30 || restingHR > 120)) {
            showError('Please enter a valid resting heart rate between 30 and 120 bpm');
            return false;
        }
        
        return true;
    }
    
    // Function to calculate heart rate zones
    function calculateHeartRateZones(maxHR, restingHR, formula) {
        const zones = {
            recovery: { name: 'Zone 1: Recovery', min: 0, max: 0, percent: '50-60%' },
            endurance: { name: 'Zone 2: Endurance', min: 0, max: 0, percent: '60-70%' },
            aerobic: { name: 'Zone 3: Aerobic', min: 0, max: 0, percent: '70-80%' },
            threshold: { name: 'Zone 4: Threshold', min: 0, max: 0, percent: '80-90%' },
            maximum: { name: 'Zone 5: Maximum', min: 0, max: 0, percent: '90-100%' }
        };
        
        if (formula === 'karvonen' && restingHR) {
            // Karvonen formula uses heart rate reserve (HRR)
            const hrr = maxHR - restingHR;
            
            zones.recovery.min = Math.round(restingHR + (hrr * 0.5));
            zones.recovery.max = Math.round(restingHR + (hrr * 0.6));
            
            zones.endurance.min = Math.round(restingHR + (hrr * 0.6));
            zones.endurance.max = Math.round(restingHR + (hrr * 0.7));
            
            zones.aerobic.min = Math.round(restingHR + (hrr * 0.7));
            zones.aerobic.max = Math.round(restingHR + (hrr * 0.8));
            
            zones.threshold.min = Math.round(restingHR + (hrr * 0.8));
            zones.threshold.max = Math.round(restingHR + (hrr * 0.9));
            
            zones.maximum.min = Math.round(restingHR + (hrr * 0.9));
            zones.maximum.max = maxHR;
        } else {
            // Percentage of max HR for other formulas
            zones.recovery.min = Math.round(maxHR * 0.5);
            zones.recovery.max = Math.round(maxHR * 0.6);
            
            zones.endurance.min = Math.round(maxHR * 0.6);
            zones.endurance.max = Math.round(maxHR * 0.7);
            
            zones.aerobic.min = Math.round(maxHR * 0.7);
            zones.aerobic.max = Math.round(maxHR * 0.8);
            
            zones.threshold.min = Math.round(maxHR * 0.8);
            zones.threshold.max = Math.round(maxHR * 0.9);
            
            zones.maximum.min = Math.round(maxHR * 0.9);
            zones.maximum.max = maxHR;
        }
        
        return zones;
    }
    
    // Function to apply fitness level adjustments
    function applyFitnessLevelAdjustments(zones, fitnessLevel) {
        // Adjust zones based on fitness level
        // More fit individuals may train at higher percentages of their max HR
        let adjustment = 0;
        
        switch (fitnessLevel) {
            case 'beginner':
                // No adjustment for beginners
                break;
            case 'intermediate':
                // Slight upward adjustment for intermediate
                adjustment = 2;
                break;
            case 'advanced':
                // Moderate upward adjustment for advanced
                adjustment = 5;
                break;
            case 'athlete':
                // Larger upward adjustment for athletes
                adjustment = 8;
                break;
        }
        
        if (adjustment > 0) {
            // Apply adjustments to all zones
            for (const zone in zones) {
                zones[zone].min = Math.min(zones[zone].min + adjustment, zones[zone].max);
                zones[zone].max = Math.min(zones[zone].max + adjustment, zones.maximum.max);
            }
        }
    }
    
    // Function to display results
    function displayResults(maxHR, zones, formula, restingHR) {
        let formulaName = '';
        switch (formula) {
            case 'traditional':
                formulaName = 'Traditional (220 - Age)';
                break;
            case 'tanaka':
                formulaName = 'Tanaka (208 - 0.7 × Age)';
                break;
            case 'karvonen':
                formulaName = 'Karvonen (Heart Rate Reserve)';
                break;
        }
        
        let html = `
            <div class="text-center mb-6">
                <div class="inline-block bg-purple-500 bg-opacity-30 rounded-full p-4 mb-4">
                    <i class="fas fa-heartbeat text-4xl text-pink-400"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">Your Maximum Heart Rate</h3>
                <p class="text-3xl font-bold text-pink-400 mb-1">${maxHR} BPM</p>
                <p class="text-sm text-gray-300">Calculated using ${formulaName}</p>
                ${restingHR ? `<p class="text-sm text-gray-300 mt-1">Resting Heart Rate: ${restingHR} BPM</p>` : ''}
            </div>
            
            <h3 class="text-xl font-bold text-white mb-4">Your Target Heart Rate Zones</h3>
            
            <div class="space-y-4">
        `;
        
        // Zone 1: Recovery (50-60%)
        html += createZoneHTML(zones.recovery, 'bg-blue-500', 'Low intensity, recovery, warm-up');
        
        // Zone 2: Endurance (60-70%)
        html += createZoneHTML(zones.endurance, 'bg-green-500', 'Fat burning, basic endurance');
        
        // Zone 3: Aerobic (70-80%)
        html += createZoneHTML(zones.aerobic, 'bg-yellow-500', 'Improved aerobic capacity, efficiency');
        
        // Zone 4: Threshold (80-90%)
        html += createZoneHTML(zones.threshold, 'bg-orange-500', 'Improved anaerobic threshold, speed');
        
        // Zone 5: Maximum (90-100%)
        html += createZoneHTML(zones.maximum, 'bg-red-500', 'Maximum performance, short intervals');
        
        html += `
            </div>
            
            <div class="mt-6 text-center">
                <p class="text-gray-300 text-sm">These zones are estimates based on your inputs. Individual responses to exercise may vary.</p>
                <p class="text-gray-300 text-sm mt-2">For the most accurate results, consider a supervised exercise test with a fitness professional.</p>
            </div>
        `;
        
        resultDiv.innerHTML = html;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Helper function to create HTML for each zone
    function createZoneHTML(zone, colorClass, description) {
        return `
            <div class="bg-white bg-opacity-10 rounded-lg p-4 border border-white border-opacity-20">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-bold text-white">${zone.name}</h4>
                        <p class="text-gray-300 text-sm">${description}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-2xl font-bold text-white">${zone.min}-${zone.max} <span class="text-sm">BPM</span></p>
                        <p class="text-sm text-gray-300">${zone.percent} of max</p>
                    </div>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                    <div class="${colorClass} h-2.5 rounded-full" style="width: ${zone.percent.split('-')[1]}"></div>
                </div>
            </div>
        `;
    }
    
    // Function to show error message
    function showError(message) {
        resultDiv.innerHTML = `
            <div class="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-40 rounded-lg p-4 text-center">
                <i class="fas fa-exclamation-triangle text-3xl text-red-400 mb-3"></i>
                <p class="text-white">${message}</p>
            </div>
        `;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Function to reset calculator
    function resetCalculator() {
        document.getElementById('heart-rate-form').reset();
        
        resultDiv.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fas fa-heartbeat text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-300 text-center">Enter your details to calculate your heart rate zones</p>
            </div>
        `;
    }
});

// FAQ Toggle Function
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