import { Flex, Box, FormControl, FormLabel, Input, InputGroup,
    InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import Nav from '../components/nav'
import { useNavigate } from 'react-router-dom'
import { getCookie } from '../util/utils';

export default function Login() {
  // 表單相關
  const [showPassword, setShowPassword] = useState(false) // 是否顯示密碼的狀態設置
  const [formData, setFormData] = useState({ email: '', password: '' }); // 表單資料狀態
  const [loginStatue, setLoginStatue] = useState(null); //  登入狀態
  const [errors, setErrors] = useState({}); // 格式錯誤狀態
  
  // 訊息提醒
  const toast = useToast()

  // 按鍵處理
  const navigate = useNavigate();
  const handleRegisterClick = () => {
      navigate('/signup', { replace: true });
  };

  /* 檢查用戶輸入格式 */
  // 使用正則表達式來檢查格式
  const validateEmail = (email) => { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  const validatePassword = (password) => {
    return /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
  } // 密碼至少需要6個字符，包括一個特殊符號、一個大寫字母、一個小寫字母
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData };
    let newErrors = { ...errors };
    if (name === 'email') {
      if (!validateEmail(value)) { newErrors.email = 'Email格式不正確'; }
      else { delete newErrors.email; }
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
  // 點擊登入後，進行登入api處理，並設置登入狀態loginStatue
  const handleLogin = async () => {
    // 檢查必填字段是否為空
    const requiredFields = ['email', 'password'];
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
      // 若無錯誤， 則發起異步請求登入
      try {
        const response = await fetch('/api/user/login', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers:{
              'Content-Type': 'application/json',
          },
        });
        if (response.ok){
          toast({
            title: '登入成功',
            status: 'success',
            isClosable: true,
          })
          setLoginStatue(true);
        }
        else{
          toast({
            title: '帳密錯誤，登入失敗。請再試一次!',
            status: 'error',
            isClosable: true,
          })
          setLoginStatue(false);
        }
      }
      catch(error){
          toast({
            title: '用戶登入錯誤',
            status: 'error',
            isClosable: true,
          })
          console.error('用戶登入錯誤:', error);
          setLoginStatue(false);
      }
    }
  }

  // loginStatue 狀態改變時執行
  useEffect(() => {
    // 取得cookie
    const userID = getCookie('userID');
    const manager = getCookie('manager');
    if (userID) {
      // 導航至會員中心
      navigate('/memberCenter', { replace: true }); 
    }
    else if (manager){
      navigate('/backStage', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginStatue]);

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
            Login
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name='email' onChange={handleInputChange} />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>密碼</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} name='password' onChange={handleInputChange} />
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
                onClick={handleLogin} >
                登入
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                建立新帳號? <Link color={'blue.400'} onClick={handleRegisterClick} >註冊</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
    </>
  )
}
