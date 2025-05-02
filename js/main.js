// Main JavaScript for CalcHub

// Create animated background particles
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    initializeAnimations();
});

// Function to create floating particles in the background
function createParticles() {
    const backgroundAnimation = document.querySelector('.background-animation');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 5px and 20px
        const size = Math.random() * 15 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Random animation duration between 15s and 30s
        const duration = Math.random() * 15 + 15;
        particle.style.animationDuration = `${duration}s`;
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        backgroundAnimation.appendChild(particle);
    }
}

// Function to initialize 3D animations for category icons
function initializeAnimations() {
    // Add hover effect to category icons
    const categoryIcons = document.querySelectorAll('.category-icon');
    categoryIcons.forEach(icon => {
        icon.addEventListener('mouseover', function() {
            this.style.animationPlayState = 'paused';
        });
        
        icon.addEventListener('mouseout', function() {
            this.style.animationPlayState = 'running';
        });
    });
    
    // Add hover effect to feature icons
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseover', function() {
            this.style.animationPlayState = 'paused';
        });
        
        icon.addEventListener('mouseout', function() {
            this.style.animationPlayState = 'running';
        });
    });
}

// Function to validate form inputs
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
            
            // Add error message if it doesn't exist
            let errorMsg = input.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('p');
                errorMsg.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                errorMsg.textContent = 'This field is required';
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }
        } else {
            input.classList.remove('border-red-500');
            
            // Remove error message if it exists
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });
    
    return isValid;
}

// Function to format numbers with commas
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to copy result to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Show copied notification
    const notification = document.createElement('div');
    notification.classList.add('fixed', 'bottom-4', 'right-4', 'bg-green-500', 'text-white', 'py-2', 'px-4', 'rounded-lg', 'shadow-lg', 'z-50');
    notification.textContent = 'Copied to clipboard!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Function to show loading animation
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '<div class="flex justify-center items-center"><div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div><span class="ml-2">Calculating...</span></div>';
}

// Function to hide loading animation
function hideLoading(elementId, content) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = content;
}

// Function to create 3D rotation effect on hover
function add3DEffect(element) {
    if (!element) return;
    
    element.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX * 10; // max 10 degrees
        const deltaY = (y - centerY) / centerY * 10; // max 10 degrees
        
        this.style.transform = `perspective(1000px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
}

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Function to toggle FAQ answers
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
        element.querySelector('i').classList.replace('fa-minus', 'fa-plus');
    } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        element.querySelector('i').classList.replace('fa-plus', 'fa-minus');
    }
}

// Function to generate random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to save calculation history to local storage
function saveToHistory(calculatorType, input, result) {
    let history = JSON.parse(localStorage.getItem('calculationHistory')) || [];
    
    // Add new calculation to history
    history.push({
        type: calculatorType,
        input: input,
        result: result,
        timestamp: new Date().toISOString()
    });
    
    // Limit history to 50 items
    if (history.length > 50) {
        history = history.slice(history.length - 50);
    }
    
    localStorage.setItem('calculationHistory', JSON.stringify(history));
}

// Function to load calculation history from local storage
function loadHistory() {
    return JSON.parse(localStorage.getItem('calculationHistory')) || [];
}

// Function to clear calculation history
function clearHistory() {
    localStorage.removeItem('calculationHistory');
}

// Function to apply theme colors
function applyTheme(theme) {
    const root = document.documentElement;
    
    switch(theme) {
        case 'purple':
            root.style.setProperty('--primary-gradient', 'linear-gradient(125deg, #330867, #30cfd0)');
            break;
        case 'blue':
            root.style.setProperty('--primary-gradient', 'linear-gradient(125deg, #0061ff, #60efff)');
            break;
        case 'green':
            root.style.setProperty('--primary-gradient', 'linear-gradient(125deg, #11998e, #38ef7d)');
            break;
        case 'orange':
            root.style.setProperty('--primary-gradient', 'linear-gradient(125deg, #f12711, #f5af19)');
            break;
        case 'pink':
            root.style.setProperty('--primary-gradient', 'linear-gradient(125deg, #fc5c7d, #6a82fb)');
            break;
        default:
            root.style.setProperty('--primary-gradient', 'linear-gradient(125deg, #330867, #30cfd0)');
    }
    
    localStorage.setItem('selectedTheme', theme);
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'purple';
    applyTheme(savedTheme);
    
    // Set the theme selector value if it exists
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.value = savedTheme;
    }
});