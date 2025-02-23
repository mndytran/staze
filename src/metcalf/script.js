//gets what week it is for header
function getWeek() {
    let currentDate = new Date();
    let dayOfWeek = currentDate.getDay();


    let daysToSubtract = dayOfWeek;
    currentDate.setDate(currentDate.getDate() - daysToSubtract);


    let startDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    document.getElementById("calendar-header").textContent = "Week of " + startDate;
}

//gets the dates based on the sunday
function updateDates() {
    const days = document.querySelectorAll('.day:not(.time-column) p');


    let currentDate = new Date();
    let dayOfWeek = currentDate.getDay();


    let daysToSubtract = dayOfWeek;
    currentDate.setDate(currentDate.getDate() - daysToSubtract);


    for (let i = 0; i < days.length; i++) {
        days[i].textContent = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

//generates the time table BUT NOT WEEKDAYS
function generateTimeSlots() {
    const timeColumn = document.querySelector('.time-column .day-booking');
    timeColumn.innerHTML = '';


    for (let i = 0; i < 24; i++) {
        const hourBlock = document.createElement('div');
        hourBlock.classList.add('hour');


        let hour;
        let period;


        if (i == 0) {
            hour = 12;
            period = 'AM';
        } else if (i < 12) {
            hour = i;
            period = 'AM';
        } else if (i == 12) {
            hour = 12;
            period = 'PM';
        } else {
            hour = i - 12;
            period = 'PM';
        }


        hourBlock.textContent = `${hour}:00 ${period}`;
        timeColumn.appendChild(hourBlock);
    }
}

//saves new time slot for a DAY in the week
function saveBookedSlot(day, timeSlot, name){
    let bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || {};
    if(!bookedSlots[day]){
        bookedSlots[day] = [];
    }
    bookedSlots[day].push({ time: timeSlot, bookedBy: name });
    localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
}
//gets the slots that are booked
function getBookedSlots(){
    return JSON.parse(localStorage.getItem('bookedSlots')) || {};
}

//generates empty slots + booked slots (look further down)
function generateEmptySlots() {
    const days = document.querySelectorAll('.day:not(.time-column) .day-booking');
    let currentHour = new Date().getHours(); // Get the current hour

    const bookedSlots = getBookedSlots();

    days.forEach((column, index) => {
        column.innerHTML = '';
        const dayName = column.parentElement.querySelector('span').textContent;
        for (let i = 0; i < 24; i++) {
            const emptyBlock = document.createElement('div');
            emptyBlock.classList.add('hour');

            if(bookedSlots[dayName]){
                const bookedSlot = bookedSlots[dayName].find(slot => slot.time === i)
                if(bookedSlot){
                    emptyBlock.classList.add('booked');
                    emptyBlock.setAttribute('title', `Booked by: ${bookedSlot.bookedBy}`);
                }
            }
            //colors the corresponding slot
            /*if (bookedSlots[dayName] && bookedSlots[dayName].includes(i)) {
                emptyBlock.classList.add('booked');
            }*/
            column.appendChild(emptyBlock);
        }
    });
}

//form submission
document.getElementById('booking-form').addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent form from refreshing the page

    const selectedName = document.getElementById('name').value;
    const selectedDay = document.getElementById('day').value; // Get selected day
    const selectedTime = document.getElementById('time').value; // Get selected time slot

    //converts time
    let timeSlot = parseInt(selectedTime);
    if (selectedTime.includes('PM') && timeSlot !== 12) {
        timeSlot += 12;
    } else if (selectedTime.includes('AM') && timeSlot === 12) {
        timeSlot = 0; // Handle 12 AM as 0 hour
    }

    //finds the correct column
    const days = document.querySelectorAll('.day:not(.time-column)');
    const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(selectedDay);

    //finds correct row
    const selectedDayColumn = days[dayIndex].querySelector('.day-booking');
    const timeBlocks = selectedDayColumn.querySelectorAll('.hour');

    timeBlocks.forEach((block, index) => {
        block.classList.remove('selected');
        if (index === timeSlot) {
            block.classList.add('selected');
            saveBookedSlot(selectedDay, timeSlot);
        }
    });
    saveBookedSlot(selectedDay, timeSlot, selectedName);
    generateEmptySlots();
});

window.onload = function() {
    getWeek();
    updateDates();
    generateTimeSlots();
    generateEmptySlots();
};
