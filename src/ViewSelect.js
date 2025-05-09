import React, { useState, useEffect } from 'react';
import DayView from './DayView';
import MonthView from './MonthView';
import WeekView from './WeekView';

const ViewSelect = ({tasks, setTasks, setEditEventID}) => {
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
                return <DayView date={date} setDate={setDate} tasks={tasks} setTasks={setTasks} setEditEventID={setEditEventID}/>;
            case 'month':
                return <MonthView date={date} setDate={setDate} tasks={tasks} setTasks={setTasks} setSelectedView={setSelectedView}/>;
            case 'week':
                return <WeekView date={date} setDate={setDate} tasks={tasks} setTasks={setTasks} setEditEventID={setEditEventID} setSelectedView={setSelectedView}/>;
            default:
                return null;
        }
    };

    // Function to check if the displayed date is in the current display
    const isSameDay = (date1, date2) => {
        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
        );
      };
    
      const isSameWeek = (date, currentDate) => {
        const weekStart = new Date(date.getTime());
        const dayOfWeek = date.getDay();
        weekStart.setDate(date.getDate() - dayOfWeek);
    
        for (let i = 0; i < 7; i++) {
          const weekDay = new Date(weekStart.getTime());
          weekDay.setDate(weekStart.getDate() + i);
          if (isSameDay(weekDay, currentDate)) {
            return true;
          }
        }
        return false;
      };
    
      const isSameMonth = (date1, date2) => {
        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth()
        );
      };
    
      const isInCurrent = () => {
        const today = new Date();
        const currentDate = new Date(date);
    
        switch (selectedView) {
          case 'day':
            return isSameDay(currentDate, today);
          case 'week':
            return isSameWeek(currentDate, today);
          case 'month':
            return isSameMonth(currentDate, today);
          default:
            console.warn(`Invalid selectedView: ${selectedView}`);
            return false;
        }
      };

    const isCurrent = isInCurrent();

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="date-navigation">
                    <button className="icon-button" onClick={handlePrevious}>
                        <span>←</span>
                    </button>
                    <h2 
                    
                        style = {{ 
                            color: isCurrent ? 'pink' : '' ,
                            backgroundColor: isCurrent ? '#3c4043' : 'transparent',
                            padding: isCurrent ? '2px 8px' : '0',
                            borderRadius: isCurrent ? '4px' : '0'
                        }}
                    >{getHeaderText()}</h2>
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
            
            {selectedView === 'week' && (
                <div className="weekday-header-week">
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