import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Cookies from "js-cookie"; // Ensure this is imported
import fetchTasks from './utils/fetchTasks';
import { getIconColor } from './utils/colorUtils';

// Predefined list of popular icons for suggestions
const predefinedIcons = [
    "ic:baseline-home",
    "mdi:rubbish",
    "material-symbols:school",
    "material-symbols:science",
    "material-symbols:work",
    "ic:baseline-phone",
    "mdi:pin",
    "material-symbols:shopping-cart",
    "material-symbols:travel",
    "zondicons:travel-car",
    "ic:baseline-email",
    "mdi:basketball",
    "iconoir:gym",
    "material-symbols:pets",
    "streamline:sleep-solid",
    "hugeicons:medicine-02",
    "hugeicons:party",
    "ic:baseline-cake",
    "solar:sun-bold",
    "lets-icons:rain",
    "mdi:umbrella",
    "tabler:book",
    "iconoir:clock-solid",
    "mdi:coffee",
    "ic:baseline-church",
    "mdi:react",
    "mdi:code",
    "lineicons:python",
];

const predefinedColors = ['#E96992', '#69E972', '#69B0E9', '#E3DC68', '#C769E9']; // Default colors



const getLocalDate = (date) => {
    const timezoneOffset = date.getTimezoneOffset(); // Get the timezone offset in minutes
    const adjustedDate = new Date(date.getTime() - timezoneOffset * 60 * 1000); // Adjust the date by the offset
    return adjustedDate.toISOString().split('T')[0]; // Return the date in YYYY-MM-DD format
};

