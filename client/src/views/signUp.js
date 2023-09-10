import { Flex, Box, FormControl, FormLabel, Input, InputGroup,
  InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import Nav from '../components/nav'
import { useNavigate } from 'react-router-dom'
import {getCookie, encrypt} from '../util/utils'

export default function SignUp() {
  // 表單相關
  const [showPassword, setShowPassword] = useState(false) // 是否顯示密碼的狀態設置
  const [formData, setFormData] = useState({ username: '', email: '', phone:'' , address:'', password: '' }); // 表單資料狀態
  const [signUpStatus, setSignUpStatus] = useState(null); //  註冊狀態
  const [errors, setErrors] = useState({}); // 格式錯誤狀態

  // 註冊訊息提醒
  const toast = useToast()

  // 按鍵處理
  const navigate = useNavigate();
  const handleLoginClick = () => {
      navigate('/login', { replace: true }); 
  };

  /* 檢查用戶輸入格式 */
  // 使用正則表達式來檢查格式
  const validatePhone = (phone) => { return /^\d{10}$/.test(phone); }
  const validateEmail = (email) => { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  const validatePassword = (password) => {
    return /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
  } // 密碼至少需要6個字符，包括一個特殊符號、一個大寫字母、一個小寫字母
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      newFormData[name] = encrypt(value);
    }
    else{ newFormData[name] = value; }
    setFormData(newFormData);
    setErrors(newErrors);
  }
  // 設定錯誤訊息樣式
  const errorStyle = {
    color: 'red',
    fontSize:'7px',
    padding: '2px',
  };
  // 點擊註冊後，進行註冊的api處理，並設置註冊狀態signUpStatus
  const handleSignUp = async (e) => {
    e.preventDefault();

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
      // 若無錯誤，則發起異步請求註冊用戶
      try {
          const response = await fetch('/api/user/save', {
              method: 'POST',
              body: JSON.stringify(formData),
              headers:{
                  'Content-Type': 'application/json',
              },
          });

          if (response.ok){
              toast({
                  title: '註冊成功',
                  status: 'success',
                  isClosable: true,
                })
              setSignUpStatus(true);
          }
          else if(response.status === 400){
            toast({
              title: '該電子郵件地址已被使用。',
              status: 'error',
              isClosable: true,
            })
            setSignUpStatus(false);
          }
          else{
              toast({
                  title: '註冊失敗。請再試一次!',
                  status: 'error',
                  isClosable: true,
                })
              setSignUpStatus(false);
          }
      }
      catch(error){
          toast({
              title: '註冊失敗',
              status: 'error',
              isClosable: true,
            })
          console.error('用戶註冊失敗:', error);
          setSignUpStatus(false);
      }
    }
  }

  // signUpStatus狀態改變時執行
  useEffect(() => {
    // 取得cookie
    const userID = getCookie('userID');
    if (userID) {
        // 導航至會員中心 
        navigate('/memberCenter', { replace: true }); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUpStatus]);

  return (
    <>
    <Nav/>
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          minW={'md'}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <Box>
            <FormControl id="username" isRequired>
                <FormLabel>姓名</FormLabel>
                <Input type="text" name='username' onChange={handleInputChange}/>
                {errors.username && <div style={errorStyle} >{errors.username}</div>}
            </FormControl>
            </Box>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name='email' onChange={handleInputChange}/>
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </FormControl>
            <FormControl id="phone" isRequired>
              <FormLabel>電話</FormLabel>
              <Input type="tel" name='phone' onChange={handleInputChange}/>
              {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
            </FormControl>
            <FormControl id="address" isRequired>
              <FormLabel>地址</FormLabel>
              <Input type="text" name='address' onChange={handleInputChange} />
              {errors.address && <div style={errorStyle}>{errors.address}</div>}
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>密碼</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} name='password' onChange={handleInputChange}/>
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
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSignUp}
                >
                註冊
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                已有帳號? <Link color={'blue.400'} onClick={handleLoginClick}>登入</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
    </>
  )
}