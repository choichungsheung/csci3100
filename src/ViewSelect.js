import React, { useState } from 'react';
import DayView from './DayView';
import MonthView from './MonthView';
import WeekView from './WeekView';

const ViewSelect = () => {
    const [selectedView, setSelectedView] = useState('day'); // Default to 'day'
    const [date, setDate] = useState(new Date()); // Default to today's date

    const subtractOneMonth = () => {
        const currentDate = new Date(date);
        currentDate.setMonth(currentDate.getMonth() - 1);
        setDate(currentDate);
    };

    const addOneMonth = () => {
        const currentDate = new Date(date);
        currentDate.setMonth(currentDate.getMonth() + 1);
        setDate(currentDate);
    };

    const renderView = () => {
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
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="date-navigation">
                    <button className="icon-button" onClick={subtractOneMonth}>
                        <span>←</span>
                    </button>
                    <h2>{date.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long'
                    })}</h2>
                    <button className="icon-button" onClick={addOneMonth}>
                        <span>→</span>
                    </button>
                </div>

                <div className="view-select">
                    <button 
                        className={selectedView === 'day' ? 'active' : ''} 
                        onClick={() => setSelectedView('day')}
                    >
                        Day
                    </button>
                    <button 
                        className={selectedView === 'week' ? 'active' : ''} 
                        onClick={() => setSelectedView('week')}
                    >
                        Week
                    </button>
                    <button 
                        className={selectedView === 'month' ? 'active' : ''} 
                        onClick={() => setSelectedView('month')}
                    >
                        Month
                    </button>
                </div>
            </div>

            {selectedView === 'month' && (
                <div className="weekday-header">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
            )}
            
            <div className="calendar-view">
                {renderView()}
            </div>
        </div>
    );
};

export default ViewSelect;