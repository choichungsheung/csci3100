import React from 'react';
import CalendarBlock from './CalendarBlock';


const MonthView = ({ date, setDate }) => {
    /**
     * Calendar Rendering Logic:
     * 1. Calculate the first day of the current month and determine its day of the week (0 = Sunday, 6 = Saturday).
     * 2. Calculate the total number of days in the current month.
     * 3. Render empty blocks to align the first day of the month to the correct position in a 7-column grid.
     * 4. Render a block for each day of the month, starting from the aligned position.
     * 5. Display the calendar as a grid with 7 columns, representing the days of the week.
     */
    const renderCalendar = () => {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1); // Set day to 1
        const firstDayOfWeek = firstDayOfMonth.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Get total days in the month

        const calendarBlocks = [];
        let currentDay = 1;

        // Render empty blocks before the first day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            calendarBlocks.push(
                <div key={`empty-${i}`} className="CalendarBlock">
                    {/* Empty block */}
                    {/* currentDay is 0 if empty */}
                    <CalendarBlock date={date} setDate={setDate} currentDay={0} />
                </div>
            );
        }

        // Render blocks for each day of the month
        for (let i = 0; i < daysInMonth; i++) {
            calendarBlocks.push(
                <div key={`day-${currentDay}`} className="CalendarBlock">
                    <CalendarBlock date={date} setDate={setDate} currentDay={currentDay} />
                </div>
            );
            currentDay++;
        }

        return calendarBlocks;
    };

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                {renderCalendar()}
            </div>
        </div>
    );
};

export default MonthView;