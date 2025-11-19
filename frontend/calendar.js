// Subject color mapping
const subjectColors = {
    "Computer Science": "#1E90FF",
    "Math": "rgba(30, 144, 255, 0.3)",
    "Business": "rgba(0, 128, 128, 0.3)"
};

// Helper to convert AM/PM to 24-hour format
function parseTimeTo24Hour(timeStr) {
    if (!timeStr) return null;
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
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
        events: []  // initially empty
    });

    calendar.render();

    // Fetch events from JSON
    const response = await fetch('calevents.json');
    const eventsData = await response.json();

    eventsData.forEach(event => {
        const startTime = parseTimeTo24Hour(event.startTime);
        const endTime = parseTimeTo24Hour(event.endTime);

        const startISO = `${event.date}T${String(startTime.hours).padStart(2, '0')}:${String(startTime.minutes).padStart(2,'0')}`;
        const endISO = endTime
            ? `${event.date}T${String(endTime.hours).padStart(2, '0')}:${String(endTime.minutes).padStart(2,'0')}`
            : null;

        calendar.addEvent({
            title: event.title,
            start: startISO,
            end: endISO,
            color: subjectColors[event.subject] || "#888"
        });
    });
});
