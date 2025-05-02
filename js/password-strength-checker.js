// Password Strength Checker JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const passwordInput = document.getElementById('password-input');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const checkPasswordBtn = document.getElementById('check-password-btn');
    const passwordResult = document.getElementById('password-result');

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Check password strength when button is clicked
    if (checkPasswordBtn) {
        checkPasswordBtn.addEventListener('click', function() {
            const password = passwordInput.value;
            const result = checkPasswordStrength(password);
            displayPasswordStrength(result);
        });
    }

    // Function to check password strength
    function checkPasswordStrength(password) {
        // Initialize result object
        const result = {
            score: 0,
            strength: 'Very Weak',
            color: 'red-500',
            feedback: []
        };

        // If password is empty, return default result
        if (!password) {
            result.feedback.push('Please enter a password.');
            return result;
        }

        // Check length
        if (password.length < 8) {
            result.feedback.push('Password is too short (minimum 8 characters).');
        } else if (password.length >= 12) {
            result.score += 2;
        } else {
            result.score += 1;
        }

        // Check for lowercase letters
        if (/[a-z]/.test(password)) {
            result.score += 1;
        } else {
            result.feedback.push('Add lowercase letters.');
        }

        // Check for uppercase letters
        if (/[A-Z]/.test(password)) {
            result.score += 1;
        } else {
            result.feedback.push('Add uppercase letters.');
        }

        // Check for numbers
        if (/\d/.test(password)) {
            result.score += 1;
        } else {
            result.feedback.push('Add numbers.');
        }

        // Check for special characters
        if (/[^A-Za-z0-9]/.test(password)) {
            result.score += 1;
        } else {
            result.feedback.push('Add special characters.');
        }

        // Check for repeated characters
        if (/(.)(\1{2,})/.test(password)) {
            result.score -= 1;
            result.feedback.push('Avoid repeated characters.');
        }

        // Check for sequential patterns
        if (/(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789)/.test(password.toLowerCase())) {
            result.score -= 1;
            result.feedback.push('Avoid sequential patterns.');
        }

        // Determine strength based on score
        if (result.score <= 1) {
            result.strength = 'Very Weak';
            result.color = 'red-500';
        } else if (result.score <= 2) {
            result.strength = 'Weak';
            result.color = 'orange-500';
        } else if (result.score <= 4) {
            result.strength = 'Moderate';
            result.color = 'yellow-500';
        } else if (result.score <= 5) {
            result.strength = 'Strong';
            result.color = 'green-500';
        } else {
            result.strength = 'Very Strong';
            result.color = 'green-700';
        }

        // If no feedback was given but score is low, add generic advice
        if (result.feedback.length === 0 && result.score < 4) {
            result.feedback.push('Consider using a longer password with a mix of characters.');
        }

        return result;
    }

    // Function to display password strength
    function displayPasswordStrength(result) {
        let html = '';

        // Create strength indicator
        html += `<div class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <span class="text-white">Strength:</span>
                <span class="text-${result.color} font-bold">${result.strength}</span>
            </div>
            <div class="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-${result.color} rounded-full" style="width: ${(result.score / 6) * 100}%"></div>
            </div>
        </div>`;

        // Add score breakdown
        html += `<div class="mb-6">
            <h3 class="text-white font-semibold mb-2">Analysis:</h3>
            <div class="bg-white bg-opacity-5 p-3 rounded-lg">`;

        if (result.feedback.length > 0) {
            html += `<ul class="text-gray-300 space-y-1">`;
            result.feedback.forEach(item => {
                html += `<li class="flex items-start">
                    <i class="fas fa-info-circle text-${result.color} mt-1 mr-2"></i>
                    <span>${item}</span>
                </li>`;
            });
            html += `</ul>`;
        } else {
            html += `<p class="text-green-400 flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                Your password meets all the recommended criteria!
            </p>`;
        }

        html += `</div></div>`;

        // Add time to crack estimate (simplified)
        const timeEstimate = getTimeToHack(result.score);
        html += `<div>
            <h3 class="text-white font-semibold mb-2">Estimated time to crack:</h3>
            <p class="text-${result.color} font-bold text-lg">${timeEstimate}</p>
        </div>`;

        // Update the result container
        passwordResult.innerHTML = html;
    }

    // Function to estimate time to crack (simplified)
    function getTimeToHack(score) {
        switch (score) {
            case 0:
            case 1:
                return 'Instantly';
            case 2:
                return 'A few hours';
            case 3:
                return 'A few days';
            case 4:
                return 'A few months';
            case 5:
                return 'A few years';
            default:
                return 'Centuries';
        }
    }
});