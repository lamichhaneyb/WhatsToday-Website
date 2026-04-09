
// Generates a random day
function displayRandomDate() {
    const year = new Date().getFullYear();
    const start = new Date(year, 0, 1).getTime(); // Jan 1st
    const end = new Date(year, 11, 31).getTime(); // Dec 31st
    
    // Pick a random timestamp between start and end
    const randomTimestamp = Math.floor(Math.random() * (end - start + 1) + start);
    const randomDate = new Date(randomTimestamp);

    const day = randomDate.getDate();
    const month = randomDate.toLocaleString('default', { month: 'long' });

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

    const formattedRandomDate = `${month} ${day}${getSuffix(day)}`;

    // Update all elements with the "random-date-display" class
    document.querySelectorAll('.random-date-display').forEach(el => {
        el.textContent = formattedRandomDate;
    });
}

displayRandomDate();
