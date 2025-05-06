import React from 'react';
import { getIconColor } from './utils/colorUtils';
import { Icon } from '@iconify/react';

const TaskBlock = ({ top, height, task }) => {
    const blockStyle = {
        position: 'absolute',
        top: `${top}%`,
        height: `${height}%`,
        width: '50px',
        backgroundColor: task.color,
        zIndex: 1,
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        justifyContent: 'center',
    };
    console.log(task.eventID);

    const iconStyle = {
        fontSize: '30px',
        color: getIconColor(task.color),
        marginTop: height < 5 ? 'auto' : '3vh',
        marginBottom: height < 5 ? 'auto' : '0',
    };

    return <div style={blockStyle}>
        <Icon icon={task.icon} style={iconStyle} />
    </div>;
};

export default TaskBlock;