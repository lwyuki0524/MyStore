const express = require("express")
const router = express.Router()

const UserController = require('../Controller/UserController')

router.get('/',(req,res)=>{
    res.send('正在使用router')
})

router.get('/index', UserController.showAllUser)
router.post('/show', UserController.showUser)
router.post('/save', UserController.addUser)
router.post('/update', UserController.updateUser)
router.post('/delete', UserController.deleteUser)
router.post('/login', UserController.login)

module.exports = router