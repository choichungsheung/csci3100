import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Icon } from '@iconify/react';

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

const Search = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const handleInputChange = (e) => {
        const input = e.target.value;
        setQuery(input);

        // Clear the previous timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set a new timeout to fetch search results after 0.2 seconds
        const timeout = setTimeout(() => {
            if (input.trim()) {
                fetchSearchResults(input);
            } else {
                setSearchResults([]); // Clear results if input is empty
            }
        }, 200);

        setDebounceTimeout(timeout);
    };

    const fetchSearchResults = async (searchQuery) => {
        const username = Cookies.get('username'); // Get the username from cookies

        try {
            const response = await fetch(
                `http://localhost:3001/api/searchTask?username=${username}&query=${searchQuery}`
            );
            const data = await response.json();

            if (response.ok) {
                setSearchResults(data.content); // Update search results
            } else {
                console.error('Failed to fetch search results:', data.message);
            }
        } catch (err) {
            console.error('Error fetching search results:', err);
        }
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
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    marginBottom: '5px',
                    backgroundColor: '#f9f9f9',
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
                                style={{ fontSize: '15px', color: '#555', marginLeft:'auto' }}
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
            </div>
        );
    };

    return (
        <div>
            {/* Search Bar */}
            <input
                className="search-bar"
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleInputChange}
                autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            />

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div style={{ marginTop: '0px', maxHeight: '450px', overflowY: 'auto' }}>
                    {/* Group tasks by date */}
                    <div>
                        {/* Tasks on Today */}
                        <div>
                            <h6 style={{marginTop: '20px', marginBottom: '5px' , borderBottom: '1px solid gray', paddingBottom:'5px' }}>Tasks on Today</h6>
                            {searchResults
                                .filter((result) => {
                                    const startDate = new Date(result.startTime);
                                    const today = new Date();
                                    return startDate.toDateString() === today.toDateString();
                                })
                                .map((result) => renderTask(result))}
                        </div>

                        {/* Tasks in Future */}
                        <div>
                            <h6 style={{marginTop: '20px', marginBottom: '5px' , borderBottom: '1px solid gray', paddingBottom:'5px'}}>Tasks in Future</h6>
                            {searchResults
                                .filter((result) => {
                                    const startDate = new Date(result.startTime);
                                    const today = new Date();
                                    // Exclude tasks that are on today
                                    return startDate > today && startDate.toDateString() !== today.toDateString();
                                })
                                .map((result) => renderTask(result))}
                        </div>

                        {/* Tasks in the Past */}
                        <div>
                            <h6 style={{marginTop: '20px', marginBottom: '5px' , borderBottom: '1px solid gray', paddingBottom:'5px'}}>Tasks in the Past</h6>
                            {searchResults
                                .filter((result) => {
                                    const startDate = new Date(result.startTime);
                                    const today = new Date();
                                    // Exclude tasks that are on today
                                    return startDate < today && startDate.toDateString() !== today.toDateString();
                                })
                                .map((result) => renderTask(result))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
