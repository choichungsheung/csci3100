import React from 'react';
import { getIconColor } from './utils/colorUtils';
import { Icon } from '@iconify/react';

const TaskBlock = ({ top, height, task, showDetails, editDeleteBubble }) => {
    const blockStyle = {
        position: 'absolute',
        top: `${top}%`,
        height: `${height}%`,
        width: '50px',
        backgroundColor: task.color,
        zIndex: showDetails ? 3 : 1,
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer',
    };

    const iconStyle = {
        fontSize: '30px',
        color: getIconColor(task.color),
        marginTop: height < 5 ? 'auto' : '3vh',
        marginBottom: height < 5 ? 'auto' : '0',
    };

    return (
        <>
            {/* Task Block */}
            <div style={blockStyle} >
                {/* Only show the icon if height >= 3 */}
                {height >= 3 && <Icon icon={task.icon} style={iconStyle} />}
            </div>

            {/* Details */}
            {showDetails && (
                <div
                    style={{
                        position: 'absolute',
                        top: `${top}%`,
                        height: 'fit-content',
                        minHeight: `${height}%`,
                        width: 'fit-content',
                        marginLeft: '40px',
                        backgroundColor: 'rgba(171, 168, 168, 0.28)',
                        backdropFilter: 'blur(3px)',
                        padding: '0px 30px',
                        paddingTop: '2vh',
                        paddingBottom: '2vh',
                        borderRadius: '5px',
                        zIndex: showDetails ? 2 : 0,
                        border: '2px solid #ccc',
                    }}
                >
                    {height >= 3 &&
                    (<h5>
                        {/* Task Name */}
                        {task.eventName}

                        {/* Notification Bell Icon */}
                        {task.enableNotification && (
                            <Icon
                                icon={'mdi:bell'}
                                style={{ fontSize: '20px', marginLeft: '10px' }}
                            />
                        )}
                    </h5>)}

                    {(height>=5 && 
                        <>
                        {/* Task Time */}
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#555' }}>
                            {new Date(task.startTime).toDateString() ===
                            new Date(task.endTime).toDateString() ? (
                                <>
                                    <div>
                                        {new Date(task.startTime).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'numeric',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <div>
                                        {`${new Date(task.startTime).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })} - ${new Date(task.endTime).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}`}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        {`Start: ${new Date(task.startTime).toLocaleDateString(
                                            'en-US',
                                            {
                                                weekday: 'short',
                                                month: 'numeric',
                                                day: 'numeric',
                                                year: 'numeric',
                                            }
                                        )} ${new Date(task.startTime).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}`}
                                    </div>
                                    <div>
                                        {`End: ${new Date(task.endTime).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'numeric',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })} ${new Date(task.endTime).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}`}
                                    </div>
                                </>
                            )}
                        </div>

                        <h6 style={{ marginTop: '10px', fontSize: '15px', color: '#777' }}>
                            {task.description}
                        </h6>
                    </>
                )}


                </div>
            )}

            {/* Render EditDeleteOption Bubble */}
            {editDeleteBubble && (
                <div
                    style={{
                        position: 'absolute',
                        top: `${top + Math.min(3, height / 2)}%`,
                        marginLeft:'25px',
                        zIndex: 3,
                    }}
                >
                    {editDeleteBubble}
                </div>
            )}
        </>
    );
};

export default TaskBlock;