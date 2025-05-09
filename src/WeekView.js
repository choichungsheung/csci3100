import React, { useEffect, useState, useRef } from 'react';
import TaskBlock from './TaskBlock';
import EditDeleteOption from './EditDeleteOption';
import CalendarBlock from './CalendarBlock';



const WeekView = ({ date, setDate ,tasks, setTasks, setEditEventID, setSelectedView}) => {
    const [currentTimePosition, setCurrentTimePosition] = useState(null);
    const [selectedLayer, setSelectedLayer] = useState(null); // Track the selected layer
    const [activeBubble, setActiveBubble] = useState(null); // Track the active bubble (task eventID)
    const dayGridRef = useRef(null); // Ref for the day grid container
    const hasScrolledToCurrentTime = useRef(false); // Track if the scroll has already occurred
    const [todayIndex, setTodayIndex] = useState(-1);

    // Generate time labels (24-hour format)
    const timeLabels = Array.from({ length: 25 }, (_, i) => 
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
                <div key={`day-${i}`} className="CalendarBlock-week">
                    <CalendarBlock
                        date={date}
                        setDate={setDate}
                        currentDay={dayNumber}
                        tasks={tasks}
                        setTasks={setTasks}
                        setSelectedView={setSelectedView}
                        blockDate={dayDate} // Pass the actual date for this block
                    />
                </div>
            );
        }
    
        return weekBlocks;
    }

    // Update current time indicator and check if today is in the current week view
    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            const minutes = now.getHours() * 60 + now.getMinutes();
            setCurrentTimePosition((minutes / 1440) * 100); // 1440 = minutes in a day
            
            // Find today in the week view
            const weekDays = getWeekDays();
            const today = new Date();
            
            // Reset time parts for accurate date comparison
            today.setHours(0, 0, 0, 0);
            
            const todayIdx = weekDays.findIndex(day => {
                const compareDay = new Date(day);
                compareDay.setHours(0, 0, 0, 0);
                return compareDay.getTime() === today.getTime();
            });
            
            setTodayIndex(todayIdx);
        };

        updateCurrentTime();
        const interval = setInterval(updateCurrentTime, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [date]); // Re-run when date changes

    // Filter tasks for the current week
    const week_tasks = tasks.filter((task) => {
        const taskStartDate = new Date(task.startTime);
        const startOfWeek = new Date(date);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7); // End of the week (Saturday)
        endOfWeek.setHours(23, 59, 59, 999);

        return taskStartDate >= startOfWeek && taskStartDate < endOfWeek &&
        !task.crossADay; // Exclude crossADay tasks
    });

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

    // Auto-scroll to the current time on page load
    useEffect(() => {
        if (currentTimePosition !== null && !hasScrolledToCurrentTime.current) {
            if (dayGridRef.current) {
                const containerHeight = 1440;
                const scrollPosition = (currentTimePosition / 100) * containerHeight;
                dayGridRef.current.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth', // Smooth scrolling
                });
            }
            hasScrolledToCurrentTime.current = true; // Mark the scroll as completed    
        }
    }, [currentTimePosition]); // Trigger when currentTimePosition is calculated

    useEffect(() => {
        const handleClickOutside = (event) => {
            setSelectedLayer(null); // Deselect the layer
            setActiveBubble(null); // Close any active bubble
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleLayerClick = (dayIndex, layerIndex) => {
        if (selectedLayer?.dayIndex !== dayIndex || selectedLayer?.layerIndex !== layerIndex) {
            // Select the clicked layer
            setSelectedLayer({ dayIndex, layerIndex });
            setActiveBubble(null); // Close any active bubble
        }
    };

    const handleTaskBlockClick = (eventID, dayIndex, layerIndex) => {
        if (selectedLayer?.dayIndex === dayIndex && selectedLayer?.layerIndex === layerIndex) {
            // If the layer is already selected, toggle the bubble for the clicked task
            setActiveBubble((prevBubble) => (prevBubble === eventID ? null : eventID));
        } else {
            // Select the layer but do not show the bubble
            handleLayerClick(dayIndex, layerIndex);
        }
    };

    const renderTaskBlock = (task, dayIndex, layerIndex) => {
        const taskStart = new Date(task.startTime);
        const taskEnd = new Date(task.endTime);
        const top = (((taskStart.getHours() * 60 + taskStart.getMinutes() + 68) / 1530) * 100); // Top position as a percentage of the day
        const height = ((taskEnd - taskStart) / (1000 * 60 * 1440)) * 100; // Height as a percentage of the day

        // If the task is a display-only copy, find the original task
        const taskToPass = task.forDisplay
            ? tasks.find((t) => t.eventID === task.eventID && t.crossADay)
            : task;
    
        const editDeleteBubble =
            activeBubble === task.eventID &&
            selectedLayer?.dayIndex === dayIndex &&
            selectedLayer?.layerIndex === layerIndex ? (
                <EditDeleteOption
                    setEditEventID={setEditEventID}
                    eventID={task.eventID}
                    setTasks={setTasks}
                />
            ) : null;
    
        return (
            <div
                key={task.eventID}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating to the document
                    handleTaskBlockClick(task.eventID, dayIndex, layerIndex);
                }}
                >
            <TaskBlock
                key={task.eventID}
                top={top}
                height={height}
                task={taskToPass}
                showDetails={
                    selectedLayer?.dayIndex === dayIndex &&
                    selectedLayer?.layerIndex === layerIndex
                }
                editDeleteBubble={editDeleteBubble} // Pass the bubble as a prop
                selectOnly={true} // Pass selectOnly prop to TaskBlock
            />
            </div>
        );
    };

    return (
        <div className="time-grid-container" ref={dayGridRef}>
            {/* Time axis */}
            <div className="time-axis-week">
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
                
                {renderWeek()}
            
                </div>

                {/* Time grid */}
                <div className="time-grid-week">
                    {timeLabels.map((_, index) => (
                        <div key={index} className="time-grid-row">
                            {Array(7).fill(null).map((_, dayIndex) => (
                                <div key={dayIndex} className="week-column" />
                            ))}
                        </div>
                    ))}

                    {/* Current time indicator */}
                    {todayIndex !== -1 && (
                        <div 
                            className="current-time-indicator"
                            style={{ 
                                top: `${currentTimePosition + 4 }%`,
                                left: `${(todayIndex / 7) * 100}%`,
                                width: `${100 / 7}%` // Only span one column width
                            }}
                        >
                            <div className="current-time-dot" />
                        </div>
                    )}

                    {/* Render Task Layers */}
                    <div>
                        {Array(7).fill(null).map((_, dayIndex) => {
                            // Get the date for the current day
                            const currentDay = new Date(date);
                            currentDay.setDate(currentDay.getDate() - currentDay.getDay() + dayIndex); // Start from Sunday

                            // Filter tasks for the current day
                            const dayTasks = week_tasks
                                .filter((task) => {
                                    const taskStartDate = new Date(task.startTime);
                                    return taskStartDate.toDateString() === currentDay.toDateString();
                                })
                                .sort((a, b) => {
                                    const startA = new Date(a.startTime).getTime();
                                    const startB = new Date(b.startTime).getTime();

                                    // First, sort by start time
                                    if (startA !== startB) {
                                        return startA - startB;
                                    }

                                    // If start times are the same, sort by duration (longer duration first)
                                    const durationA = new Date(a.endTime).getTime() - startA;
                                    const durationB = new Date(b.endTime).getTime() - startB;
                                    return durationB - durationA;
                                });

                            // Organize tasks into layers for the current day
                            const layers = [[]]; // Start with one layer
                            dayTasks.forEach((task) => {
                                const taskStart = new Date(task.startTime).getTime();
                                const taskEnd = new Date(task.endTime).getTime();
                                let placed = false;

                                // Try to place the task in an existing layer
                                for (let i = 0; i < layers.length; i++) {
                                    const layer = layers[i];
                                    const conflict = layer.some((layerTask) => {
                                        const layerTaskStart = new Date(layerTask.startTime).getTime();
                                        const layerTaskEnd = new Date(layerTask.endTime).getTime();
                                        return taskStart < layerTaskEnd && taskEnd > layerTaskStart; // Check for overlap
                                    });

                                    if (!conflict) {
                                        layer.push(task);
                                        placed = true;
                                        break;
                                    }
                                }

                                // If the task couldn't be placed in any existing layer, create a new layer
                                if (!placed) {
                                    layers.push([task]);
                                }
                            });

                            // Render layers for the current day
                            return (
                                <div key={dayIndex} style={{ position: 'absolute',top:0, left: `${(dayIndex / 7) * 100}%`, width: '14.28%',height:'100%' }}>
                                    {layers.map((layer, layerIndex) => (
                                        <div
                                            key={layerIndex}
                                            style={{
                                                
                                                marginLeft: `${10 + 20 * layerIndex}px`, // Adjust margins for layers
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent click from propagating to the document
                                                handleLayerClick(dayIndex, layerIndex);
                                            }}
                                        >
                                            {layer.map((task) => renderTaskBlock(task, dayIndex, layerIndex))}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeekView;