import React ,{useEffect, useState} from 'react'
import {getCookie, deleteAllCookies, encrypt, decrypt} from '../util/utils';
import Nav from '../components/nav';
import { Card, CardBody, CardFooter, Box, Text, Input, InputGroup, InputRightElement, Stack, useToast, Button, useDisclosure, 
			AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, 
			Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
			FormControl, FormLabel  } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function MemberCenter() {
    const [showPassword, setShowPassword] = useState(false) // 是否顯示密碼的狀態設置
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    
    // 登入訊息
    const toast = useToast()

    // 第一次渲染時或userData改變時執行，顯示使用者畫面
    useEffect(() => {
        // 從 Cookie 中獲取 userID
        const userID = getCookie('userID');

        if(!userID){
            toast({
                title: '請先登入',
                status: 'warning',
                isClosable: true,
              })
            setTimeout(() => {
              navigate('/login', { replace: true })
            }, 100);
        }
        else{
            // 發起請求以獲取用戶數據
            fetch('/api/user/show', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID: userID }), // 將 userID 發送到後端
            })
            .then((response) => response.json())
            .then((data) => {
              // 在請求成功後，更新用戶數據
              setUserData(data);
            })
            .catch((error) => {
              console.error('Error fetching user data:', error);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [userData]);
    

    return (
        <div>
            <Nav />
            <Box m ='5%'>
                <Text align ='center'>會員中心</Text>
                {userData ? (
                    
                    <Card align="center">
                        <CardBody align="center">
                          <Stack  p="10px" direction="row" align="center">
                            <Stack align="center">
                                <Box p="10px" h="45px">姓名:</Box>
                                <Box p="10px" h="45px">Email: </Box>
                                <Box p="10px" h="45px">密碼: </Box>
                                <Box p="10px" h="45px">電話: </Box>
                                <Box p="10px" h="45px">地址:</Box>
                            </Stack>
                            <Stack>
                              <Input value={userData.username} h="45px" maxW="100%" isReadOnly={true}/>
                              <Input value={userData.email} h="45px" maxW="100%" isReadOnly={true}/>
                              <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} 
                                value={decrypt(userData.password)} h="45px" maxW="100%" isReadOnly={true}/>
                                <InputRightElement h={'full'}>
                                  <Button
                                    variant={'ghost'}
                                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                  </Button>
                                </InputRightElement>
                              </InputGroup>
                              <Input value={userData.phone} h="45px" maxW="100%" isReadOnly={true}/>
                              <Input value={userData.address} h="45px" maxW="100%" isReadOnly={true}/> 
                            </Stack>
                          </Stack>
                        </CardBody>

                        <CardFooter align='center'>
														<EditUserInfo userData = {userData} />
                            <AlertDialogModel/>
                        </CardFooter>
                    </Card>
                ) : (
                  <Box textAlign="center">
                    <p>無權限</p>
                  </Box>
                )}
            </Box>
        </div>
    )
}

// 編輯視窗
function EditUserInfo({userData}){
	const { isOpen, onOpen, onClose } = useDisclosure()
	// 編輯訊息
	const toast = useToast();

	// 預設值
	const initialFormData = {
		username: userData.username, 
		email: userData.email, 
		phone: userData.phone , 
		address: userData.address, 
		password: decrypt(userData.password)
	}

	// 表單相關
	const [formData, setFormData] = useState( initialFormData ); // 表單資料狀態
	const [showPassword, setShowPassword] = useState(false) // 是否顯示密碼的狀態設置
  const [errors, setErrors] = useState({}); // 格式錯誤狀態

  /* 檢查用戶輸入格式 */
  // 使用正則表達式來檢查格式
  const validatePhone = (phone) => { return /^\d{10}$/.test(phone); }
  const validateEmail = (email) => { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  const validatePassword = (password) => {
    return /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
  } // 密碼至少需要6個字符，包括一個特殊符號、一個大寫字母、一個小寫字母

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newFormData = { ...formData };
    let newErrors = { ...errors };
    if (name === 'username') {
      if(value){ delete newErrors.username; }
      else{ newErrors.username = '必填'; }
    }
    if (name === 'phone') {
      if (!validatePhone(value)) { newErrors.phone = '電話必須是10個數字'; } 
      else { delete newErrors.phone; }
    }
    if (name === 'email') {
      if (!validateEmail(value)) { newErrors.email = 'Email格式不正確'; }
      else { delete newErrors.email; }
    }
    if (name === 'address') {
      if(value){ delete newErrors.address; }
      else{ newErrors.address = '必填'; }
    }
    if (name === 'password') {
      if (!validatePassword(value)) { newErrors.password = '密碼必須至少包含一個特殊符號、一個大寫字母、一個小寫字母，且至少6個字符'; }
      else { delete newErrors.password; }
    }
    newFormData[name] = value;
    setFormData(newFormData);
    setErrors(newErrors);
  }
  // 設定錯誤訊息樣式
  const errorStyle = {
    color: 'red',
    fontSize:'7px',
    padding: '2px',
  };

	// 取消編輯
	const handleCancel = () =>{
		setFormData(initialFormData);
		onClose();
	}

	// 送出表單進行密碼加密處理
	const handleSubmit = async(event) => {
    event.preventDefault(); // 阻止表單的默認提交行為，因為要加密密碼，所以要避免頁面重新加載或導航到新的頁面

    // 檢查必填字段是否為空
    const requiredFields = ['username', 'email', 'phone', 'address', 'password'];
    let newErrors = { ...errors };
    for (const field of requiredFields) {
      if (!formData[field]) { newErrors[field] = '此字段為必填項'; } // 若沒資料 
      else if(formData[field] && !newErrors[field]){ delete newErrors[field]; } // 若有資料，且格式正確
    }
    // 如果有錯誤訊息，則設置錯誤並不提交表單
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: '輸入格式錯誤',
        status: 'error',
        isClosable: true,
      })
      return;
    }
    else{
      // 若無錯誤，則進行表單送出前的處理
      // 在此處進行密碼加密
      const encryptedPassword = encrypt( formData.password ).toString();
      // 將加密後的密碼發送到後端或執行其他操作
      // 取得userID
      const userID = getCookie('userID');
      // 發起異步請求註冊用戶
      try {
        const response = await fetch('/api/user/update', {
            method: 'POST',
            body: JSON.stringify({userID:userID, ...formData, password:encryptedPassword}),
            headers:{
                'Content-Type': 'application/json',
            },
        });

        if (response.ok){
            toast({
                title: '更新成功',
                status: 'success',
                isClosable: true,
              })
            onClose();
        }
        else if(response.status === 400){
          toast({
            title: '該電子郵件地址已被使用。',
            status: 'error',
            isClosable: true,
          })
        }
        else{
            toast({
                title: '更新失敗。請再試一次!',
                status: 'error',
                isClosable: true,
              })
            onClose();
        }
      }
      catch(error){
          toast({
              title: '更新失敗',
              status: 'error',
              isClosable: true,
            })
          onClose();
          console.error('會員更新錯誤:', error);
      }
    }
  };

	const initialRef = React.useRef(null)
	const finalRef = React.useRef(null)

	return (
		<>
		<Button 
			bg='gray.200' fontWeight="semibold"  color='black'  borderRadius='5' mr='10px'
			_hover={{
				transform: "scale(1.05, 1.05)", bg: `gray.300`,
				_dark: { bg: `gray.300`, },
			}}
			_active={{
				bg: `gray.500`, transform: "scale(1, 1)",
				_dark: {bg: `gray.400`,}
			}} onClick={onOpen}>
				編輯帳戶資料
		</Button>

		<Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>修改資料</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl id='username'>
              <FormLabel>姓名</FormLabel>
              <Input type="text" name="username" value={formData.username} onChange={handleInputChange} ref={initialRef} placeholder='輸入姓名...' />
              {errors.username && <div style={errorStyle}>{errors.username}</div>}
            </FormControl>
						<FormControl id='Email' mt={4}>
              <FormLabel>Email</FormLabel>
              <Input type="text" name="email" value={formData.email} onChange={handleInputChange} placeholder='輸入Email...' />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </FormControl>
            <FormControl id='password' mt={4}>
              <FormLabel>密碼</FormLabel>
							<InputGroup>
								<Input type={showPassword ? 'text' : 'password'} 
									name="password" value={formData.password} onChange={handleInputChange} placeholder='輸入新密碼...' />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.password && <div style={errorStyle}>{errors.password}</div>}
            </FormControl>
						<FormControl id='phone' mt={4}>
              <FormLabel>電話</FormLabel>
              <Input type="tel"  name="phone" value={formData.phone} onChange={handleInputChange} placeholder='輸入電話...' />
              {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
            </FormControl>
						<FormControl id='address' mt={4}>
              <FormLabel>地址</FormLabel>
              <Input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder='輸入地址...' />
              {errors.address && <div style={errorStyle}>{errors.address}</div>}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme='blue' mr={3}>
              儲存
            </Button>
            <Button onClick={handleCancel}>取消</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

		</>
	)
}

// 警告視窗
function AlertDialogModel() {
    
    const navigate = useNavigate();
    // 提醒訊息
    const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    // 處理刪除帳戶
    const handleDeleteUser = async() => {
        const userID = getCookie('userID');
        // 發起異步請求刪除用戶
        try{
            const response = await fetch('api/user/delete',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID: userID})
            });
            
            if (response.ok){
                deleteAllCookies();
                toast({
                    title: '帳戶刪除成功',
                    status: 'success',
                    isClosable: true,
                  })
                navigate('/', { replace: true });
            }
        }
        catch(error){
            toast({
                title: '帳戶刪除 error',
                status: 'error',
                isClosable: true,
              })
              console.error('帳戶刪除error:', error);
        }
    }


    return (
      <>
        <Button 
            borderRadius='5'
            colorScheme='red'
            onClick={onOpen}
            >
            刪除帳戶
        </Button>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                刪除帳戶
              </AlertDialogHeader>
  
              <AlertDialogBody>
                你確定要刪除嗎？ 此操作無法復原。
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button borderRadius='5' ref={cancelRef} onClick={onClose}>
                  取消
                </Button>
                <Button borderRadius='5' colorScheme='red' onClick={handleDeleteUser} ml={3}>
                  確認刪除
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }