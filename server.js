const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bcrypt = require('bcryptjs')

const port = 3026

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})

mongoose
    .connect('mongodb://127.0.0.1:27017/students')
    .catch((err) => {
        console.error('MongoDB connection failed:', err?.message ?? err)
    })

const db = mongoose.connection
db.on('error', (err) => {
    console.error('MongoDB connection error:', err?.message ?? err)
})
db.once('open', () => {
    console.log("Mongodb connection sucessful")
})

function waitForMongoConnected(timeoutMs = 3000) {
    if (mongoose.connection.readyState === 1) {
        return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
        const onConnected = () => {
            cleanup()
            resolve()
        }

        const onError = (err) => {
            cleanup()
            reject(err)
        }

        const timeout = setTimeout(() => {
            cleanup()
            reject(new Error('MongoDB connection timeout'))
        }, timeoutMs)

        function cleanup() {
            clearTimeout(timeout)
            db.off('open', onConnected)
            db.off('connected', onConnected)
            db.off('error', onError)
        }

        db.once('open', onConnected)
        db.once('connected', onConnected)
        db.once('error', onError)
    })
}

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true, unique: true },
        passwordHash: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
)

const loginAttemptSchema = new mongoose.Schema(
    {
        identifier: { type: String, required: true, trim: true },
        success: { type: Boolean, required: true },
        reason: { type: String },
        ip: { type: String },
        userAgent: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
)

const User = mongoose.model('User', userSchema)
const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema)

app.get('/post', (req, res) => {
    res.status(405).send('Method Not Allowed. Submit the form with POST to /post.')
})

async function handleSignup(req, res) {
    try {
        await waitForMongoConnected(3000)
    } catch {
        return res.status(503).send('Database not connected. Start MongoDB and try again.')
    }

    const username = (req.body.username ?? '').trim()
    const email = (req.body.email ?? '').trim().toLowerCase()
    const password = String(req.body.password ?? '')
    const repassword = String(req.body.repassword ?? '')

    if (!username || !email || !password || !repassword) {
        return res.status(400).send('Missing required fields.')
    }

    if (password !== repassword) {
        return res.status(400).send('Passwords do not match.')
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10)
        await User.create({ username, email, passwordHash })
        return res.redirect(303, '/')
    } catch (err) {
        if (err && (err.code === 11000 || err.code === 11001)) {
            return res.status(409).send('An account with that email already exists.')
        }
        console.error('Failed to create user:', err?.message ?? err)
        return res.status(500).send('Failed to create account. Please try again.')
    }
}

// New routes
app.post('/signup', handleSignup)

app.post('/login', async (req, res) => {
    try {
        await waitForMongoConnected(3000)
    } catch {
        return res.status(503).send('Database not connected. Start MongoDB and try again.')
    }

    const identifier = (req.body.login ?? '').trim()
    const password = String(req.body.password ?? '')

    if (!identifier || !password) {
        return res.status(400).send('Missing username/email or password.')
    }

    const query = identifier.includes('@')
        ? { email: identifier.toLowerCase() }
        : { username: identifier }

    try {
        const user = await User.findOne(query).exec()
        let success = false
        let reason = undefined

        if (!user) {
            reason = 'user_not_found'
        } else {
            const ok = await bcrypt.compare(password, user.passwordHash)
            success = ok
            if (!ok) reason = 'invalid_password'
        }

        await LoginAttempt.create({
            identifier,
            success,
            reason,
            ip: req.ip,
            userAgent: req.get('user-agent'),
        })

        if (!success) {
            return res.status(401).send('Invalid username/email or password.')
        }

        return res.redirect(303, '/')
    } catch (err) {
        console.error('Login failed:', err?.message ?? err)
        return res.status(500).send('Login failed. Please try again.')
    }
})

// Backward-compatible alias (older forms posted to /post)
app.post('/post', handleSignup)

app.listen(port, ()=>{
    console.log("Server started")
})



