let year = 2014; // Use 'let' if dynamic updates are needed

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const months = [
    { name: "January", numOfDays: 31, firstDay: new Date(year, 0).getDay() },
    { name: "February", numOfDays: new Date(year, 2, 0).getDate(), firstDay: new Date(year, 1).getDay() },
    { name: "March", numOfDays: 31, firstDay: new Date(year, 2).getDay() },
    { name: "April", numOfDays: 30, firstDay: new Date(year, 3).getDay() },
    { name: "May", numOfDays: 31, firstDay: new Date(year, 4).getDay() },
    { name: "June", numOfDays: 30, firstDay: new Date(year, 5).getDay() },
    { name: "July", numOfDays: 31, firstDay: new Date(year, 6).getDay() },
    { name: "August", numOfDays: 31, firstDay: new Date(year, 7).getDay() },
    { name: "September", numOfDays: 30, firstDay: new Date(year, 8).getDay() },
    { name: "October", numOfDays: 31, firstDay: new Date(year, 9).getDay() },
    { name: "November", numOfDays: 30, firstDay: new Date(year, 10).getDay() },
    { name: "December", numOfDays: 31, firstDay: new Date(year, 11).getDay() }
];

const rect = { w: 240, h: 36 };
const svgPadding = { top: 0, left: 0, bottom: 0, right: 20 };

const createSVG = () => {
    const svgHolder = document.querySelector("#svg-holder");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", `0 0 ${(rect.w * 12) + svgPadding.left} ${(rect.h * 38) + svgPadding.top}`);
    svg.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    svgHolder.appendChild(svg);
    return svg;
};

const svg = createSVG();

const createYearGroup = (year) => {
    const yearGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    yearGroup.setAttribute("id", year);
    yearGroup.setAttribute("class", "year-group");
    yearGroup.setAttribute("transform", `translate(${svgPadding.left}, ${svgPadding.top})`);
    svg.appendChild(yearGroup);
    return yearGroup;
};

const yearGroup = createYearGroup(year);

const createMonthGroup = (monthName, firstDay) => {
    // Find the index of the current month in the months array
    const monthIndex = months.findIndex(m => m.name === monthName);
    const monthGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    monthGroup.setAttribute("id", monthName.toLowerCase());
    monthGroup.setAttribute("class", "month-group");
    monthGroup.setAttribute("transform", `translate(${rect.w * monthIndex} ${rect.h * firstDay})`);
    return monthGroup;
};

const createMonthHeader = (monthName) => {
    const headerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    headerGroup.setAttribute("id", `${monthName.toLowerCase()}-header`);
    headerGroup.setAttribute("class", "header-group");

    const headerGroupRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    headerGroupRect.setAttribute("width", rect.w);
    headerGroupRect.setAttribute("height", rect.h);
    headerGroupRect.setAttribute("stroke", "lightgrey");
    headerGroupRect.setAttribute("stroke-width", "2");
    headerGroupRect.setAttribute("fill", "white");

    const headerGroupText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    headerGroupText.setAttribute("class", "text");
    headerGroupText.setAttribute("dx", "6");
    headerGroupText.setAttribute("dy", "23");
    headerGroupText.setAttribute("fill", "black");
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
    dayGroupRectSmall1.setAttribute("fill", isWeekend ? `hsl(0 0% 0%)` : "white");

    const rectSmalltext = document.createElementNS("http://www.w3.org/2000/svg", "text");
    rectSmalltext.setAttribute("class", "text");
    rectSmalltext.setAttribute("dx", "6");
    rectSmalltext.setAttribute("dy", "23");
    rectSmalltext.setAttribute("fill", isWeekend ? "#fff" : "hsl(0 0% 0%)");
    rectSmalltext.setAttribute("text-anchor", "start");

    const dayName = dayNames[currentDayIndex];
    rectSmalltext.textContent = `${dayName[0]} ${index + 1}`;

    dayGroup.appendChild(dayGroupRectBig);
    dayGroup.appendChild(dayGroupRectSmall1);
    dayGroup.appendChild(rectSmalltext);

    return dayGroup;
};

const createMonth = (monthName, monthIndex, firstDay) => {
    const monthGroup = createMonthGroup(monthName, firstDay);
    const headerGroup = createMonthHeader(monthName);

    monthGroup.appendChild(headerGroup);

    for (let index = 0; index < months[monthIndex].numOfDays; index++) {
        const currentDayIndex = (firstDay + index) % 7;
        const isWeekend = currentDayIndex === 0 || currentDayIndex === 6;
        const dayGroup = createDayGroup(monthName, index, isWeekend, currentDayIndex);
        monthGroup.appendChild(dayGroup);
    }

    yearGroup.appendChild(monthGroup);
};

const generateCalendar = () => {
    months.forEach((month, index) => {
        createMonth(month.name, index, month.firstDay);
    });
};

generateCalendar();