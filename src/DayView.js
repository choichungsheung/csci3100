import React from 'react';

const DayView = ({ date, setDate }) => {
    
    return (
        <div>
            <h1>DayView Component {date.toDateString()}</h1>
        </div>
    );
};

export default DayView;