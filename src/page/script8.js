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
    let bookedSlots8 = JSON.parse(localStorage.getItem('bookedSlots8')) || {};
    if(!bookedSlots8[day]){
        bookedSlots8[day] = [];
    }
    bookedSlots8[day].push({ time: timeSlot, bookedBy: name });
    localStorage.setItem('bookedSlots8', JSON.stringify(bookedSlots8));
}
//gets the slots that are booked
function getBookedSlots(){
    return JSON.parse(localStorage.getItem('bookedSlots8')) || {};
}


//generates empty slots + booked slots (look further down)
function generateEmptySlots() {
    const days = document.querySelectorAll('.day:not(.time-column) .day-booking');
    let currentHour = new Date().getHours();
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();


    // reset booked slots every Sunday
    if (currentDayOfWeek === 0) {
        localStorage.removeItem('bookedSlots8');
    }

    const bookedSlots8 = getBookedSlots();

    days.forEach((column, index) => {
        column.innerHTML = '';
        const dayName = column.parentElement.querySelector('span').textContent;
        for (let i = 0; i < 24; i++) {
            const emptyBlock = document.createElement('div');
            emptyBlock.classList.add('hour');


            // check for booked slots
            if (bookedSlots8[dayName]) {
                const bookedSlot8 = bookedSlots8[dayName].find(slot => slot.time === i);
                if (bookedSlot8) {
                    emptyBlock.classList.add('booked');
                    emptyBlock.setAttribute('title', `Booked by: ${bookedSlot8.bookedBy}`);
                }
            }

            column.appendChild(emptyBlock);
        }
    });
}




//form submission
document.getElementById('booking-form').addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent form from refreshing the page


    const selectedName = document.getElementById('name').value;
    const selectedDay = document.getElementById('day').value; // Get selected day
    //const selectedTime = document.getElementById('time').value; // Get selected time slot

    const selectedStart = document.getElementById('startTime').value;
    const selectedEnd = document.getElementById('endTime').value;

    //converts time
    /*let timeSlot = parseInt(selectedTime);
    if (selectedTime.includes('PM') && timeSlot !== 12) {
        timeSlot += 12;
    } else if (selectedTime.includes('AM') && timeSlot === 12) {
        timeSlot = 0; // Handle 12 AM as 0 hour
    }*/

    let slotStart = parseInt(selectedStart);
    if (selectedStart.includes('PM') && slotStart !== 12) {
        slotStart += 12;
    } else if (selectedStart.includes('AM') && slotStart === 12) {
        slotStart = 0; // Handle 12 AM as 0 hour
    }

    let slotEnd = parseInt(selectedEnd);
    if (selectedEnd.includes('PM') && slotEnd !== 12) {
        slotEnd += 12;
    } else if (selectedEnd.includes('AM') && slotEnd === 12) {
        slotEnd = 0; // Handle 12 AM as 0 hour
    }

    if(slotEnd-slotStart <= 0){
        alert("Invalid time slot. Try again!");
        return;
    }
    if(slotEnd-slotStart > 3){
        alert("Can't book over 3 hours. Try again!");
        return;
    }



    //finds the correct column
    const days = document.querySelectorAll('.day:not(.time-column)');
    const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(selectedDay);


    //finds correct row
    const selectedDayColumn = days[dayIndex].querySelector('.day-booking');
    const timeBlocks = selectedDayColumn.querySelectorAll('.hour');


    timeBlocks.forEach((block, index) => {
        block.classList.remove('selected');

        /*if (index === timeSlot) {
            block.classList.add('selected');
            saveBookedSlot(selectedDay, timeSlot, selectedName);
        }*/
        for(let i = slotStart; i < slotEnd; i++) {
            if (index === i) {
                block.classList.add('selected');
                saveBookedSlot(selectedDay, i, selectedName);
            }
        }
    });
    saveBookedSlot(selectedDay, slotStart, selectedName);
    generateEmptySlots();
});


window.onload = function() {
    getWeek();
    updateDates();
    generateTimeSlots();
    generateEmptySlots();
};
