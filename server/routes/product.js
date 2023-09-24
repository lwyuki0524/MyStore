const express = require("express")
const router = express.Router()

const ProductController = require('../Controller/ProductController')

router.get('/',(req,res)=>{
    res.send('正在使用router')
})

// Product
router.get('/index', ProductController.showAllProduct)
router.get('/image', ProductController.getUploadedImgUrl)
router.post('/add', ProductController.addProduct)
router.post('/update', ProductController.updateProduct)
router.post('/delete', ProductController.deleteProduct)

module.exports = router