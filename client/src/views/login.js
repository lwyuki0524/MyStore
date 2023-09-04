import { Flex, Box, FormControl, FormLabel, Input, InputGroup,
    InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import Nav from '../components/nav'
import { useNavigate } from 'react-router-dom'
import {getCookie} from '../util/utils';

export default function Login() {
  // 表單相關
  const [showPassword, setShowPassword] = useState(false) // 是否顯示密碼的狀態設置
  const [formData, setFormData] = useState({ email: '', password: '' }); // 表單資料狀態
  const [loginStatue, setLoginStatue] = useState(null); //  登入狀態
  
  // 訊息提醒
  const toast = useToast()

  // 按鍵處理
  const navigate = useNavigate();
  const handleRegisterClick = () => {
      navigate('/signup', { replace: true });
  };

  // 點擊登入後，進行登入api處理，並設置登入狀態loginStatue
  const handleLogin = async () => {
    // 發起異步請求登入
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
          title: '用戶登入成功',
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

  // loginStatue 狀態改變時執行
  useEffect(() => {
    // 取得cookie
    const userID = getCookie('userID');
    if (userID) {
        // 導航至會員中心
        navigate('/memberCenter', { replace: true }); 
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
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
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
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Create a new user? <Link color={'blue.400'} onClick={handleRegisterClick} >Sign Up</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
    </>
  )
}
