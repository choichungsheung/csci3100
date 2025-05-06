import React, { useState, useEffect } from 'react';
import DayView from './DayView';
import MonthView from './MonthView';
import WeekView from './WeekView';

const ViewSelect = () => {
    const [selectedView, setSelectedView] = useState('day'); // Default to 'day'
    const [date, setDate] = useState(new Date()); // Default to today's date

    // This effect will run whenever selectedView changes
    useEffect(() => {
        console.log(`View changed to: ${selectedView}`);
    }, [selectedView]);

    const handlePrevious = () => {
        const currentDate = new Date(date);
        
        switch (selectedView) {
            case 'day':
                currentDate.setDate(currentDate.getDate() - 1);
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() - 7);
                break;
            case 'month':
                currentDate.setMonth(currentDate.getMonth() - 1);
                break;
            default:
                break;
        }
        
        setDate(currentDate);
    };

    const handleNext = () => {
        const currentDate = new Date(date);
        
        switch (selectedView) {
            case 'day':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case 'week':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'month':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
            default:
                break;
        }
        
        setDate(currentDate);
    };

    const getHeaderText = () => {
        const options = { 
            weekday: 'long',
            day: 'numeric',
            month: 'long', 
            year: 'numeric'
        };
        
        switch (selectedView) {
            case 'day':
                return date.toLocaleDateString('en-US', options);
            case 'week': {
                const weekStart = new Date(date);
                const dayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday
                weekStart.setDate(date.getDate() - dayOfWeek);
                
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                
                return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            }
            case 'month':
                return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            default:
                return '';
        }
    };

    const renderView = () => {
        switch (selectedView) {
            case 'day':
                return <DayView date={date} setDate={setDate} />;
            case 'month':
                return <MonthView date={date} setDate={setDate} setSelectedView={setSelectedView}/>;
            case 'week':
                return <WeekView date={date} setDate={setDate}/>;
            default:
                return null;
        }
    };

    const renderWeekdayHeader = () => {
        if (selectedView === 'month') {
            return (
                <div className="weekday-header">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="date-navigation">
                    <button className="icon-button" onClick={handlePrevious}>
                        <span>←</span>
                    </button>
                    <h2>{getHeaderText()}</h2>
                    <button className="icon-button" onClick={handleNext}>
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

            {renderWeekdayHeader()}
            
            <div className="calendar-view">
                {renderView()}
            </div>
        </div>
    );
};

export default ViewSelect;