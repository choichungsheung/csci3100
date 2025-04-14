import React, { useEffect, useState } from 'react';

const DayView = ({ date, setDate }) => {
    const [currentTimePosition, setCurrentTimePosition] = useState(0);

    // Generate time labels (24-hour format)
    const timeLabels = Array.from({ length: 24 }, (_, i) => 
        `${i.toString().padStart(2, '0')}:00`
    );

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

            {/* Day grid */}
            <div className="time-grid">
                {/* Header */}
                <div className="time-grid-header">
                    {date.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </div>

                {/* Time grid */}
                <div className="time-grid">
                    {timeLabels.map((_, index) => (
                        <div key={index} className="time-grid-row">
                            <div className="day-column" />
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

export default DayView;