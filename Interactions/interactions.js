async function highlightElement(page, selector) {
    await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.border = '2px solid red';
            element.style.backgroundColor = 'yellow';
        }
    }, selector);
}

function parseTimeToMinutes(timeStr) {
    const timeParts = timeStr.split(' ');
    const timeValue = parseInt(timeParts[0], 10);
    const timeUnit = timeParts[1];

    let minutes = 0;
    if (timeUnit.startsWith('minute')) {
        minutes = timeValue;
    } else if (timeUnit.startsWith('hour')) {
        minutes = timeValue * 60;
    } else if (timeUnit.startsWith('day')) {
        minutes = timeValue * 1440; 
    }

    return minutes;
}

module.exports = { highlightElement, parseTimeToMinutes };