import { EditIcon } from "@chakra-ui/icons";
import { Table, Thead, Tbody, Tr, Th, Td, Box, IconButton, useDisclosure, Button, Radio, HStack,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, 
    FormLabel, Input, FormControl, Image, RadioGroup, Stack, useToast, 
    AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialog, AlertDialogFooter,
 } from "@chakra-ui/react"
import React, { useState } from "react";
import Pages from "../components/pagination";

export default function ProductInfo() {

    // 資料狀態
    const [productData, setProductData] = useState();

    // 取得商品資料和總頁面數
    const fetchProductData = async(currentPage, pageSize)=>{
        try{
            const response = await fetch(`/api/product/index?currentPage=${currentPage}&pageSize=${pageSize}`)
            if (!response.ok) { 
                throw new Error('Network response was not ok');
            }
            const product_data = await response.json();
            setProductData(product_data['data']);
            return product_data
        }
        catch(error){
            console.error('Error fetching data:', error);
        }
    }

    return(
        <div>
            <Box fontSize={'20px'} fontWeight={'700'} marginBottom={'50px'} align='center'> 商品管理 </Box>
            <Stack alignItems="flex-end">
                <AddModel />
            </Stack>
            <Table variant="simple" align="center" w={'100%'}>
                <Thead>
                    <Tr my=".8rem" pl="0px">
                        <Th pl="0px" textAlign={"center"} color="gray.500">
                          商品照片
                        </Th>
                        <Th pl="0px" textAlign={"center"} color="gray.500">
                            商品名稱
                        </Th>
                        <Th color="gray.500">商品介紹</Th>
                        <Th color="gray.500">分類</Th>
                        <Th color="gray.500">存貨</Th>
                        <Th color="gray.500">單價</Th>
                        <Th color="gray.500">狀態(上/下架)</Th>
                        <Th>操作</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {productData?.map((row, i) => {
                        return (
                        <Tr key={i}>
                            <Td w='180px'>
                              <Image src={row.url} borderRadius='lg' w='100%' />
                            </Td>
                            <Td>{row.name}</Td>
                            <Td>{row.intro}</Td>
                            <Td>{row.category}</Td>
                            <Td>{row.stock}</Td>
                            <Td>{row.price}</Td>
                            <Td>{row.status}</Td>
                            <Td>
                                <Stack direction="row">
                                    <EditModel row={row}/>
                                    <AlertDialogModel row={row}/>
                                </Stack>
                            </Td>
                        </Tr>
                        )
                    })}
                </Tbody>
            </Table>
            {/* 父頁面傳給子頁面參數:fetchdata*/}
            <Pages fetchdata={fetchProductData}  />
            
        </div>
    );
}

