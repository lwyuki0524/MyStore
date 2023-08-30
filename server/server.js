require('dotenv').config();
require('./MongoDB/connectdb')
const express = require('express')
const UserRoute = require('./routes/user')
// const cors = require("cors");

app = express()

app.get('/',(req, res)=>{
    res.send('Hello!!!!')
})

const port = process.env.PORT || 5000

app.listen( port, ()=>{
    console.log(`sesrver is running on port ${port}`)
})

app.use(express.json()) // 使用 express.json() 中間件來解析 JSON 請求體
app.use('/api/user', UserRoute)

// app.use(cors());
// app.use(express.static(path.join(__dirname, "client/public")));