import React from 'react';

// CalendarBlock.js


const CalendarBlock = ({ date, setDate, currentDay }) => {
    if (currentDay === 0) {
        return;
    }
    return (
        <div style={{ height: '100%', width: '100%' }}>
            {currentDay}
        </div>
    );
};

export default CalendarBlock;