const express = require("express")
const router = express.Router()

const UserController = require('../Controller/UserController')

router.get('/',(req,res)=>{
    res.send('正在使用router')
})

router.get('/index', UserController.index)
router.post('/show', UserController.show)
router.post('/save', UserController.store)
router.post('/update', UserController.update)
router.post('/delete', UserController.destory)
router.post('/login', UserController.login)

module.exports = router