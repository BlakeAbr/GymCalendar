document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    const modal = document.getElementById('activityModal');
    const closeModal = document.querySelector('.close');
    const selectedDate = document.getElementById('selectedDate');
    const activityInput = document.getElementById('activityInput');
    const saveActivity = document.getElementById('saveActivity');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function openModal(day, month, year) {
        selectedDate.textContent = `${month + 1}/${day}/${year}`;
        modal.style.display = 'block';
    }

    function generateCalendar(month, year) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const monthLength = lastDay.getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        document.getElementById('monthYearDisplay').textContent = 
            `${monthNames[month]} ${year}`;

        calendar.innerHTML = '';

        // Create weekday headers
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const headerRow = document.createElement('div');
        headerRow.className = 'calendar-row';
        weekdays.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell header';
            cell.textContent = day;
            headerRow.appendChild(cell);
        });
        calendar.appendChild(headerRow);

        // Create calendar grid
        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.className = 'calendar-row';
            
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('div');
                cell.className = 'calendar-cell';
                
                if (i === 0 && j < startingDay) {
                    // Empty cells before the first day
                    cell.className = 'calendar-cell empty';
                } else if (date > monthLength) {
                    // Empty cells after the last day
                    cell.className = 'calendar-cell empty';
                } else {
                    cell.textContent = date;
                    if (date === currentDate.getDate() && 
                        month === currentDate.getMonth() && 
                        year === currentDate.getFullYear()) {
                        cell.className = 'calendar-cell today';
                    }
                    cell.addEventListener('click', () => openModal(date, month, year));
                    date++;
                }
                row.appendChild(cell);
            }
            calendar.appendChild(row);
            if (date > monthLength) break;
        }
    }

    // Navigation functions
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    // Modal controls
    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // Initialize calendar
    generateCalendar(currentMonth, currentYear);

    saveActivity.onclick = function() {
        const activity = activityInput.value;
        console.log(`Activity for ${selectedDate.textContent}: ${activity}`);
        activityInput.value = '';
        modal.style.display = 'none';
    }
});