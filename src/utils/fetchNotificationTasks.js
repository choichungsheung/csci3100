import Cookies from 'js-cookie';

const fetchNotificationTasks = async () => {
    const username = Cookies.get('username');
    try {
        const response = await fetch(`http://localhost:3001/api/getTask?username=${username}`);
        const data = await response.json();

        if (response.ok) {
            const now = new Date();
            //const future = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
            return data.content.filter(task => {
                //const startTime = new Date(task.startTime);
                return task.enableNotification === true;
            });
        } else {
            console.error('Failed to fetch notification tasks:', data.message);
            return [];
        }
    } catch (err) {
        console.error('Error fetching notification tasks:', err);
        return [];
    }
};

export default fetchNotificationTasks;