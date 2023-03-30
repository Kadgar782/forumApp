const express = require('express')
const mongoose = require('mongoose')
const app = express()
const authRouter = require('./routes/authRouter')
const products_routes = require('./routes/products.js')
const comments_routes = require('./routes/comment.routes.js')
const data_routes = require('./routes/data.routes.js')
const cookieParser = require('cookie-parser')
const cors = require('cors');

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
    .then((result) => app.listen(5001))
    .catch((err) => console.log(err))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter)
app.use('/api/products', products_routes)
app.use('/api/comments', comments_routes)
app.use('/api/data',data_routes)


