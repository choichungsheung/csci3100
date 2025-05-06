import React from 'react';
import { Icon } from '@iconify/react';
import fetchTasks from './utils/fetchTasks'; // Import fetchTasks utility

const EditDeleteOption = ({ setEditEventID, eventID, setTasks }) => {
    const handleEditClick = () => {
        setEditEventID(eventID); // Set the edit event ID
    };

    const handleDeleteClick = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/deleteTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ eventID }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Task deleted successfully:", data.message);

                // Fetch all tasks from the database and update the frontend state
                await fetchTasks(setTasks);
            } else {
                console.error("Failed to delete task:", data.message);
            }
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    return (
        <div
            style={{
                padding: '10px',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the document
        >
            {/* Edit Button */}
            <button
                style={{
                    padding: '0px',
                    border: 'none',
                    background: 'none',
                    color: '#5E5E5E',
                    cursor: 'pointer',
                    marginBottom: '5px',
                    display:'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={handleEditClick}
            >
                Edit <Icon icon="mingcute:pen-fill" style={{ fontSize: '15px', marginLeft: '5px' }} />
            </button>

            {/* Delete Button */}
            <button
                style={{
                    padding: '0px',
                    border: 'none',
                    background: 'none',
                    color: '#FF5C5C',
                    cursor: 'pointer',
                    display:'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={handleDeleteClick}
            >
                Delete <Icon icon="mdi:trash-can-outline" style={{ fontSize: '15px', marginLeft: '5px' }} />
            </button>
        </div>
    );
};

export default EditDeleteOption;