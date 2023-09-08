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

  // 註冊訊息提醒
  const toast = useToast()

  // 按鍵處理
  const navigate = useNavigate();
  const handleLoginClick = () => {
      navigate('/login', { replace: true }); 
  };

  // 點擊註冊後，進行註冊的api處理，並設置註冊狀態signUpStatus
  const handleSignUp = async () => {
    // 發起異步請求註冊用戶
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
        console.error('用戶註冊錯誤:', error);
        setSignUpStatus(false);
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
            <FormControl id="username">
                <FormLabel>姓名</FormLabel>
                <Input type="text" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            </FormControl>
            </Box>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </FormControl>
            <FormControl id="phone" isRequired>
              <FormLabel>電話</FormLabel>
              <Input type="tel" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </FormControl>
            <FormControl id="address" isRequired>
              <FormLabel>地址</FormLabel>
              <Input type="text" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>密碼</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} onChange={(e) => setFormData({ ...formData, password: encrypt(e.target.value) })} />
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