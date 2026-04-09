
// Gets todays date
function displayTodaysDate() {
    const date = new Date();
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

    // Date suffixes
    const getSuffix = (n) => {
        if (n > 3 && n < 21) return 'th'; 
        switch (n % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    };

    const suffix = getSuffix(day);
    
    // Format 1: April 9th
    const shortDate = `${month} ${day}${suffix}`;
    // Format 2: April 9th, 2026
    const longDate = `${month} ${day}${suffix}, ${year}`;

    // Find all elements and check their classes
    document.querySelectorAll('.date-display').forEach(element => {
        if (element.classList.contains('date-long')) {
            element.textContent = longDate;
        } else {
            element.textContent = shortDate;
        }
    });
}

displayTodaysDate();