const EditTask = ({ onClose,editEventID, tasks, setTasks}) => {
    const currentHour = new Date().getHours(); // Get the current hour
    const [startHour, setStartHour] = useState(currentHour); // Default hour to current hour
    const [startMinute, setStartMinute] = useState(0); // Default minute to 00
    const [taskName, setTaskName] = useState('');
    const [color, setColor] = useState(predefinedColors[Math.floor(Math.random() * predefinedColors.length)]); // Default color as a random from predefinedColors
    const [icon, setIcon] = useState('mdi:react'); // Default icon as placeholder
    const [iconSuggestions, setIconSuggestions] = useState([]); // Suggestions for icons
    const [showIconSelector, setShowIconSelector] = useState(false); // Toggle icon selector visibility
    const [showColorWheel, setShowColorWheel] = useState(false); // Toggle color wheel visibility
    const [customColors, setCustomColors] = useState([]); // Store custom colors
    const [startTime, setStartTime] = useState(() => {
        const now = new Date();
        now.setSeconds(0, 0); // Remove seconds and milliseconds
        return now;
    }); // Initialize startTime
    const [endTime, setEndTime] = useState(new Date());
    const [description, setDescription] = useState('');
    const [enableNotification, setEnableNotification] = useState(false);
    const [notificationTime, setNotificationTime] = useState(() => new Date(startTime)); // Default notification time to start time
    const [debounceTimeout, setDebounceTimeout] = useState(null); // Timeout for debouncing
    const [isFirstClick, setIsFirstClick] = useState(true); // Track if it's the first click on the square
    const [startDate, setStartDate] = useState(getLocalDate(new Date())); // Default to today in local timezone
    const [endDate, setEndDate] = useState(getLocalDate(new Date())); // Default to today in local timezone
    const [endHour, setEndHour] = useState((new Date().getHours() + 1) % 24); // Default hour to current hour + 1
    const [endMinute, setEndMinute] = useState(0); // Default minute to 00
    const [showStartDatePicker, setShowStartDatePicker] = useState(false); // Toggle start date picker visibility
    const [showEndDatePicker, setShowEndDatePicker] = useState(false); // Toggle end date picker visibility
    const [showNotificationDatePicker, setShowNotificationDatePicker] = useState(false); // Toggle notification date picker visibility
    const [notificationDate, setNotificationDate] = useState(startDate); // Default to start date
    const [notificationHour, setNotificationHour] = useState(startHour); // Default to start hour
    const [notificationMinute, setNotificationMinute] = useState(startMinute); // Default to start minute
    const [isNotificationTimeInitialized, setIsNotificationTimeInitialized] = useState(false); // Track if notification time is initialized

    // Fetch icons from Iconify API based on user input
    const fetchIcons = async (query) => {
        try {
            const response = await fetch(
                `https://api.iconify.design/search?query=${query}`
            );
            const data = await response.json();

            // Update suggestions with the fetched icons
            if (data.icons) {
                setIconSuggestions(data.icons.slice(0, 50)); // Limit to 50 suggestions
            } else {
                setIconSuggestions([]);
            }
        } catch (error) {
            console.error('Error fetching icons:', error);
            setIconSuggestions([]);
        }
    };

    const handleIconInput = (e) => {
        const input = e.target.value;
        setIcon(input);

        // Clear the previous timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set a new timeout to fetch icons after 0.2 seconds
        const timeout = setTimeout(() => {
            if (input.trim()) {
                fetchIcons(input);
            } else {
                setIconSuggestions(predefinedIcons); // Show predefined icons if input is empty
            }
        }, 200);

        setDebounceTimeout(timeout);
    };

    const handleIconSelect = (iconName) => {
        setIcon(iconName); // Set the selected icon
        setShowIconSelector(false); // Hide the icon selector after selection
    };

    const handleSquareClick = () => {
        if (isFirstClick) {
            setIcon(''); // Clear the icon on the first click
            setIsFirstClick(false); // Ensure this only happens once
        }
        setShowIconSelector(!showIconSelector); // Toggle the icon selector visibility
    };

    const handleColorSelect = (selectedColor) => {
        setColor(selectedColor);
        setShowColorWheel(false); // Hide color wheel if it was open
    };

    const handleCustomColorSelect = (e) => {
        const customColor = e.target.value;
        setColor(customColor);

        // If a custom color circle already exists, update its color
        if (customColors.length > 0) {
            setCustomColors([customColor]);
        } else {
            // Add the custom color to the list if it doesn't already exist
            setCustomColors([customColor]);
        }
    };

    const handleStartTimeChange = async () => {
        return new Promise((resolve) => {
            const startDateTime = new Date(startDate); // Create a Date object from the selected start date
            startDateTime.setHours(startHour); // Set the hour
            startDateTime.setMinutes(startMinute); // Set the minute
            setStartTime(startDateTime); // Update the startTime state
            console.log('Start Time:', startDateTime);
            resolve(); // Resolve the promise after setting the start time
        });
    };

    const handleEndTimeChange = async () => {
        return new Promise((resolve) => {
            const endDateTime = new Date(endDate); // Create a Date object from the selected end date
            endDateTime.setHours(endHour); // Set the hour
            endDateTime.setMinutes(endMinute); // Set the minute
            setEndTime(endDateTime); // Update the endTime state
            console.log('End Time:', endDateTime);
            resolve(); // Resolve the promise after setting the end time
        });
    };

    // Updated handlers for start time inputs
    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        const timezoneOffset = new Date().getTimezoneOffset();
        const adjustedDate = new Date(new Date(newStartDate).getTime() - timezoneOffset * 60 * 1000);

        setStartDate(adjustedDate.toISOString().split('T')[0]); // Update startDate with timezone adjustment

        // If the new start date is later than the end date, adjust the end date
        if (newStartDate > endDate) {
            const startDateObj = new Date(newStartDate);
            const endDateObj = new Date(endDate);

            // Calculate the difference in days
            const duration = (endDateObj - new Date(startDate)) / (1000 * 60 * 60 * 24);

            // Set the new end date
            const newEndDate = new Date(startDateObj);
            newEndDate.setDate(newEndDate.getDate() + duration); 
            setEndDate(newEndDate.toISOString().split('T')[0]);
        }

        setStartDate(newStartDate);
        handleStartTimeChange(); // Update startTime whenever the date changes
        handleEndTimeChange(); // Update endTime to reflect the changes
    };

    const handleStartHourChange = (value) => {
        let hour = parseInt(value, 10);
        if (isNaN(hour)) hour = 0;
        if (hour < 0) hour = 0;
        if (hour > 23) hour = 23;

        // Calculate the difference between the old start hour and end hour
        const duration = endHour - startHour;

        // If the new start hour is later than the end hour, adjust the end hour
        if (startDate === endDate && hour >= endHour) {
            const newEndHour = hour + duration ; 
            setEndHour(newEndHour % 24); // Wrap around if it exceeds 23
            if (newEndHour >= 24) {
                // If the new end hour exceeds 23, increment the end date
                const newEndDate = new Date(endDate);
                newEndDate.setDate(newEndDate.getDate() + 1);
                setEndDate(newEndDate.toISOString().split('T')[0]);
            }
        }

        setStartHour(hour);
        handleStartTimeChange(); // Update startTime whenever the hour changes
        handleEndTimeChange(); // Update endTime to reflect the changes
    };

    const handleStartMinuteChange = (value) => {
        let minute = parseInt(value, 10);
        if (isNaN(minute)) minute = 0;
        if (minute < 0) minute = 0;
        if (minute > 59) minute = 59;

        // Calculate the difference between the old start minute and end minute
        const duration = endMinute - startMinute;

        // If the new start minute is later than the end minute, adjust the end minute
        if (startDate === endDate && startHour === endHour && minute >= endMinute) {
            const newEndMinute = minute + duration ;
            setEndMinute(newEndMinute % 60); // Wrap around if it exceeds 59
            if (newEndMinute >= 60) {
                // If the new end minute exceeds 59, increment the end hour
                handleStartHourChange(startHour + 1);
            }
        }

        setStartMinute(minute);
        handleStartTimeChange(); // Update startTime whenever the minute changes
        handleEndTimeChange(); // Update endTime to reflect the changes
    };

    // Updated handlers for end time inputs
    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        const timezoneOffset = new Date().getTimezoneOffset();
        const adjustedDate = new Date(new Date(newEndDate).getTime() - timezoneOffset * 60 * 1000);

        setEndDate(adjustedDate.toISOString().split('T')[0]); // Update endDate with timezone adjustment

        // Ensure end date is not earlier than start date
        if (newEndDate < startDate) {
            setStartDate(newEndDate);
        }

        setEndDate(newEndDate);
        handleEndTimeChange(); // Update endTime whenever the date changes
    };

    const handleEndHourChange = (value) => {
        let hour = parseInt(value, 10);
        if (isNaN(hour)) hour = 0;
        if (hour < 0) hour = 0;
        if (hour > 23) hour = 23;

        // Calculate the difference between the old end hour and start hour
        const duration = endHour - startHour;

        // If the new end hour is earlier than the start hour, adjust the start hour
        if (startDate === endDate && hour < startHour) {
            const newStartHour = hour - duration;
            setStartHour((newStartHour + 24) % 24); // Wrap around if it goes below 0
            if (newStartHour < 0) {
                // If the new start hour goes below 0, decrement the start date
                const newStartDate = new Date(startDate);
                newStartDate.setDate(newStartDate.getDate() - 1);
                setStartDate(newStartDate.toISOString().split('T')[0]);
            }
        }

        setEndHour(hour);
        handleStartTimeChange(); // Update startTime to reflect the changes
        handleEndTimeChange(); // Update endTime whenever the hour changes
    };

    const handleEndMinuteChange = (value) => {
        let minute = parseInt(value, 10);
        if (isNaN(minute)) minute = 0;
        if (minute < 0) minute = 0;
        if (minute > 59) minute = 59;

        // Calculate the difference between the old end minute and start minute
        const duration = endMinute - startMinute;

        // If the new end minute is earlier than the start minute, adjust the start minute
        if (startDate === endDate && startHour === endHour && minute < startMinute) {
            const newStartMinute = minute - duration;
            setStartMinute((newStartMinute + 60) % 60); // Wrap around if it goes below 0
            if (newStartMinute < 0) {
                // If the new start minute goes below 0, decrement the start hour
                handleEndHourChange(endHour - 1);
            }
        }

        setEndMinute(minute);
        handleStartTimeChange(); // Update startTime to reflect the changes
        handleEndTimeChange(); // Update endTime whenever the minute changes
    };

    const handleNotificationDateChange = (e) => {
        setNotificationDate(e.target.value);
    };

    const handleNotificationHourChange = (value) => {
        let hour = parseInt(value, 10);
        if (isNaN(hour)) hour = 0;
        if (hour < 0) hour = 0;
        if (hour > 23) hour = 23;
        setNotificationHour(hour);
    };

    const handleNotificationMinuteChange = (value) => {
        let minute = parseInt(value, 10);
        if (isNaN(minute)) minute = 0;
        if (minute < 0) minute = 0;
        if (minute > 59) minute = 59;
        setNotificationMinute(minute);
    };

    const handleEnableNotificationChange = (e) => {
        const isEnabled = e.target.checked;
        setEnableNotification(isEnabled);

        // Only initialize notification time when enabling notifications for the first time
        if (isEnabled && !isNotificationTimeInitialized) {
            setNotificationDate(startDate);
            setNotificationHour(startHour);
            setNotificationMinute(startMinute);
            setIsNotificationTimeInitialized(true); // Mark as initialized
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const username = Cookies.get("username"); // Get the username from cookies

        const updatedTask = {
            eventID: editEventID, // Include the editEventID as task ID
            taskName,
            color,
            icon,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description,
            enableNotification,
            notificationTime: enableNotification ? notificationTime.toISOString() : null,
            username, // Include the username in the request body
        };

        try {
            const response = await fetch("http://localhost:3001/api/editTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTask),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Task updated successfully:", data.content);

                // Fetch all tasks from the database and update the frontend state
                await fetchTasks(setTasks);

                onClose(); // Close the form
            } else {
                console.error("Failed to update task:", data.message);
            }
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };
    

    useEffect(() => {
        handleStartTimeChange();
        handleEndTimeChange();
    }, []); // Run only once on component mount

    // Update startTime whenever startDate, startHour, or startMinute changes
    useEffect(() => {
        const startDateTime = new Date(startDate);
        startDateTime.setHours(startHour);
        startDateTime.setMinutes(startMinute);
        startDateTime.setSeconds(0, 0); // Remove seconds and milliseconds
        setStartTime(startDateTime);
    }, [startDate, startHour, startMinute]);

    // Update endTime whenever endDate, endHour, or endMinute changes
    useEffect(() => {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(endHour);
        endDateTime.setMinutes(endMinute);
        endDateTime.setSeconds(0, 0); // Remove seconds and milliseconds
        setEndTime(endDateTime);
    }, [endDate, endHour, endMinute]);

    useEffect(() => {
        if (!isNotificationTimeInitialized) {
            setNotificationTime(new Date(startTime));
        }
    }, [startTime, isNotificationTimeInitialized]);

    // Update notificationTime whenever notificationDate, notificationHour, or notificationMinute changes
    useEffect(() => {
        const notificationDateTime = new Date(notificationDate);
        notificationDateTime.setHours(notificationHour);
        notificationDateTime.setMinutes(notificationMinute);
        notificationDateTime.setSeconds(0, 0); // Remove seconds and milliseconds
        setNotificationTime(notificationDateTime);
    }, [notificationDate, notificationHour, notificationMinute]);

    useEffect(() => {
        console.log('Notification Time:', notificationTime);
    }, [notificationTime]);

    // Initialize form fields with the task data
    useEffect(() => {
        const taskToEdit = tasks.find(task => task.eventID === editEventID);
        if (taskToEdit) {
            setTaskName(taskToEdit.eventName);
            setColor(taskToEdit.color);
            setIcon(taskToEdit.icon);
            setStartDate(getLocalDate(new Date(taskToEdit.startTime))); // Adjust for timezone
            setStartHour(new Date(taskToEdit.startTime).getHours());
            setStartMinute(new Date(taskToEdit.startTime).getMinutes());
            setEndDate(getLocalDate(new Date(taskToEdit.endTime))); // Adjust for timezone
            setEndHour(new Date(taskToEdit.endTime).getHours());
            setEndMinute(new Date(taskToEdit.endTime).getMinutes());
            setDescription(taskToEdit.description || '');
            setEnableNotification(taskToEdit.enableNotification || false);
            if (taskToEdit.notificationTime) {
                const notificationTime = new Date(taskToEdit.notificationTime);
                setNotificationDate(getLocalDate(notificationTime)); // Adjust for timezone
                setNotificationHour(notificationTime.getHours());
                setNotificationMinute(notificationTime.getMinutes());
            }
        }
    }, [editEventID, tasks]);

    

    return (
        <>
        <form onSubmit={handleSubmit}>
            {/* Form title */}
            <h2 style={{ borderBottom: '1px solid black', padding: '5px 0' , marginBottom: '20px'}}>
                Edit Task
            </h2>
            {/* Task name input + icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/*enter task name*/}
                <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task name"
                    required // Mark this field as required
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
                {/*icon display square*/}
                <div
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '8px',
                        backgroundColor: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={handleSquareClick}
                >
                    {icon && <Icon icon={icon} style={{ fontSize: '38px', color: getIconColor(color) }} />}
                </div>
            </div>
            {/*icon select*/}
            {showIconSelector && (
                <div style={{ marginTop: '10px' }}>
                    {/*icon search bar*/}
                    <input
                        type="text"
                        value={icon}
                        onChange={handleIconInput}
                        placeholder="Search for an icon (e.g., 'game')"
                        onFocus={(e) => e.target.select()} // Automatically select the content on focus
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                    {/*show search icon result div*/}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                            border: '1px solid #ccc',
                            padding: '10px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            marginTop: '10px',
                        }}
                    >   
                        {/*individual icon squares*/}
                        {(iconSuggestions.length > 0 ? iconSuggestions : predefinedIcons).map((iconName) => (
                            <div
                                key={iconName}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '40px',
                                    height: '40px',
                                    border: icon === iconName ? '2px solid blue' : '1px solid #ccc',
                                    borderRadius: '5px',
                                    backgroundColor: '#f9f9f9',
                                }}
                                onClick={() => handleIconSelect(iconName)}
                            >
                                <Icon icon={iconName} style={{ fontSize: '24px' }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            
            {/* Color Selector */}
            <h6 style={{ marginTop: '30px' }}>Color</h6>
            <div style={{ marginTop: '5px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        padding: '13px',
                        borderRadius: '8px',
                        backgroundColor: '#f0f0f0',
                    }}
                >   
                    {/* individual color circles */}
                    {predefinedColors.map((predefinedColor, index) => (
                        <div
                            key={index}
                            style={{
                                width: '21px',
                                height: '21px',
                                borderRadius: '50%',
                                backgroundColor: predefinedColor,
                                cursor: 'pointer',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onClick={() => handleColorSelect(predefinedColor)}
                        >
                            {/* ring for Highlight selected color */}
                            {color === predefinedColor && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '29px',
                                        height: '29px',
                                        borderRadius: '50%',
                                        border: `3px solid ${predefinedColor}`,
                                    }}
                                />
                            )}
                        </div>
                    ))}

                    {/* Custom Colors circle */}
                    {customColors.map((customColor, index) => (
                        <div
                            key={`custom-${index}`}
                            style={{
                                width: '21px',
                                height: '21px',
                                borderRadius: '50%',
                                backgroundColor: customColor,
                                cursor: 'pointer',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onClick={() => handleColorSelect(customColor)}
                        >
                            {/* ring for Highlight selected color */}
                            {color === customColor && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '29px',
                                        height: '29px',
                                        borderRadius: '50%',
                                        border: `3px solid ${customColor}`,
                                    }}
                                />
                            )}
                        </div>
                    ))}

                    {/* More Color Option */}
                    <span
                        style={{
                            cursor: 'pointer',
                            color: '#007BFF',
                            textDecoration: 'underline',
                        }}
                        onClick={() => setShowColorWheel(!showColorWheel)}
                    >
                        More...
                    </span>
                </div>
                
                {/* Color Wheel */}
                {showColorWheel && (
                    <div style={{ marginTop: '7px' }}>
                        <input
                            type="color"
                            value={color}
                            onChange={handleCustomColorSelect}
                            style={{
                                width: '100%',
                                height: '40px',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                )}
                
            </div>

            
            {/* Start Time Selector */}
            <div style={{marginTop: '30px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h6>Start Time</h6>
                    {/* Date Picker */}
                    <div style={{ position: 'relative' , display:'inline-block'}}>
                            {/* current date text */}
                            <input
                                type="text"
                                value={startDate}
                                readOnly
                                style={{
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '0px solid #ccc',
                                    cursor: 'pointer',
                                    width: '120px',
                                }}
                                onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                            />
                            {/* calendar icon */}
                            <Icon
                                icon="mdi:calendar"
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    color: '#007BFF',
                                }}
                                onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                            />
                            {/* select date */}
                            {showStartDatePicker && (
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    required // Mark this field as required
                                    style={{
                                        position: 'absolute',
                                        top: '40px',
                                        left: '0',
                                        zIndex: 10,
                                        background: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        padding: '5px',
                                    }}
                                />
                            )}
                    </div>
                </div>
                    
                <div style={{ display: 'flex', alignItems: 'center',justifyContent:'center', gap: '30px', marginTop: '10px' }}>                 
                    {/* Hour Input */}
                    <div>
                        <input
                            type="number"
                            value={startHour}
                            onChange={(e) => handleStartHourChange(e.target.value)}
                            onFocus={(e) => e.target.select()} // Automatically select the content on focus
                            required // Mark this field as required
                            style={{
                                width: '60px',
                                padding: '5px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                textAlign: 'center',
                            }}
                        />
                    </div>

                    <h6>:</h6>

                    {/* Minute Input */}
                    <div>
                        <input
                            type="number"
                            value={startMinute}
                            onChange={(e) => handleStartMinuteChange(e.target.value)}
                            onFocus={(e) => e.target.select()} // Automatically select the content on focus
                            required // Mark this field as required
                            style={{
                                width: '60px',
                                padding: '5px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                textAlign: 'center',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* End Time Selector */}
            <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h6>End Time</h6>
                    {/* End Date Picker */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        {/* Current date text */}
                        <input
                            type="text"
                            value={endDate}
                            readOnly
                            style={{
                                padding: '10px',
                                borderRadius: '5px',
                                border: '0px solid #ccc',
                                cursor: 'pointer',
                                width: '120px',
                            }}
                            onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                        />
                        {/* Calendar icon */}
                        <Icon
                            icon="mdi:calendar"
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                fontSize: '20px',
                                color: '#007BFF',
                            }}
                            onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                        />
                        {/* Select date */}
                        {showEndDatePicker && (
                            <input
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                style={{
                                    position: 'absolute',
                                    top: '40px',
                                    left: '0',
                                    zIndex: 10,
                                    background: 'white',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '5px',
                                }}
                            />
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', marginTop: '10px' }}>
                    {/* Hour Input */}
                    <div>
                        <input
                            type="number"
                            value={endHour}
                            onChange={(e) => handleEndHourChange(e.target.value)}
                            onFocus={(e) => e.target.select()} // Automatically select the content on focus
                            style={{
                                width: '60px',
                                padding: '5px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                textAlign: 'center',
                            }}
                        />
                    </div>

                    <h6>:</h6>

                    {/* Minute Input */}
                    <div>
                        <input
                            type="number"
                            value={endMinute}
                            onChange={(e) => handleEndMinuteChange(e.target.value)}
                            onFocus={(e) => e.target.select()} // Automatically select the content on focus
                            style={{
                                width: '60px',
                                padding: '5px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                textAlign: 'center',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Description*/}
            <div style={{ marginTop: '30px' }}>
                <h6 style={{ marginBottom: '5px' }}>Description</h6>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    style={{
                        width: '100%',
                        height: '100px',
                        resize: 'none',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>

            {/* Notification */}
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={enableNotification}
                        onChange={handleEnableNotificationChange}
                    />
                    Enable Notification
                </label>
            </div>
            {/* Notification Time selector */}
            {enableNotification && (
                <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h6>Notification Time</h6>
                        {/* Notification Date Picker */}
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            {/* Current date text */}
                            <input
                                type="text"
                                value={notificationDate}
                                readOnly
                                style={{
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '0px solid #ccc',
                                    cursor: 'pointer',
                                    width: '120px',
                                }}
                                onClick={() => setShowNotificationDatePicker(!showNotificationDatePicker)}
                            />
                            {/* Calendar icon */}
                            <Icon
                                icon="mdi:calendar"
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    color: '#007BFF',
                                }}
                                onClick={() => setShowNotificationDatePicker(!showNotificationDatePicker)}
                            />
                            {/* Select date */}
                            {showNotificationDatePicker && (
                                <input
                                    type="date"
                                    value={notificationDate}
                                    onChange={handleNotificationDateChange}
                                    style={{
                                        position: 'absolute',
                                        top: '40px',
                                        left: '0',
                                        zIndex: 10,
                                        background: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        padding: '5px',
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', marginTop: '10px' }}>
                        {/* Hour Input */}
                        <div>
                            <input
                                type="number"
                                value={notificationHour}
                                onChange={(e) => handleNotificationHourChange(e.target.value)}
                                onFocus={(e) => e.target.select()} // Automatically select the content on focus
                                style={{
                                    width: '60px',
                                    padding: '5px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    textAlign: 'center',
                                }}
                            />
                        </div>

                        <h6>:</h6>

                        {/* Minute Input */}
                        <div>
                            <input
                                type="number"
                                value={notificationMinute}
                                onChange={(e) => handleNotificationMinuteChange(e.target.value)}
                                onFocus={(e) => e.target.select()} // Automatically select the content on focus
                                style={{
                                    width: '60px',
                                    padding: '5px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    textAlign: 'center',
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            
        
            {/* Submit Button */}
            <div
                style={{
                    width: '100%',
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '30px',
                }}
            >
                <button type="submit" className='btn' style={{
                    background: 'linear-gradient(135deg, rgb(89, 78, 163) 0%, rgb(134, 62, 207) 100%)',
                    color: '#fff',
                    padding: '10px 40px',
                    border: 'none',
                    borderRadius: '7px',
                    cursor: 'pointer',
                }}><h4>Edit Task</h4></button>
            </div>
        </form>
        
        </>
    );
};

export default EditTask;