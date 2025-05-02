// Date Difference Calculator JavaScript

/**
 * Calculate the difference between two dates
 * Handles years, months, weeks, and days calculation
 */
function calculateDateDifference() {
    // Get input values
    const startDateInput = document.getElementById('start-date').value;
    const endDateInput = document.getElementById('end-date').value;
    const includeEndDate = document.getElementById('include-end-date').checked;
    
    // Validate inputs
    if (!startDateInput || !endDateInput) {
        document.getElementById('date-result').innerHTML = 
            '<p class="text-red-400 text-center">Please select both start and end dates</p>';
        return;
    }
    
    // Parse dates
    let startDate = new Date(startDateInput);
    let endDate = new Date(endDateInput);
    
    // Show loading animation
    showLoading('date-result');
    
    // Ensure start date is earlier than end date
    if (startDate > endDate) {
        // Swap dates if start date is later than end date
        [startDate, endDate] = [endDate, startDate];
    }
    
    // Clone dates to avoid modifying the original objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate total days difference
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    let totalDays = Math.round(Math.abs((end - start) / millisecondsPerDay));
    
    // Add one day if including end date
    if (includeEndDate) {
        totalDays += 1;
    }
    
    // Calculate years, months, weeks, and remaining days
    let years = 0;
    let months = 0;
    let weeks = 0;
    let days = 0;
    
    // Calculate years
    while (true) {
        const nextYearDate = new Date(start);
        nextYearDate.setFullYear(start.getFullYear() + 1);
        
        if (nextYearDate > end) {
            break;
        }
        
        years++;
        start.setFullYear(start.getFullYear() + 1);
    }
    
    // Calculate months
    while (true) {
        const nextMonthDate = new Date(start);
        nextMonthDate.setMonth(start.getMonth() + 1);
        
        if (nextMonthDate > end) {
            break;
        }
        
        months++;
        start.setMonth(start.getMonth() + 1);
    }
    
    // Calculate remaining days
    let remainingDays = Math.round(Math.abs((end - start) / millisecondsPerDay));
    
    // Add one day if including end date and we have remaining days
    if (includeEndDate && remainingDays > 0) {
        remainingDays += 1;
    }
    
    // Calculate weeks and days
    weeks = Math.floor(remainingDays / 7);
    days = remainingDays % 7;
    
    // Format the result
    let resultHTML = '<div class="space-y-4">';
    resultHTML += '<div class="bg-white bg-opacity-20 rounded-lg p-4 text-center">';
    resultHTML += `<span class="text-3xl font-bold text-yellow-400">${totalDays}</span>`;
    resultHTML += '<p class="text-white">Total Days</p>';
    resultHTML += '</div>';
    
    resultHTML += '<div class="grid grid-cols-2 md:grid-cols-4 gap-4">';
    
    // Years
    resultHTML += '<div class="bg-white bg-opacity-20 rounded-lg p-4 text-center">';
    resultHTML += `<span class="text-2xl font-bold text-yellow-400">${years}</span>`;
    resultHTML += '<p class="text-white">Years</p>';
    resultHTML += '</div>';
    
    // Months
    resultHTML += '<div class="bg-white bg-opacity-20 rounded-lg p-4 text-center">';
    resultHTML += `<span class="text-2xl font-bold text-yellow-400">${months}</span>`;
    resultHTML += '<p class="text-white">Months</p>';
    resultHTML += '</div>';
    
    // Weeks
    resultHTML += '<div class="bg-white bg-opacity-20 rounded-lg p-4 text-center">';
    resultHTML += `<span class="text-2xl font-bold text-yellow-400">${weeks}</span>`;
    resultHTML += '<p class="text-white">Weeks</p>';
    resultHTML += '</div>';
    
    // Days
    resultHTML += '<div class="bg-white bg-opacity-20 rounded-lg p-4 text-center">';
    resultHTML += `<span class="text-2xl font-bold text-yellow-400">${days}</span>`;
    resultHTML += '<p class="text-white">Days</p>';
    resultHTML += '</div>';
    
    resultHTML += '</div>'; // End grid
    
    // Date information
    resultHTML += '<div class="bg-white bg-opacity-10 rounded-lg p-4">';
    resultHTML += '<div class="flex justify-between items-center mb-2">';
    resultHTML += '<span class="text-white">Start Date:</span>';
    resultHTML += `<span class="text-yellow-400 font-semibold">${formatDate(startDate)}</span>`;
    resultHTML += '</div>';
    
    resultHTML += '<div class="flex justify-between items-center">';
    resultHTML += '<span class="text-white">End Date:</span>';
    resultHTML += `<span class="text-yellow-400 font-semibold">${formatDate(endDate)}</span>`;
    resultHTML += '</div>';
    resultHTML += '</div>';
    
    resultHTML += '</div>'; // End space-y-4
    
    // Update the result container
    hideLoading('date-result', resultHTML);
}

/**
 * Format a date object to a readable string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}