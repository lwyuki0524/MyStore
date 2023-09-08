const User = require("../models/User")
const CryptoJS = require('crypto-js'); // 引入 CryptoJS

// 新增
const store = async(req, res) => {
    console.log(req.body)

    try{
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: '該電子郵件地址已被使用。' });
        }
    }
    catch(error){
        res.send(`Some error occured => ${error}`)
    }

    // 使用req來創建新的User實例
    let user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
    })

    // 儲存此User到mongoDB
    try{
        const result = await user.save()
        // 設置cookie
        res.cookie('userID', user._id.toString());
        res.json(result)
    }
    catch(error){
        res.status(500).json({ message: `發生錯誤 => ${error}` });
    }    
}

// 查詢
// 查詢所有用戶資料
const index = async(req, res) => {
    try{
        const allUserdata = await User.find()
        res.status(200).json(allUserdata)
    }
    catch(error){
        res.send(`Some error occured => ${error}`)
    }
}
// 查詢一個用戶資料
const show = async(req, res) => {
    // 從客戶端得到userID
    let userID = req.body.userID
    try{
        // 透過userID得到用戶資料
        const userdata = await User.findById(userID)
        res.status(200).json(userdata)
    }
    catch(error){
        res.send(`Some error occured => ${error}`)
    }
}

// 修改
const update = async(req, res) => {
    let userID = req.body.userID
    try{
        // 目前使用者的資料
        const currentUser = await User.findById( userID )
        // 已存在的信箱
        const existingUser = await User.findOne({ email: req.body.email });
        // 如果已存在信箱，且此信箱不是目前用戶的信箱。表示有其他用戶使用了，不能更新。
        if (existingUser && currentUser.email!=existingUser.email ) {
            return res.status(400).json({ message: '該電子郵件地址已被使用。' });
        }
    }
    catch(error){
        res.send(`Some error occured => ${error}`)
    }

    let updateData = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
    }
    try{
        const result = await User.findByIdAndUpdate(userID, {$set:updateData})
        let response = {
            message:"User更新成功",
            result: result
        }
        res.send(response)
    }
    catch(error){
        res.send(`Some error occured => ${error}`)
    } 
}

// 刪除
const destory = async(req, res) => {
    let userID = req.body.userID
    try{
        const result = await User.findByIdAndRemove(userID)
        res.json(result)
    }
    catch(error){
        res.send(`Some error occured => ${error}`)
    }
}

// 登入
const login = async(req, res) => {

    try{
        const user  = await User.findOne({ email: req.body.email });
        
        if (user){
            const secretKey = process.env.SECRETKEY;
            const iv = CryptoJS.enc.Utf8.parse(process.env.IV);
            const decrypted_pwd = CryptoJS.AES.decrypt( user.password , secretKey, {iv}).toString(CryptoJS.enc.Utf8);
            if (decrypted_pwd==req.body.password) {
                // 設置cookie
                res.cookie('userID', user._id.toString());
                // 用戶存在，可以登入
                res.status(200).json({ message: 'Login successful', user });
              } else {
                // 密碼錯誤，登入失敗
                res.status(401).json({ message: 'Login failed' });
              }
        }
        else {
            // 用戶不存在，拒絕登入
            res.status(401).json({ message: 'Login failed' });
        }
        
    }
    catch(error){
        res.send(`Some error occured => ${error}`)
    }
}

module.exports = {store, show, index, update, destory, login}