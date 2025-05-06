import React from 'react';
//import './CalendarBlock.css';

const CalendarBlock = ({ date, setDate, currentDay, isToday, isLastMonth, isNextMonth, actualDate, setSelectedView }) => {
    // Skip rendering for empty blocks (older version)
    if (currentDay === 0) {
        return <div className="CalendarBlock empty"></div>;
    }

    const handleClick = () => {
        console.log("CalendarBlock clicked, date:", actualDate);
        console.log("setSelectedView function exists:", typeof setSelectedView === 'function');
        
        if (actualDate) {
            // Use the actual date from the block
            setDate(actualDate);
            
            // Make sure setSelectedView exists and is a function
            if (typeof setSelectedView === 'function') {
                console.log("Calling setSelectedView with 'day'");
                setSelectedView('day');
            } else {
                console.error("setSelectedView is not a function:", setSelectedView);
            }
        }
    };

    // Determine the appropriate class names for styling
    const blockClassNames = [
        //'CalendarBlock',
        //isToday ? 'today' : '',
        //isOtherMonth ? 'other-month' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={blockClassNames} onClick={handleClick}>
            <span>{currentDay}</span>
        </div>
    );
};

export default CalendarBlock;