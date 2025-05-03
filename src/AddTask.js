import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const AddTask = ({ onClose }) => {
    const [taskName, setTaskName] = useState('');
    const [color, setColor] = useState('#000000'); // Default color
    const [icon, setIcon] = useState('mdi:react'); // Default icon as placeholder
    const [iconSuggestions, setIconSuggestions] = useState([]); // Suggestions for icons
    const [showIconSelector, setShowIconSelector] = useState(false); // Toggle icon selector visibility
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [enableNotification, setEnableNotification] = useState(false);
    const [notificationTime, setNotificationTime] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null); // Timeout for debouncing
    const [isFirstClick, setIsFirstClick] = useState(true); // Track if it's the first click on the square

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
        "skill-icons:react-dark",
        "mdi:code",
    ];

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!taskName.trim() || !startTime || !endTime) {
            alert('Please fill in all required fields.');
            return;
        }

        const newTask = {
            taskName,
            color,
            icon,
            startTime,
            endTime,
            description,
            enableNotification,
            notificationTime: enableNotification ? notificationTime : null,
        };

        console.log('New Task:', newTask);
        // Add logic to save the task (e.g., API call)
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form title */}
            <h2 style={{ borderBottom: '1px solid black', padding: '5px 0' , marginBottom: '10px'}}>
                New Task
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/*enter task name*/}
                <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task name"
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
                    {icon && <Icon icon={icon} style={{ fontSize: '38px', color: '#fff' }} />}
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
                    {/*show icon result div*/}
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
            <div>
                <label>Start Time *</label>
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>End Time *</label>
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={enableNotification}
                        onChange={(e) => setEnableNotification(e.target.checked)}
                    />
                    Enable Notification
                </label>
            </div>
            {enableNotification && (
                <div>
                    <label>Notification Time</label>
                    <input
                        type="datetime-local"
                        value={notificationTime}
                        onChange={(e) => setNotificationTime(e.target.value)}
                    />
                </div>
            )}
            <button type="submit">Add Task</button>
            <button type="button" onClick={onClose}>
                Cancel
            </button>
        </form>
    );
};

export default AddTask;