const Product = require("../Models/Product");
const { cloudinary } = require("../utils/cloudinary");


const getUploadedImgUrl = async(req, res)=>{
    const {resources} = await cloudinary.search
    .expression('folder:store/product')
    .sort_by('public_id','desc')
    .max_results(30)
    .execute();

    const publicIds = resources.map( file => file.url );
    console.log(publicIds);
    res.send(publicIds);
}


// 新增
const addProduct = async(req, res) => {
    console.log(req.body)
    let ImgUrl = req.body.url;
    // 處理圖片上傳
    try{
        const fileStr = req.body.url;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr,{
            upload_preset: 'kszxgiwl'
        })
        console.log(uploadedResponse);
        ImgUrl = uploadedResponse.url
    }
    catch(error){
        console.log(error)
        res.status(500).json({err: 'Something went wrong!'});
    }

    console.log(`ImgUrl=${ImgUrl}`);

    // 使用req來創建新的Product實例
    let product = new Product({
        name: req.body.name,
        url: ImgUrl,
        intro: req.body.intro,
        category: req.body.category,
        stock: req.body.stock,
        price: req.body.price,
        status: req.body.status,
    })

    // 儲存此Product到mongoDB
    try{
        const result = await product.save()
        // 設置cookie
        res.cookie('productID', product._id.toString());
        res.json(result)
    }
    catch(error){
        res.status(500).json({ message: `發生錯誤 => ${error}` });
    }    
}

// 查詢
// 查詢所有商品資料
const showAllProduct = async(req, res) => {
    // 定義分頁參數
    const pageSize = req.query.pageSize || 5; // 每頁顯示的文件數量
    const currentPage = req.query.currentPage || 1; // 目前頁碼
    // 計算skip值
    const skip = (currentPage - 1) * pageSize;

    try{
        /* 總頁數計算*/
        // 總資料條目數
        const totalProductCount = await Product.countDocuments();
        // 計算總頁數
        const totalPages = Math.ceil(totalProductCount / pageSize);

        /* 搜尋商品 */
        const allProductdata = await Product.find().skip(skip).limit(pageSize);
        res.status(200).json({
            totalItems : totalProductCount,
            totalPageCount : totalPages,
            data : allProductdata
        })
    }
    catch(error){
        res.send(`Some error occured => ${error}`)
    }
}

// 修改
const updateProduct = async(req, res) => {
    let productID = req.body.productID
    let updateData = {
        name: req.body.name,
        url: req.body.url,
        intro: req.body.intro,
        category: req.body.category,
        stock: req.body.stock,
        price: req.body.price,
        status: req.body.status,
    }
    try{
        const result = await Product.findByIdAndUpdate(productID, {$set:updateData})
        let response = {
            message:"Product更新成功",
            result: result
        }
        res.send(response)
    }
    catch(error){
        res.send(`Some error occured => ${error}`)
    } 
}


// 刪除
const deleteProduct = async(req, res) => {
    let productID = req.body._id
    let ImageURL = req.body.url
    // 刪除產品資料跟 cloudinary 的 Image
    try{
        await Product.findByIdAndRemove(productID)
        .then( result => {
                console.log(result);
                if(result){
                    delImage_result = delImage({ImageURL})
                    if(delImage_result){
                        res.status(200).json({
                            message:{
                                result,
                                delImage_result
                            }
                        })
                    }
                    else{
                        res.status(500).json({delImage_result});
                    }
                }
                else{
                    res.status(500).json({result});
                }
            }
        )
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                error:err
            })
        })
    }
    catch(error){
        res.send(`Some error occured => ${error}`)
    }
}

const delImage = async({ImageURL}) => {
    const urlArray = ImageURL.split('/');
    const img = urlArray[urlArray.length-1]
    const imgName = img.split('.')[0];

    await cloudinary.search
   .expression(`resource_type:image AND folder:store/product AND filename="${imgName}"`)
   .with_field('context')
   .max_results(1)
   .execute()
   .then((result) => {
        if (result.total_count === 0) {
            console.error('未找到符合的圖片');
        } 
        else {
            const public_id = result.resources[0].public_id;
            console.log(`找到符合的圖片，public_id為: ${public_id}`);

            // 使用 public_id 來刪除圖片
            cloudinary.uploader.destroy(public_id, (error, result) => {
                if (error) { console.error(error); } 
                else {
                    console.log('圖片刪除成功');
                    return result;
                }
            });
        }
    })
    .catch((error) => {
        console.error('發生錯誤', error);
    });
}

module.exports = {addProduct, showAllProduct, updateProduct, deleteProduct, getUploadedImgUrl}