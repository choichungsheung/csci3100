import React, { useState, useEffect } from 'react';
import DayView from './DayView';
import MonthView from './MonthView';
import WeekView from './WeekView';
import CalendarBlock from './CalendarBlock';


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

    const renderWeek = () => {
        // Get the day of the week for the given date (0 = Sunday, 6 = Saturday)
        const currentDayOfWeek = date.getDay();
        
        // Calculate the start of the week (assuming week starts on Sunday)
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - currentDayOfWeek); // Move to Sunday of the current week
    
        const weekBlocks = [];
    
        // Render 7 blocks for the week
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + i); // Increment by i days
            const dayNumber = dayDate.getDate(); // Get the day number (1-31)
    
            weekBlocks.push(
                <div key={`day-${i}`} className="CalendarBlock" style={{
                    width: '100%',zIndex:5,height:'100%'
                }}>
                    <CalendarBlock
                        date={date}
                        setDate={setDate}
                        currentDay={dayNumber}
                        tasks={tasks}
                        setTasks={setTasks}
                        setSelectedView={setSelectedView}
                        blockDate={dayDate} // Pass the actual date for this block
                        maxTaskDisplay={5} // Limit to 5 tasks per block
                    />
                </div>
            );
        }
    
        return weekBlocks;
    }

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
                <div style={{overflow:'auto'}}>
                <div className="weekday-header" style={{ marginLeft:'60px',minWidth:'1050px' }}>
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div style={{marginLeft:'60px' ,display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', height:'110px', minWidth:'1050px'}}>
                    {renderWeek()}
                </div>
                </div>
            )}

            <div className="calendar-view">
                {renderView()}
            </div>
        </div>
    );
};

export default ViewSelect;