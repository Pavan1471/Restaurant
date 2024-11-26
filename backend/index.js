// const express = require('express')
// const cors = require('cors')
// const cookieParser = require('cookie-parser')
// require('dotenv').config()
// const connectDB = require('./config/db')
// const router = require('./routes')


// const app = express()
// app.use(cors())
// app.use(express.json())
// app.use(cookieParser())

// app.use("/api",router)

// const PORT = 8080 || process.env.PORT


// connectDB().then(()=>{
//     app.listen(PORT,()=>{
//         console.log("connnect to DB")
//         console.log("Server is running "+PORT)
//     })
// })


const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');

const app = express();

// Update the CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // your frontend URL
    credentials: true, // to allow cookies and other credentials
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

const PORT = 8080 || process.env.PORT;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Connected to DB");
        console.log("Server is running on port " + PORT);
    });
});
