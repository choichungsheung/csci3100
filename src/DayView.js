import React, { useEffect, useState } from 'react';
import TaskBlock from './TaskBlock';
import EditDeleteOption from './EditDeleteOption';



const DayView = ({ date, setDate ,tasks, setTasks, setEditEventID}) => {
    const [currentTimePosition, setCurrentTimePosition] = useState(0);
    const [selectedLayer, setSelectedLayer] = useState(0); // Track the selected layer
    const [activeBubble, setActiveBubble] = useState(null); // Track the active bubble (task eventID)

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

    // Filter tasks for today and exclude crossADay tasks
    const tasks_temp = tasks
        .filter((task) => {
            const taskStartDate = new Date(task.startTime);
            return (
                taskStartDate.toDateString() === date.toDateString() &&
                !task.crossADay
            );
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
        }); // Sort by start time

    // Organize tasks into layers
    const layers = [[]]; // Start with one layer

    tasks_temp.forEach((task) => {
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

    


    // Handle layer selection
    const handleLayerClick = (layerIndex) => {
        if (selectedLayer !== layerIndex) {
            // Select the clicked layer
            setSelectedLayer(layerIndex);
            setActiveBubble(null); // Close any active bubble
        }
    };

    // Handle task block click
    const handleTaskBlockClick = (eventID, layerIndex) => {
        if (selectedLayer === layerIndex) {
            // If the layer is already selected, toggle the bubble for the clicked task
            setActiveBubble((prevBubble) => (prevBubble === eventID ? null : eventID));
        } else {
            // Select the layer but do not show the bubble
            handleLayerClick(layerIndex);
        }
    };

    // Close the bubble and deselect the layer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Ignore clicks on the view selection buttons
            if (event.target.closest('.view-select')) {
                return;
            }

            // Deselect the layer and close any active bubble
            setSelectedLayer(null);
            setActiveBubble(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    // Calculate TaskBlock positions
    const initialMargin = 30; // Initial margin for the first layer
    const offsetMargin = 35; // Offset margin for each subsequent layer

    const renderTaskBlock = (task, layerIndex) => {
        const taskStart = new Date(task.startTime);
        const taskEnd = new Date(task.endTime);
        const top = ((taskStart.getHours() * 60 + taskStart.getMinutes()) / 1440) * 100; // Top position as a percentage of the day
        const height = ((taskEnd - taskStart) / (1000 * 60 * 1440)) * 100; // Height as a percentage of the day

        // If the task is a display-only copy, find the original task
        const taskToPass = task.forDisplay
            ? tasks.find((t) => t.eventID === task.eventID && t.crossADay)
            : task;

        // Pass EditDeleteOption as a prop if the bubble should be active
        const editDeleteBubble =
        activeBubble === task.eventID && selectedLayer === layerIndex ? (
            <EditDeleteOption
                setEditEventID={setEditEventID}
                eventID={task.eventID}
                setTasks={setTasks}
            />
        ) : null;

        return (
            <div key={task.eventID}
            onClick={(e) => {
                e.stopPropagation(); // Prevent click from propagating to the document
                handleTaskBlockClick(task.eventID, layerIndex);
            }}
            >
                <TaskBlock
                    key={task.eventID}
                    top={top}
                    height={height}
                    task={taskToPass}
                    showDetails={selectedLayer === layerIndex}
                    editDeleteBubble={editDeleteBubble} // Pass the bubble as a prop
                    
                />
            </div>
        );
    };

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

                    {/* Render Task Blocks */}
                    {layers.map((layer, layerIndex) => (
                        <div
                            key={layerIndex}
                            style={{
                                marginLeft: `${initialMargin + offsetMargin * layerIndex}px`,
                            }}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent click from propagating to the document
                                handleLayerClick(layerIndex);
                            }}
                        >
                            {layer.map((task) => renderTaskBlock(task, layerIndex))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DayView;