require('dotenv').config();
require('./utils/connectdb')
const express = require('express')
const {cloudinary} = require('./utils/cloudinary');
const UserRoute = require('./routes/user')
const ProductRoute = require('./routes/product')

app = express()
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended:true }));

app.get('/',(req, res)=>{
    res.send('Hello!!!!')
})

const port = process.env.PORT || 5000

app.listen( port, ()=>{
    console.log(`server is running on port ${port}`)
})

app.use(express.json()) // 使用 express.json() 中間件來解析 JSON 請求體
app.use('/api/user', UserRoute)
app.use('/api/product', ProductRoute)
