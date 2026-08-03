const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const rect = { w: 240, h: 36 };

const yearSelect = document.querySelector("#year-select");
const svgHolder = document.querySelector("#svg-holder");

// Derived from the Date API rather than hardcoded, so every year in the picker
// works and February follows the leap cycle.
const getMonths = (year) => Array.from({ length: 12 }, (_, index) => ({
    name: new Date(year, index).toLocaleString("en-US", { month: "long" }),
    numOfDays: new Date(year, index + 1, 0).getDate(),
    firstDay: new Date(year, index).getDay()
}));


const createSVG = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", `0 0 ${rect.w * 12} ${rect.h * 38}`);
    svgHolder.appendChild(svg);
    return svg;
};


const createYearGroup = (svg) => {
    const yearGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(yearGroup);
    return yearGroup;
};


const createMonthGroup = (monthIndex, firstDay) => {
    const monthGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    monthGroup.setAttribute("transform", `translate(${rect.w * monthIndex} ${rect.h * firstDay})`);
    return monthGroup;
};


const createMonthHeader = (monthName) => {
    const headerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    headerGroup.setAttribute("id", `${monthName.toLowerCase()}-header`);

    const headerGroupRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    headerGroupRect.setAttribute("width", rect.w);
    headerGroupRect.setAttribute("height", rect.h);
    headerGroupRect.setAttribute("stroke", "lightgrey");
    headerGroupRect.setAttribute("stroke-width", "1");
    headerGroupRect.setAttribute("fill", "black");

    const headerGroupText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    headerGroupText.setAttribute("class", "text");
    headerGroupText.setAttribute("dx", "6");
    headerGroupText.setAttribute("dy", "23");
    headerGroupText.setAttribute("fill", "white");
    headerGroupText.setAttribute("text-anchor", "start");
    headerGroupText.textContent = monthName;

    headerGroup.appendChild(headerGroupRect);
    headerGroup.appendChild(headerGroupText);

    return headerGroup;
};

const createDayGroup = (monthName, index, isWeekend, currentDayIndex) => {
    const dayGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    dayGroup.setAttribute("id", `${monthName.toLowerCase()}-${index + 1}`);
    dayGroup.setAttribute("class", "day-group");
    dayGroup.setAttribute("transform", `translate(0 ${(rect.h * index) + rect.h})`);

    const dayGroupRectBig = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    dayGroupRectBig.setAttribute("width", rect.w);
    dayGroupRectBig.setAttribute("height", rect.h);
    dayGroupRectBig.setAttribute("stroke", "lightgrey");
    dayGroupRectBig.setAttribute("stroke-width", "2");
    dayGroupRectBig.setAttribute("fill", isWeekend ? "white" : "white");

    const dayGroupRectSmall1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    dayGroupRectSmall1.setAttribute("width", rect.w / 5);
    dayGroupRectSmall1.setAttribute("height", rect.h);
    dayGroupRectSmall1.setAttribute("stroke", "lightgrey");
    dayGroupRectSmall1.setAttribute("stroke-width", "2");
    dayGroupRectSmall1.setAttribute("fill", isWeekend ? `black` : "white");

    const rectSmalltext = document.createElementNS("http://www.w3.org/2000/svg", "text");
    rectSmalltext.setAttribute("class", "text");
    rectSmalltext.setAttribute("dx", "6");
    rectSmalltext.setAttribute("dy", "23");
    rectSmalltext.setAttribute("fill", isWeekend ? "white" : "black");
    rectSmalltext.setAttribute("text-anchor", "start");

    const dayName = days[currentDayIndex];
    rectSmalltext.textContent = `${dayName[0]} ${index + 1}`;

    dayGroup.appendChild(dayGroupRectBig);
    dayGroup.appendChild(dayGroupRectSmall1);
    dayGroup.appendChild(rectSmalltext);

    return dayGroup;
};

const createMonth = (month, monthIndex, yearGroup) => {
    const monthGroup = createMonthGroup(monthIndex, month.firstDay);
    const headerGroup = createMonthHeader(month.name);

    monthGroup.appendChild(headerGroup);

    for (let index = 0; index < month.numOfDays; index++) {
        const currentDayIndex = (month.firstDay + index) % 7;
        const isWeekend = currentDayIndex === 0 || currentDayIndex === 6;
        const dayGroup = createDayGroup(month.name, index, isWeekend, currentDayIndex);
        monthGroup.appendChild(dayGroup);
    }

    yearGroup.appendChild(monthGroup);
};

const generateCalendar = (year) => {
    // Replace the previous year's drawing, leaving the <noscript> fallback alone.
    svgHolder.querySelector("svg")?.remove();

    const svg = createSVG();
    const yearGroup = createYearGroup(svg);

    getMonths(year).forEach((month, index) => createMonth(month, index, yearGroup));
};

generateCalendar(Number(yearSelect.value));

yearSelect.addEventListener("change", () => generateCalendar(Number(yearSelect.value)));
