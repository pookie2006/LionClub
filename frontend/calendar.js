// calendar.js

// Subject color mapping
const subjectColors = {
    "Computer Science": "rgba(53, 13, 133, 0.49)",
    "Math": "rgba(0, 101, 69, 0.53)",
    "Business": "rgba(0, 128, 128, 0.3)"
};

// Convert AM/PM to 24-hour format
function parseTimeTo24Hour(timeStr) {
    if (!timeStr) return null;
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
}

// Generate Google Calendar pre-fill link
function generateGCalLink(event) {
    const start = event.startStr.replace(/-|:/g,'').replace(/\.\d+Z$/, 'Z'); // YYYYMMDDTHHMMSSZ
    const end = event.endStr
        ? event.endStr.replace(/-|:/g,'').replace(/\.\d+Z$/, 'Z')
        : start;

    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || '');
    const location = encodeURIComponent(event.location || '');

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
}

document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 900,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: false,
        events: [], // initially empty
        eventDidMount: function(info) {
            // Append Google Calendar button
            const gcalLink = document.createElement('a');
            gcalLink.href = generateGCalLink({
                title: info.event.title,
                startStr: info.event.start.toISOString(),
                endStr: info.event.end ? info.event.end.toISOString() : null,
                description: info.event.extendedProps.description,
                location: info.event.extendedProps.location
            });
            gcalLink.textContent = 'Add to Google Calendar';
            gcalLink.target = '_blank';
            gcalLink.classList.add('gcal-link');

            // Append link below event
            info.el.appendChild(document.createElement('br'));
            info.el.appendChild(gcalLink);
        }
    });

    calendar.render();

    // Load events from JSON
    const response = await fetch('calevents.json');
    const eventsData = await response.json();

    eventsData.forEach(event => {
        const startTime = parseTimeTo24Hour(event.startTime);
        const endTime = parseTimeTo24Hour(event.endTime);

        const startISO = startTime
            ? `${event.date}T${String(startTime.hours).padStart(2, '0')}:${String(startTime.minutes).padStart(2,'0')}:00`
            : event.date;

        const endISO = endTime
            ? `${event.date}T${String(endTime.hours).padStart(2, '0')}:${String(endTime.minutes).padStart(2,'0')}:00`
            : null;

        calendar.addEvent({
            title: event.title,
            start: startISO,
            end: endISO,
            color: subjectColors[event.subject] || "#888",
            description: event.description || '',
            location: event.location || ''
        });
    });
});
