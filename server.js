const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

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

const userScheme = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    repassword:String,
    
})
const Users = mongoose.model("data", userScheme)

app.get('/post', (req, res) => {
    res.status(405).send('Method Not Allowed. Submit the form with POST to /post.')
})

app.post('/post', async (req, res) => {
    try {
        await waitForMongoConnected(3000)
    } catch {
        return res.status(503).send('Database not connected. Start MongoDB and try again.')
    }

    const { username, email, password, repassword } = req.body
    const user = new Users({
        username,
        email,
        password,
        repassword
    })

    try {
        await user.save()
        console.log(user)
        return res.redirect(303, '/') //this goes to index.html
    } catch (err) {
        console.error('Failed to save user:', err?.message ?? err) 
        return res.status(500).send('Failed to create account. Please try again.')
    }
})

app.listen(port, ()=>{
    console.log("Server started")
})



