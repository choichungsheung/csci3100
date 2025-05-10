import React, { useState, useEffect, useRef } from 'react';
import Search from './Search';
import ViewSelect from './ViewSelect';
import Logout from './Logout';
import AddTask from './AddTask';
import EditTask from './EditTask';
import Cookies from 'js-cookie';
import fetchTasks from './utils/fetchTasks'; // Import the utility function
import fetchNotificationTasks from './utils/fetchNotificationTasks';

const Main = ({ setLoggedIn }) => {
    const [showNewEventForm, setShowNewEventForm] = useState(false);
    const [editEventID, setEditEventID] = useState(null);
    const [tasks, setTasks] = useState([]); // State to store all tasks
    const [notificationPermission, setNotificationPermission] = useState(false);
    const notifiedTasks = useRef(new Set()); // Track tasks that have already triggered notifications

    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications.");
            return false;
        }
        const permission = await Notification.requestPermission();
        return permission === "granted";
    };

    const showNotification = (task) => {
        if (Notification.permission === "granted") {
            new Notification(task.eventName || 'Untitled Event', {
                body: `Starts at ${new Date(task.startTime).toLocaleTimeString()}`,
                icon: task.icon, // Optional: Add an icon
            });
            notifiedTasks.current.add(task.eventID); // Mark the task as notified
            console.log('Notification shown for task:', task.eventName);
        }
    };

    // Notification system
    useEffect(() => {
        let interval = null;

        const initNotifications = async () => {
            const granted = await requestNotificationPermission();
            setNotificationPermission(granted);

            if (!granted) return; // Skip if permission is not granted

            const checkNotifications = () => {
                console.log('Checking notifications...'); // Debugging log
                const now = new Date();
                const currentDate = now.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                // Filter tasks for notifications
                const notification_tasks = tasks.filter(task => !task.forDisplay);

                // Check each task's notification time
                notification_tasks.forEach(task => {
                    const notificationTime = new Date(task.notificationTime);
                    const taskDate = notificationTime.toISOString().split('T')[0];
                    const taskHour = notificationTime.getHours();
                    const taskMinute = notificationTime.getMinutes();

                    if (
                        taskDate === currentDate &&
                        taskHour === currentHour &&
                        taskMinute === currentMinute &&
                        !notifiedTasks.current.has(task.eventID) // Ensure the task hasn't been notified yet
                    ) {
                        showNotification(task);
                        
                    }
                });
            };

            // Run the check every minute
            checkNotifications();
            interval = setInterval(checkNotifications, 5 * 1000); // Check every minute
            console.log('create interval');
        };

        initNotifications();

        // Cleanup interval when the component unmounts
        return () => {
            if (interval) clearInterval(interval);
            console.log('clear interval');
        };
    }, [tasks]); // Re-run when tasks change

    // Fetch tasks when the page loads
    useEffect(() => {
        fetchTasks(setTasks); // Use the utility function
    }, []); // Run only once when the component mounts

    return (
        <div className="App App-inner">
            {/* Sidebar */}
            <div className="sidebar">
                {/* Logout button */}
                <div className="logout">
                    <Logout setLoggedIn={setLoggedIn} />
                </div>

                <div className="sidebar-header">
                    <button className="new-event-button" onClick={() => setShowNewEventForm(true)}>
                        <span>+</span>
                        Create New Task
                    </button>
                </div>

                <div className="sidebar-nav">
                    <div className="sidebar-nav-item active">
                        <span>Show Calendar</span>
                    </div>

                    <div className="sidebar-search">
                        {/* Pass tasks to Search */}
                        <Search tasks={tasks} setTasks={setTasks} setEditEventID={setEditEventID}/>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <ViewSelect tasks={tasks} setTasks={setTasks} setEditEventID={setEditEventID}/>
            </div>

            {/* New Event Form */}
            {showNewEventForm && (
                <div
                    style={{
                        width: '400px',
                        height: '80vh',
                        backgroundColor: 'white',
                        margin: '0 auto',
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '20px',
                        padding: '20px',
                        boxShadow: '0 0px 7px rgba(0, 0, 0, 0.15)',
                        zIndex: 20,
                        overflowY: 'auto',
                    }}
                >
                    <button
                        className="close"
                        onClick={() => setShowNewEventForm(false)}
                        style={{
                            position: 'fixed',
                            top: '10px',
                            right: '10px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            height: '30px',
                            width: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        &times;
                    </button>
                    <AddTask onClose={() => setShowNewEventForm(false)} tasks={tasks} setTasks={setTasks} />
                </div>
            )}

            {/* Edit Event Form */}
            {editEventID && (
                <div
                    style={{
                        width: '400px',
                        height: '80vh',
                        backgroundColor: 'white',
                        margin: '0 auto',
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '20px',
                        padding: '20px',
                        boxShadow: '0 0px 7px rgba(0, 0, 0, 0.15)',
                        zIndex: 20,
                        overflowY: 'auto',
                    }}
                >
                    <button
                        className="close"
                        onClick={() => setEditEventID(null)}
                        style={{
                            position: 'fixed',
                            top: '10px',
                            right: '10px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            height: '30px',
                            width: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        &times;
                    </button>
                    <EditTask onClose={() => setEditEventID(null)} editEventID={editEventID} tasks={tasks} setTasks={setTasks}/>
                </div>
            )}
        </div>
    );
};

export default Main;