function AddModel(){
    const {isOpen, onOpen, onClose} = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    // 圖片狀態
    const [previewSoruce, setPreviewSoruce] = useState()

    // 表單相關
    const [formData, setFormData] = useState({ name: '', url: '', intro:'' , category:'', stock: '', price: '', status: ''  }); // 表單資料狀態
    const [errors, setErrors] = useState({}); // 格式錯誤狀態

    // 註冊訊息提醒
    const toast = useToast()

    // 設定錯誤訊息樣式
    const errorStyle = {
        color: 'red',
        fontSize:'7px',
        padding: '2px',
    };

    // 處理圖片上傳
    const handleImageChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData };
        let newErrors = { ...errors };

        const file = e.target.files[0]
        const reader = new FileReader();
        if(file){
            try{
                reader.readAsDataURL(file);
                reader.onloadend = () =>{
                    setPreviewSoruce(reader.result)
                    if( value ){ 
                        delete newErrors.url;
                        newFormData[name] = reader.result;
                    }
                    else{ newErrors.url = '必填'; }
                }
            }
            catch(error){
                console.log(error);
            }
        }
        else{
            newErrors.url = '必填';
            setPreviewSoruce("");
        }
        setFormData(newFormData);
        setErrors(newErrors);

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData };
        let newErrors = { ...errors };

        if (name === 'name') {
            if(value){ delete newErrors.name; }
            else{ newErrors.name = '必填'; }
        }
        if (name === 'intro') {
            if(value){ delete newErrors.intro; }
            else{ newErrors.intro = '必填'; }
        }
        if (name === 'category') {
            if(value){ delete newErrors.category; }
            else{ newErrors.category = '必填'; }
        }
        if (name === 'stock') {
            if(value){ delete newErrors.stock; }
            else{ newErrors.stock = '必填'; }
        }
        if (name === 'price') {
            if(value){ delete newErrors.price; }
            else{ newErrors.price = '必填'; }
        }
        if (name === 'status') {
            if(value){ delete newErrors.status; }
            else{ newErrors.status = '必填'; }
        }

        newFormData[name] = value;
        setFormData(newFormData);
        setErrors(newErrors);
    }


    const handleAddProduct = async(event) => {
        event.preventDefault();
        // 檢查必填字段是否為空
        const requiredFields = ['name', 'url' , 'intro', 'category', 'stock', 'price', 'status'];
        let newErrors = { ...errors };
        for (const field of requiredFields) {
            if (!formData[field]) { newErrors[field] = '此為必填項'; } // 若沒資料 
            else if(formData[field] && !newErrors[field]){ delete newErrors[field]; } // 若有資料，且格式正確
        }
        
        // 如果有錯誤訊息，則設置錯誤並不提交表單
        if (Object.keys(newErrors).length > 0) {
            console.log(newErrors)
            setErrors(newErrors);
            toast({
            title: '輸入格式錯誤',
            status: 'error',
            isClosable: true,
            })
            return;
        }
        else{
            // 若無錯誤，則發起異步請求新增產品
            try {
                const response = await fetch('/api/product/add', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers:{
                        'Content-Type': 'application/json',
                    },
                });
      
                if (response.ok){
                    toast({
                        title: '新增成功',
                        status: 'success',
                        isClosable: true,
                      })
                    sessionStorage.setItem('page', 'productInfo');
                    setTimeout(() => {
                        window.location.reload();
                    }, 50);
                }
                else{
                    toast({
                        title: '新增失敗。請再試一次!',
                        status: 'error',
                        isClosable: true,
                      })
                }
            }
            catch(error){
                toast({
                    title: '新增失敗',
                    status: 'error',
                    isClosable: true,
                  })
                console.error('商品新增失敗:', error);
            }
        }
    }

    return(
        <>
            <Button w="fit-content" borderRadius="5" margin="20px 50px" onClick={onOpen}>
              新增
            </Button>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>新增商品</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl id="url" isRequired>
                            <FormLabel>商品照片</FormLabel>
                            <Input
                                name='url'
                                w="fit-content"
                                type="file"
                                id="imageUpload"
                                accept="image/*" // 只允許選擇圖片文件
                                onChange={handleImageChange}/>
                                { previewSoruce && (
                                    <img
                                    src={previewSoruce}
                                        alt="Selected"
                                        width="200"
                                    />   
                                )}
                                {errors.url && <div style={errorStyle}>{errors.url}</div>}
                        </FormControl>
                        <FormControl id="name" isRequired>
                            <FormLabel>商品名稱</FormLabel>
                            <Input type="text" name='name' onChange={handleInputChange}/>
                            {errors.name && <div style={errorStyle}>{errors.name}</div>}
                        </FormControl>
                        <FormControl id="intro" mt={4} isRequired>
                            <FormLabel>商品介紹</FormLabel>
                            <Input type="text" name='intro' onChange={handleInputChange}/>
                            {errors.intro && <div style={errorStyle}>{errors.intro}</div>}
                        </FormControl>
                        <FormControl id="category" mt={4} isRequired>
                            <FormLabel>分類</FormLabel>
                            <Input type="text" name='category' onChange={handleInputChange}/>
                            {errors.category && <div style={errorStyle}>{errors.category}</div>}
                        </FormControl>
                        <FormControl id="stock" mt={4} isRequired>
                            <FormLabel>存貨</FormLabel>
                            <Input type="number" name='stock' onChange={handleInputChange}/>
                            {errors.stock && <div style={errorStyle}>{errors.stock}</div>}
                        </FormControl>
                        <FormControl id="price" name='price' mt={4} isRequired>
                            <FormLabel>單價</FormLabel>
                            <Input type="number" name='price' onChange={handleInputChange} />
                            {errors.price && <div style={errorStyle}>{errors.price}</div>}
                        </FormControl>
                            <FormControl id="status" mt={4} isRequired>
                            <FormLabel>狀態(上/下架)</FormLabel>
                            <RadioGroup>
                                <HStack spacing='24px'>
                                <Radio value='上架' name='status' onChange={handleInputChange}>上架</Radio>
                                <Radio value='下架' name='status' onChange={handleInputChange}>下架</Radio>
                                </HStack>
                                {errors.status && <div style={errorStyle}>{errors.status}</div>}
                            </RadioGroup>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={handleAddProduct} >
                            送出
                        </Button>
                        <Button onClick={onClose}>取消</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

function EditModel({row}){
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    return (
        <>
        <IconButton 
        backgroundColor={"white"} 
        icon={<EditIcon/>}
        w={"fit-content"}
        borderRadius={'5px'}
        onClick={onOpen}/>
        <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編輯商品</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>商品照片</FormLabel>
              <Image src={row.url} borderRadius='lg' w={'100%'}/>
            </FormControl>
            <FormControl>
              <FormLabel>商品名稱</FormLabel>
              <Input value={row.name}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>商品介紹</FormLabel>
              <Input value={row.intro}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>分類</FormLabel>
              <Input value={row.category}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>存貨</FormLabel>
              <Input value={row.stock}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>單價</FormLabel>
              <Input value={row.price}/>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>狀態(上/下架)</FormLabel>
              <RadioGroup defaultValue={row.status}>
                <HStack spacing='24px'>
                  <Radio value='上架'>上架</Radio>
                  <Radio value='下架'>下架</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}


// 警告視窗
function AlertDialogModel({row}) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef()

    const toast = useToast();

    // 刪除商品
    const handleDelete = async({row}) => {

        try{
            const response = await fetch('/api/product/delete', {
                method: 'POST',
                body: JSON.stringify(row),
                headers:{
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok){
                toast({
                    title: '商品刪除成功',
                    status: 'success',
                    isClosable: true,
                })
                sessionStorage.setItem('page', 'productInfo');
                setTimeout(() => {
                    window.location.reload();
                }, 50);
            }
        }
        catch(error){
            console.error('Error fetching data:', error);
        }
    }

    return (
        <>
            <Button fontSize="smaller" borderRadius="5" 
                colorScheme="red" w="fit-content" alignContent="center"
                onClick={onOpen} >
                刪除
            </Button>

            <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        刪除商品
                    </AlertDialogHeader>
        
                    <AlertDialogBody>
                        你確定要刪除嗎？ 此操作無法復原。
                    </AlertDialogBody>
        
                    <AlertDialogFooter>
                        <Button borderRadius='5' ref={cancelRef} onClick={onClose}>
                        取消
                        </Button>
                        <Button borderRadius='5' colorScheme='red' 
                        onClick={() => handleDelete({ row })} ml={3}>
                        確認刪除
                        </Button>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}