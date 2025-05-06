import React from 'react';
import CalendarBlock from './CalendarBlock';

const MonthView = ({ date, setDate, setSelectedView }) => {
    /**
     * Calendar Rendering Logic:
     * 1. Calculate the first day of the current month and determine its day of the week (0 = Sunday, 6 = Saturday).
     * 2. Calculate the total number of days in the current month.
     * 3. Render blocks for days from the previous month to fill the first row.
     * 4. Render a block for each day of the current month.
     * 5. Render blocks for days from the next month to complete the last row.
     * 6. Display the calendar as a grid with 7 columns, representing the days of the week.
     * 7. Highlight the current day if it's within the displayed month.
     */
    const renderCalendar = () => {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1); // Set day to 1
        const firstDayOfWeek = firstDayOfMonth.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Get total days in the month
        
        // Get the number of days in the previous month
        const daysInPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        
        // Get today's date information
        const today = new Date();
        const isCurrentMonth = today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
        const todayDate = today.getDate();

        const calendarBlocks = [];
        
        // Render days from the previous month
        for (let i = 0; i < firstDayOfWeek; i++) {
            const prevMonthDay = daysInPrevMonth - firstDayOfWeek + i + 1;
            const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, prevMonthDay);
 
            const handleClick = () => {
                console.log("CalendarBlock clicked, date:", prevMonthDate);
                console.log("setSelectedView function exists:", typeof setSelectedView === 'function');
                
                if (prevMonthDate) {
                    // Use the actual date from the block
                    setDate(prevMonthDate);
                    
                    // Make sure setSelectedView exists and is a function
                    if (typeof setSelectedView === 'function') {
                        console.log("Calling setSelectedView with 'day'");
                        setSelectedView('day');
                    } else {
                        console.error("setSelectedView is not a function:", setSelectedView);
                    }
                }
            };

            calendarBlocks.push(
                <div key={`prev-${i}`} className="CalendarBlock other-month" onClick={handleClick}>
                    <CalendarBlock 
                        date={date} 
                        setDate={setDate} 
                        setSelectedView={setSelectedView}
                        currentDay={prevMonthDay} 
                        isLastMonth={true}
                        isNextMonth={false}
                        actualDate={prevMonthDate}
                    />
                </div>
            );
        }

        // Render blocks for each day of the current month
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = isCurrentMonth && i === todayDate;
            const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
            
            const handleClick = () => {
                console.log("CalendarBlock clicked, date:", currentDate);
                console.log("setSelectedView function exists:", typeof setSelectedView === 'function');
                
                if (currentDate) {
                    // Use the actual date from the block
                    setDate(currentDate);
                    
                    // Make sure setSelectedView exists and is a function
                    if (typeof setSelectedView === 'function') {
                        console.log("Calling setSelectedView with 'day'");
                        setSelectedView('day');
                    } else {
                        console.error("setSelectedView is not a function:", setSelectedView);
                    }
                }
            };

            calendarBlocks.push(
                <div key={`day-${i}`} className={`CalendarBlock ${isToday ? 'td' : ''}`} onClick={handleClick}>
                    <CalendarBlock 
                        date={date} 
                        setDate={setDate} 
                        setSelectedView={setSelectedView}
                        currentDay={i}
                        isToday={isToday}
                        isLastMonth={false}
                        isNextMonth={false}
                        actualDate={currentDate}
                    />
                </div>
            );
        }
        
        // Calculate how many days from next month we need to display to complete the grid
        // A complete calendar has either 5 or 6 rows (35 or 42 cells)
        const totalCells = 42; // 6 rows of 7 days
        const remainingCells = totalCells - (firstDayOfWeek + daysInMonth);
        
        // Render days from the next month to complete the grid
        for (let i = 1; i <= remainingCells; i++) {
            const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
 
            const handleClick = () => {
                console.log("CalendarBlock clicked, date:", nextMonthDate);
                console.log("setSelectedView function exists:", typeof setSelectedView === 'function');
                
                if (nextMonthDate) {
                    // Use the actual date from the block
                    setDate(nextMonthDate);
                    
                    // Make sure setSelectedView exists and is a function
                    if (typeof setSelectedView === 'function') {
                        console.log("Calling setSelectedView with 'day'");
                        setSelectedView('day');
                    } else {
                        console.error("setSelectedView is not a function:", setSelectedView);
                    }
                }
            };
            
            calendarBlocks.push(
                <div key={`next-${i}`} className="CalendarBlock other-month" onClick={handleClick}>
                    <CalendarBlock 
                        date={date} 
                        setDate={setDate} 
                        setSelectedView={setSelectedView}
                        currentDay={i} 
                        isLastMonth={false}
                        isNextMonth={true}
                        actualDate={nextMonthDate}
                    />
                </div>
            );
        }

        return calendarBlocks;
    };

    return (
        <div className='monthview-outer'>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                {renderCalendar()}
            </div>
        </div>
    );
};

export default MonthView;