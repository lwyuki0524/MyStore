const mongoose = require('mongoose')
require('dotenv').config();

// 連接MongoDB
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.once('open', ()=>{
    console.log('資料庫連線成功!' + process.env.DB_URL)
}).on('error', (err)=>{ //連線失敗 //.on: 處理連線錯誤的事件監聽器。
    console.error('連線錯誤', err)
})

