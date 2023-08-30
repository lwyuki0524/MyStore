const User = require("../models/User")

// 新增
const store = async(req, res) => {
    console.log(req.body)
    // 使用req來創建新的User實例
    let user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
    })

    // 儲存此User到mongoDB
    try{
        const result = await user.save()
        res.json(result)
    }
    catch(error){
        res.send(`Some error occured => ${error}`)
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
    let userID = res.body.userID
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
    let updateData = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
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


module.exports = {store, index, update, destory}