import React, { useState } from 'react';
import DayView from './DayView';
import MonthView from './MonthView';
import WeekView from './WeekView';

const ViewSelect = () => {
    const [selectedView, setSelectedView] = useState('day'); // Default to 'day'
    const [date, setDate] = useState(new Date()); // Default to today's date, will pass to day/month/week view components

    //function to add and subtract one month from current date
    const subtractOneMonth = () => {
        const currentDate = new Date(date);
        currentDate.setMonth(currentDate.getMonth() - 1); // Subtract 1 month
        setDate(currentDate); // Update the state with the new date
    };
    const addOneMonth = () => {
        const currentDate = new Date(date);
        currentDate.setMonth(currentDate.getMonth() + 1); // add 1 month
        setDate(currentDate); // Update the state with the new date
    };

    const renderView = () => { // Function to render the correct view based on selectedView
        switch (selectedView) {
            case 'day':
                return <DayView date={date} setDate={setDate} />;
            case 'month':
                return <MonthView date={date} setDate={setDate}/>;
            case 'week':
                return <WeekView date={date} setDate={setDate}/>;
            default:
                return null;
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
                <button onClick={subtractOneMonth}>Subtract 1 Month</button>{/* Subtract one month button */}
                {/* turn date into string and only shows year and month */}
                <h1>
                    {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </h1>
                <button onClick={addOneMonth}>add 1 Month</button>{/*add one month button */}
            </div>
            <div>
                {/* View select buttons */}
                <button onClick={() => setSelectedView('day')}>Day View</button>
                <button onClick={() => setSelectedView('month')}>Month View</button>
                <button onClick={() => setSelectedView('week')}>Week View</button>
            </div>
                {/* week bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'right' }}>
                    <div style={{ marginRight: '6px', fontSize: '1.1em' }}>SUN</div>
                    <div style={{ marginRight: '6px', fontSize: '1.1em' }}>MON</div>
                    <div style={{ marginRight: '6px', fontSize: '1.1em' }}>TUE</div>
                    <div style={{ marginRight: '6px', fontSize: '1.1em' }}>WED</div>
                    <div style={{ marginRight: '6px', fontSize: '1.1em' }}>THU</div>
                    <div style={{ marginRight: '6px', fontSize: '1.1em' }}>FRI</div>
                    <div style={{ marginRight: '6px', fontSize: '1.1em' }}>SAT</div>
                </div>
            
            <div>
                {renderView()}
            </div>
        </div>
    );
};

export default ViewSelect;