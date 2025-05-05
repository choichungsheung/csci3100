import Cookies from 'js-cookie';

const fetchTasks = async (setTasks) => {
    const username = Cookies.get('username'); // Get the username from cookies
    try {
        const response = await fetch(`http://localhost:3001/api/getTask?username=${username}`);
        const data = await response.json();

        if (response.ok) {
            const processedTasks = [];

            data.content.forEach((task) => {
                const startTime = new Date(task.startTime);
                const endTime = new Date(task.endTime);

                // Check if the task crosses a day
                if (
                    startTime.getFullYear() !== endTime.getFullYear() ||
                    startTime.getMonth() !== endTime.getMonth() ||
                    startTime.getDate() !== endTime.getDate()
                ) {
                    // Mark the original task as crossing a day
                    task.crossADay = true;
                    processedTasks.push(task);

                    // Generate copies for each day the task spans
                    let currentStart = new Date(startTime);
                    const endOfDay = new Date(currentStart);
                    endOfDay.setHours(23, 59, 59, 999); // End of the current day

                    while (currentStart < endTime) {
                        const currentEnd = new Date(Math.min(endOfDay.getTime(), endTime.getTime()));

                        // Create a copy of the task for the current day
                        const taskCopy = {
                            ...task,
                            startTime: currentStart.toISOString(),
                            endTime: currentEnd.toISOString(),
                            forDisplay: true, // Mark as a display-only copy
                            crossADay: undefined, // Remove the crossADay property for copies
                        };

                        processedTasks.push(taskCopy);

                        // Move to the next day
                        currentStart = new Date(endOfDay);
                        currentStart.setDate(currentStart.getDate() + 1);
                        currentStart.setHours(0, 0, 0, 0); // Start of the next day
                        endOfDay.setDate(endOfDay.getDate() + 1);
                    }
                } else {
                    // Task does not cross a day, leave it untouched
                    processedTasks.push(task);
                }
            });

            setTasks(processedTasks); // Update the tasks state with processed tasks
        } else {
            console.error('Failed to fetch tasks:', data.message);
        }
    } catch (err) {
        console.error('Error fetching tasks:', err);
    }
};

export default fetchTasks;