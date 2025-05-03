import React, { useState } from 'react';
import Search from './Search';
import ViewSelect from './ViewSelect';
import Logout from './Logout';


const Main = ({setLoggedIn}) => {
    const [showNewEventForm, setShowNewEventForm] = useState(false);

    return (
        <div className="App">
            {/* Sidebar */}
            <div className="sidebar">
                {/* logout button */}
                <div className="logout">
                    <Logout setLoggedIn={setLoggedIn}/>
                </div>

                <div className="sidebar-header">
                    <button className="new-event-button" onClick={() => setShowNewEventForm(true)}>
                        <span>+</span>
                        Create
                    </button>
                </div>
                
                <div className="sidebar-nav">
                    <div className="sidebar-nav-item active">
                        <span>Calendar</span>
                    </div>
                    <div className="sidebar-nav-item">
                        <Search />
                    </div>
                </div>

            </div>

            {/* Main Content */}
            <div className="main-content">
                <ViewSelect />
            </div>

            {/* New Event Form Modal - can be implemented later */}
            {showNewEventForm && (
                <div className="modal">
                    {/* Add event form here */}
                </div>
            )}
        </div>
    );
};

export default Main;