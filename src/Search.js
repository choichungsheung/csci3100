import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import EditDeleteOption from './EditDeleteOption';
import { getIconColor } from './utils/colorUtils';



const Search = ({ tasks ,setTasks, setEditEventID }) => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [activeBubble, setActiveBubble] = useState(null); // Track which task's bubble is active

    var filtered_tasks = tasks.filter((task) => !task.forDisplay);

    // Automatically update search results when tasks or query changes
    useEffect(() => {
        if (query.trim()) {
            const results = filtered_tasks.filter((task) =>
                task.eventName.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]); // Clear results if query is empty
        }
    }, [tasks, query]); // Re-run whenever tasks or query changes

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleBubbleClose = () => {
        setActiveBubble(null); // Close the active bubble
    };


    const renderTask = (result) => {

        const startDate = new Date(result.startTime);
        const endDate = new Date(result.endTime);

        // Format the date and time
        const startDateString = startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' });
        const startTimeString = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const endDateString = endDate.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' });
        const endTimeString = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        // Check if start and end dates are the same
        const isSameDate = startDate.toDateString() === endDate.toDateString();

        return (
            <div
                key={result.eventID}
                style={{
                    position: 'relative', // For positioning the bubble
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    marginBottom: '5px',
                    backgroundColor: '#f9f9f9',
                    cursor: 'pointer',
                }}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating to the document
                    setActiveBubble(result.eventID); // Set the active bubble to this task
                }}
            >
                {/* Task Details */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                        {/* Task Color Square with Icon */}
                        <div
                            style={{
                                width: '25px',
                                height: '25px',
                                borderRadius: '5px',
                                backgroundColor: result.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '10px',
                            }}
                        >
                            <Icon
                                icon={result.icon}
                                style={{
                                    fontSize: '23px',
                                    color: getIconColor(result.color), // Dynamically set the icon color
                                }}
                            />
                        </div>
                        {/* Task Name */}
                        <h6 style={{ margin: 0, fontWeight: 'bold' }}>{result.eventName}</h6>

                        {/* Notification Bell Icon */}
                        {result.enableNotification && (
                            <Icon
                                icon={"mdi:bell"}
                                style={{ fontSize: '15px', color: '#555', marginLeft: 'auto' }}
                            />
                        )}
                    </div>

                    {/* Date and Time */}
                    <div style={{ marginTop: '15px', fontSize: '12px', color: '#555' }}>
                        {isSameDate ? (
                            <>
                                <div>{startDateString}</div>
                                <div>{`${startTimeString} - ${endTimeString}`}</div>
                            </>
                        ) : (
                            <>
                                <div>{`Start: ${startDateString} ${startTimeString}`}</div>
                                <div>{`End: ${endDateString} ${endTimeString}`}</div>
                            </>
                        )}
                    </div>
                </div>

                {/* Bubble for Edit Button */}
                {activeBubble === result.eventID && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        marginTop: '5px',
                        zIndex: 10,
                    }}
                >
                    <EditDeleteOption setEditEventID={setEditEventID} eventID={result.eventID} setTasks={setTasks}/>
                </div>
                )}
            </div>
        );
    };

    // Close the bubble when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            handleBubbleClose();
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison

    const tasksOnToday = searchResults.filter((task) => {
        const startDate = new Date(task.startTime);
        return startDate.toDateString() === today.toDateString();
    });

    const tasksInFuture = searchResults.filter((task) => {
        const startDate = new Date(task.startTime);
        return startDate > today && startDate.toDateString() !== today.toDateString();
    });

    const tasksInPast = searchResults.filter((task) => {
        const startDate = new Date(task.startTime);
        return startDate < today && startDate.toDateString() !== today.toDateString();
    });

    return (
        <div>
            {/* Search Bar */}
            <input
                className="search-bar"
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleInputChange}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
            />

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div style={{ marginTop: '10px', maxHeight: '450px', overflowY: 'auto' }}>
                    {/* Tasks on Today */}
                    {tasksOnToday.length > 0 && (
                        <div>
                            <h6 style={{marginTop:'10px',marginBottom:'10px', paddingBottom:'5px',borderBottom:'1px solid gray'}}>Tasks on Today</h6>
                            {tasksOnToday.map((task) => renderTask(task))}
                        </div>
                    )}

                    {/* Tasks in Future */}
                    {tasksInFuture.length > 0 && (
                        <div>
                            <h6 style={{marginTop:'20px',marginBottom:'10px', paddingBottom:'5px',borderBottom:'1px solid gray'}}>Tasks in Future</h6>
                            {tasksInFuture.map((task) => renderTask(task))}
                        </div>
                    )}

                    {/* Tasks in Past */}
                    {tasksInPast.length > 0 && (
                        <div>
                            <h6 style={{marginTop:'20px',marginBottom:'10px', paddingBottom:'5px',borderBottom:'1px solid gray'}}>Tasks in the Past</h6>
                            {tasksInPast.map((task) => renderTask(task))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
