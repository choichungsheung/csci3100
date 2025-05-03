import React, { useEffect, useState } from 'react';

const WeekView = ({ date, setDate }) => {
    const [currentTimePosition, setCurrentTimePosition] = useState(0);

    // Generate time labels (24-hour format)
    const timeLabels = Array.from({ length: 24 }, (_, i) => 
        `${i.toString().padStart(2, '0')}:00`
    );

    // Get week days
    const getWeekDays = () => {
        const days = [];
        const currentDay = new Date(date);
        currentDay.setDate(currentDay.getDate() - currentDay.getDay()); // Start from Sunday
        
        for (let i = 0; i < 7; i++) {
            days.push(new Date(currentDay));
            currentDay.setDate(currentDay.getDate() + 1);
        }
        return days;
    };

    // Update current time indicator
    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            const minutes = now.getHours() * 60 + now.getMinutes();
            setCurrentTimePosition((minutes / 1440) * 100); // 1440 = minutes in a day
        };

        updateCurrentTime();
        const interval = setInterval(updateCurrentTime, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="time-grid-container">
            {/* Time axis */}
            <div className="time-axis">
                {timeLabels.map((label) => (
                    <div key={label} className="time-label">
                        {label}
                    </div>
                ))}
            </div>

            {/* Week grid */}
            <div className="time-grid week-grid">
                {/* Header */}
                <div className="time-grid-header">
                    {getWeekDays().map((day, index) => (
                        <div key={index} className="week-column">
                            {day.toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                            })}
                        </div>
                    ))}
                </div>

                {/* Time grid */}
                <div className="time-grid">
                    {timeLabels.map((_, index) => (
                        <div key={index} className="time-grid-row">
                            {Array(7).fill(null).map((_, dayIndex) => (
                                <div key={dayIndex} className="week-column" />
                            ))}
                        </div>
                    ))}

                    {/* Current time indicator */}
                    <div 
                        className="current-time-indicator"
                        style={{ top: `${currentTimePosition}%` }}
                    >
                        <div className="current-time-dot" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeekView;