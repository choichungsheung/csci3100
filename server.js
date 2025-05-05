const express = require('express');
const cors = require('cors');
//const convert = require('xml-js');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const bcryptjs = require('bcryptjs'); 
mongoose.connect("mongodb://localhost:27017/3100project");
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {
    console.log("Connected to MongoDB");

    // Hardcoded license keys
    const hardcodedKeys = [
        "0000-0000-0000-0000",
        "0000-0000-0000-0001",
        "0000-0000-0000-0002",
        "0000-0000-0000-0003",
        "1234-5678-9101-1121",
        "2233-4455-6677-8899",
        "3344-5566-7788-9900",
    ];

    // Insert hardcoded keys if they don't already exist
    for (const key of hardcodedKeys) {
        const existingKey = await LicenseKey.findOne({ key });
        if (!existingKey) {
            await LicenseKey.create({ key });
        }
    }
    
});

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    }],
    
});

const eventSchema = mongoose.Schema({
    eventID: {
        type: Number,
        required: true,
        unique: true,
    },
    eventName: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    color: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    markedAsDone: {
        type: Boolean,
        default: false,
    },
    isRepeating: {
        type: Boolean,
        default: false,
    },
    repeatPattern: {
        type: String,
    },
    enableNotification: {
        type: Boolean,
        default: false,
        required: true,
    },
    notificationTime: {
        type: Date,
    },
});

const licenseKeySchema = mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{4}-\d{4}-\d{4}-\d{4}$/, // Format: xxxx-xxxx-xxxx-xxxx
    },
});

const LicenseKey = mongoose.model('LicenseKey', licenseKeySchema);

const Event = mongoose.model('Event', eventSchema);
const User = mongoose.model('User', userSchema);

app.get('/api/test', (req, res) => {
    console.log("test");
    res.send("test");
})



app.post("/api/register", async (req, res) => {
    console.log("Registering user");
    const { username, password, licenseKey } = req.body;

    try {
        // Check if the license key exists in the database
        const validKey = await LicenseKey.findOne({ key: licenseKey });
        if (!validKey) {
            return res.status(400).json({ message: "Invalid license key.", content: null });
        }

        const usernameData = username; // Extract username from request body
        const passwordData = bcryptjs.hashSync(password, 10); // Hash the password with a salt of 10

        // Check if the username already exists in the database
        const existingUser = await User.findOne({ username: usernameData });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists.", content: null });
        }

        // Create a new user
        const newUser = new User({
            username: usernameData,
            password: passwordData,
            events: [],
        });

        // Save the new user to the database
        await newUser.save();

        // Delete the license key from the database after successful registration
        await LicenseKey.deleteOne({ key: licenseKey });

        res.status(200).json({ message: "Registration successful.", content: null });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to register.", content: { err } });
    }
});

app.post('/api/login', (req, res) => {
    console.log("Verifying login");

    // Find the user by username in the database
    User.findOne({ username: req.body.username }).then((result) => {
        if (result == null) {
            // If no user is found, send an unauthorized response
            res.status(401).json({ message: 'Incorrect username or password.', content: null });
        } else {
            // Compare the provided password with the hashed password in the database
            if (bcryptjs.compareSync(req.body.password, result.password)) {
                // If the password matches, send a success response
                res.status(200).json({ message: 'Login successful', content: null });
            } else {
                // If the password does not match, send an unauthorized response
                res.status(401).json({ message: 'Incorrect username or password.', content: null });
            }
        }
    }).catch((err) => {
        // Handle errors during the database query
        console.log(err);
        res.status(404).json({ message: 'Failed to login.', content: { err } });
    });
});

app.post('/api/addTask', async (req, res) => {
    console.log("Adding a new task");

    const {
        taskName,
        color,
        icon,
        startTime,
        endTime,
        description,
        enableNotification,
        notificationTime,
        username, // Get the username from the request body
    } = req.body;

    try {
        // Validate required fields
        if (!taskName || !color || !icon || !startTime || !endTime || !username) {
            return res.status(400).json({ message: "Missing required fields.", content: null });
        }

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found.", content: null });
        }

        // Find the largest existing eventID in the database
        const largestEvent = await Event.findOne().sort({ eventID: -1 }).exec();
        const newEventID = largestEvent ? largestEvent.eventID + 1 : 1; // Start from 1 if no events exist

        // Create a new event
        const newEvent = new Event({
            eventID: newEventID, // Use the incremented eventID
            eventName: taskName,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            description: description || "", // Optional field
            color,
            icon,
            enableNotification: enableNotification || false,
            notificationTime: enableNotification ? new Date(notificationTime) : null,
        });

        // Save the event to the database
        const savedEvent = await newEvent.save();

        // Add the event to the user's events array
        user.events.push(savedEvent._id);
        await user.save();

        res.status(200).json({ message: "Task added successfully.", content: savedEvent });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add task.", content: { err } });
    }
});

app.get('/api/searchTask', async (req, res) => {
    console.log("Searching tasks");

    const { username, query } = req.query;

    try {
        // Validate required fields
        if (!username || !query) {
            return res.status(400).json({ message: "Missing required fields.", content: null });
        }

        // Find the user by username
        const user = await User.findOne({ username }).populate('events');
        if (!user) {
            return res.status(404).json({ message: "User not found.", content: null });
        }

        // Filter events where the event name contains the query string (case-insensitive)
        const searchResults = user.events.filter(event =>
            event.eventName.toLowerCase().includes(query.toLowerCase())
        );

        res.status(200).json({ message: "Search successful.", content: searchResults });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to search tasks.", content: { err } });
    }
});

app.get('/api/getTask', async (req, res) => {
    console.log("Fetching all tasks for user");

    const { username } = req.query;

    try {
        // Validate required fields
        if (!username) {
            return res.status(400).json({ message: "Missing required fields.", content: null });
        }

        // Find the user by username and populate their events
        const user = await User.findOne({ username }).populate('events');
        if (!user) {
            return res.status(404).json({ message: "User not found.", content: null });
        }

        // Return all tasks from the user's events array
        res.status(200).json({ message: "Tasks fetched successfully.", content: user.events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch tasks.", content: { err } });
    }
});

app.post('/api/editTask', async (req, res) => {
    console.log("Editing a task");

    const {
        eventID, // Event ID to identify the task to be edited
        taskName,
        color,
        icon,
        startTime,
        endTime,
        description,
        enableNotification,
        notificationTime,
        username, // Get the username from the request body
    } = req.body;

    try {
        // Validate required fields
        if (!eventID || !taskName || !color || !icon || !startTime || !endTime || !username) {
            console.log(eventID, taskName, color, icon, startTime, endTime, username);
            return res.status(400).json({ message: "Missing required fields.", content: null });
        }

        // Find the user by username
        const user = await User.findOne({ username }).populate('events');
        if (!user) {
            return res.status(404).json({ message: "User not found.", content: null });
        }

        // Find the event to be edited
        const eventToEdit = await Event.findOne({ eventID });
        if (!eventToEdit) {
            return res.status(404).json({ message: "Event not found.", content: null });
        }

        // Update the event with the new information
        eventToEdit.eventName = taskName;
        eventToEdit.color = color;
        eventToEdit.icon = icon;
        eventToEdit.startTime = new Date(startTime);
        eventToEdit.endTime = new Date(endTime);
        eventToEdit.description = description || ""; // Optional field
        eventToEdit.enableNotification = enableNotification || false;
        eventToEdit.notificationTime = enableNotification ? new Date(notificationTime) : null;

        // Save the updated event to the database
        const updatedEvent = await eventToEdit.save();

        res.status(200).json({ message: "Task updated successfully.", content: updatedEvent });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update task.", content: { err } });
    }
});

const server = app.listen(3001);