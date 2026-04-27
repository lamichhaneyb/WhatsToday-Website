// Split functions up
// Gets the suffixes
function getSuffix(n) {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}
// New random Date fucntion
function getRandomDate() {
    const year = new Date().getFullYear();

    const start = new Date(year, 0, 1).getTime();
    const end = new Date(year, 11, 31).getTime();

    const randomTimestamp = Math.floor(
        Math.random() * (end - start + 1) + start
    );

    const randomDate = new Date(randomTimestamp);

    const day = randomDate.getDate();
    const monthName = randomDate.toLocaleString("default", {
        month: "long"
    });

    return {
        shortDate: `${monthName} ${day}${getSuffix(day)}`,
        month: randomDate.getMonth() + 1,
        day: day
    };
}

// Gets todays date
function getToday() {
    const date = new Date();
    
    return {
        shortDate: `${date.toLocaleString("default", { month: "long" })} ${date.getDate()}${getSuffix(date.getDate())}`,
        longDate: `${date.toLocaleString("default", { month: "long" })} ${date.getDate()}${getSuffix(date.getDate())}, ${date.getFullYear()}`,
        month: date.getMonth() + 1,
        day: date.getDate()
    }
}
