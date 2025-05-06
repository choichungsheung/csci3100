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
        type: Number,
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

const server = app.listen(3001);