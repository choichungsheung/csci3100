import React, { useState } from 'react';
import DayView from './DayView';
import MonthView from './MonthView';
import WeekView from './WeekView';

const ViewSelect = () => {
    const [selectedView, setSelectedView] = useState('day'); // Default to 'day'

    const renderView = () => {
        switch (selectedView) {
            case 'day':
                return <DayView />;
            case 'month':
                return <MonthView />;
            case 'week':
                return <WeekView />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h1>ViewSelect Component</h1>
            <div>
                {/* view select button */}
                <button onClick={() => setSelectedView('day')}>Day View</button>
                <button onClick={() => setSelectedView('month')}>Month View</button>
                <button onClick={() => setSelectedView('week')}>Week View</button>
            </div>
            <div>
                {/* display from monday to sunday */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => (
                        <div key={index} style={{ flex: 1, textAlign: 'right' }}>
                            {day}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                {/* day/month/week view component */}
                {renderView()}
            </div>
        </div>
    );
};

export default ViewSelect;