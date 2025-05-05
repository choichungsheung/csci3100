import React from 'react';
import { Icon } from '@iconify/react'; // Import Iconify for rendering icons

const CalendarBlock = ({ date, setDate, currentDay, tasks, setTasks, setSelectedView }) => {
    if (currentDay === 0) {
        return null; // Return nothing for empty blocks
    }

    tasks = tasks.filter((task) => !task.crossADay);
    
    const handleClick = () => {
        // Create a new date object with the same year and month, but replace the day with currentDay
        const newDate = new Date(date);
        newDate.setDate(currentDay);

        // Update the date and switch to the 'day' view
        setDate(newDate);
        setSelectedView('day');
    };

    const isToday = () => {
        const today = new Date();
        return (
            currentDay === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const getIconColor = (color) => {
        // Convert hex color to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Calculate grayscale value
        const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;

        // Return black or white based on the grayscale value
        return grayscale > 127 ? '#4D4D4D' : '#fff';
    };

    // Filter tasks that start on the date represented by the CalendarBlock
    const blockDate = new Date(date);
    blockDate.setDate(currentDay); // Replace the day with currentDay
    const tasksForBlock = tasks.filter((task) => {
        const taskStartDate = new Date(task.startTime);
        return (
            taskStartDate.getDate() === blockDate.getDate() &&
            taskStartDate.getMonth() === blockDate.getMonth() &&
            taskStartDate.getFullYear() === blockDate.getFullYear()
        );
    });

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
               
            }}
            onClick={handleClick} // Attach the click handler
            
        >
            {/* Day Circle */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '35px',
                    width: '35px',
                    borderRadius: '50%',
                    background: isToday() ? 'rgb(215, 192, 231)' : 'transparent',
                }}
            >
                {currentDay}
            </div>

            {/* Task Color-Icon Squares */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    marginTop: '7px',
                    gap: '6px',
                    padding: '0 9px',
                }}
            >
                {/* individual icon squares*/ }
                {tasksForBlock.slice(0, 10).map((task, index) => (
                    <div
                        key={index}
                        style={{
                            width: '17px',
                            height: '17px',
                            borderRadius: '3px',
                            backgroundColor: task.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            icon={task.icon}
                            style={{
                                fontSize: '12px',
                                color: getIconColor(task.color), // Dynamically set the icon color
                            }}
                        />
                    </div>
                ))}
                {tasksForBlock.length > 10 && (
                    <div
                        style={{
                            width: '15px',
                            height: '15px',
                            borderRadius: '3px',
                            backgroundColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            icon="tabler:dots"
                            style={{
                                fontSize: '10px',
                                color: '#555',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarBlock;