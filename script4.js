let year = 2014; // Use 'let' if dynamic updates are needed

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const months = Array.from({ length: 12 }, (_, i) => {
    const firstDay = new Date(year, i, 1).getDay();
    const numOfDays = new Date(year, i + 1, 0).getDate();
    return {
        name: new Date(year, i, 1).toLocaleString('default', { month: 'long' }),
        numOfDays,
        firstDay,
    };
});

const rect = { w: 240, h: 36 };
const svgPadding = { top: 0, left: 120, bottom: 0, right: 20 };

/**
 * Helper function to create an SVG element with specified attributes.
 * @param {string} type - The type of SVG element to create.
 * @param {Object} attributes - Key-value pairs of attributes.
 * @returns {SVGElement} The created SVG element.
 */
const createSVGElement = (type, attributes) => {
    const elem = document.createElementNS("http://www.w3.org/2000/svg", type);
    for (const [key, value] of Object.entries(attributes)) {
        elem.setAttribute(key, value);
    }
    return elem;
};

// Creates the SVG
const createSVG = () => {
    const svgHolder = document.querySelector("#svg-holder");
    if (!svgHolder) {
        console.error("SVG holder element with ID 'svg-holder' not found.");
        return null;
    }
    const svg = createSVGElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: `0 0 ${(rect.w * 12) + svgPadding.left} ${(rect.h * 38) + svgPadding.top}`,
    });
    svg.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    svgHolder.appendChild(svg);
    return svg;
};

const svg = createSVG();

if (!svg) {
    throw new Error("Failed to create SVG element.");
}

/**
 * Creates a group element for the year.
 * @param {number} year - The year to create the group for.
 * @returns {SVGGroupElement} The created year group element.
 */
const createYearGroup = (year) => {
    const yearGroup = createSVGElement("g", {
        id: year.toString(),
        class: "year-group",
        transform: `translate(${svgPadding.left}, ${svgPadding.top})`,
    });
    svg.appendChild(yearGroup);
    return yearGroup;
};

const yearGroup = createYearGroup(year);

/**
 * Creates a group element for a specific month.
 * @param {number} monthIndex - The index of the month in the months array.
 * @param {number} firstDay - The first day of the month (0 = Sunday, 6 = Saturday).
 * @returns {SVGGroupElement} The created month group element.
 */
const createMonthGroup = (monthIndex, firstDay) => {
    return createSVGElement("g", {
        id: months[monthIndex].name.toLowerCase(),
        class: "month-group",
        transform: `translate(${rect.w * monthIndex} ${rect.h * firstDay})`,
    });
};

/**
 * Creates the header for a month.
 * @param {string} monthName - The name of the month.
 * @returns {SVGGroupElement} The created month header group element.
 */
const createMonthHeader = (monthName) => {
    const headerGroup = createSVGElement("g", {
        id: `${monthName.toLowerCase()}-header`,
        class: "header-group",
    });

    const headerGroupRect = createSVGElement("rect", {
        width: rect.w,
        height: rect.h,
        stroke: "lightgrey",
        "stroke-width": "2",
        fill: "white",
    });

    const headerGroupText = createSVGElement("text", {
        class: "text",
        dx: "6",
        dy: "23",
        fill: "black",
        "text-anchor": "start",
    });
    headerGroupText.textContent = monthName;

    headerGroup.appendChild(headerGroupRect);
    headerGroup.appendChild(headerGroupText);

    return headerGroup;
};

/**
 * Creates a group element for a specific day.
 * @param {string} monthName - The name of the month.
 * @param {number} index - The index of the day in the month.
 * @param {boolean} isWeekend - Indicates if the day is a weekend.
 * @param {number} currentDayIndex - The day of the week (0 = Sunday, 6 = Saturday).
 * @returns {SVGGroupElement} The created day group element.
 */
const createDayGroup = (monthName, index, isWeekend, currentDayIndex) => {
    const dayGroup = createSVGElement("g", {
        id: `${monthName.toLowerCase()}-${index + 1}`,
        class: "day-group",
        transform: `translate(0 ${(rect.h * index) + rect.h})`,
    });

    const dayGroupRectBig = createSVGElement("rect", {
        width: rect.w,
        height: rect.h,
        stroke: "lightgrey",
        "stroke-width": "2",
        fill: "white",
    });

    const dayGroupRectSmall1 = createSVGElement("rect", {
        width: rect.w / 5,
        height: rect.h,
        stroke: "lightgrey",
        "stroke-width": "2",
        fill: isWeekend ? `hsl(0 0% 0%)` : "white",
    });

    const rectSmalltext = createSVGElement("text", {
        class: "text",
        dx: "6",
        dy: "23",
        fill: isWeekend ? "#fff" : "hsl(0 0% 0%)",
        "text-anchor": "start",
    });
    rectSmalltext.textContent = `${dayNames[currentDayIndex][0]} ${index + 1}`;

    dayGroup.appendChild(dayGroupRectBig);
    dayGroup.appendChild(dayGroupRectSmall1);
    dayGroup.appendChild(rectSmalltext);

    return dayGroup;
};

/**
 * Creates the entire month group, including header and days.
 * @param {string} monthName - The name of the month.
 * @param {number} monthIndex - The index of the month in the months array.
 * @param {number} firstDay - The first day of the month (0 = Sunday, 6 = Saturday).
 */
const createMonth = (monthName, monthIndex, firstDay) => {
    const monthGroup = createMonthGroup(monthIndex, firstDay);
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

/**
 * Generates the entire calendar by creating all months.
 */
const generateCalendar = () => {
    months.forEach((month, index) => {
        createMonth(month.name, index, month.firstDay);
    });
};

generateCalendar();