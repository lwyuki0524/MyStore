import React ,{useEffect, useState} from 'react'
import {getCookie, deleteAllCookies} from '../util/utils';
import Nav from '../components/nav';
import { Card, CardBody, CardFooter, Box, Text, Input, Stack, useToast, Button, useDisclosure,
     AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter  } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function MemberCenter() {
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
            navigate('/login', { replace: true }); 
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
                <Text align ='center'>用戶中心</Text>
                {userData ? (
                    
                    <Card align="center">
                        <CardBody align="center">
                          <Stack  p="10px" direction="row" align="center">
                            <Stack align="center">
                                <Box p="10px" h="45px">Username:</Box>
                                <Box p="10px" h="45px">Password: </Box>
                                <Box p="10px" h="45px">Phone: </Box>
                                <Box p="10px" h="45px">Address:</Box>
                                <Box p="10px" h="45px">Email: </Box>
                            </Stack>
                            <Stack>
                              <Input value={userData.username} h="45px" maxW="100%" isReadOnly="true"/>
                              <Input value={userData.password} h="45px" maxW="100%" isReadOnly="true"/>
                              <Input value={userData.phone} h="45px" maxW="100%" isReadOnly="true"/>
                              <Input value={userData.address} h="45px" maxW="100%" isReadOnly="true"/> 
                              <Input value={userData.email} h="45px" maxW="100%" isReadOnly="true"/>
                            </Stack>
                          </Stack>
                        </CardBody>

                        <CardFooter align='center'>
                            <Button 
                                bg='gray.200' 
                                fontWeight="semibold" 
                                color='black' 
                                borderRadius='5'
                                mr='10px'
                                _hover={{
                                    transform: "scale(1.05, 1.05)",
                                    bg: `gray.300`,
                                    _dark: {
                                        bg: `gray.300`,
                                    },
                                }}
                                _active={{
                                    bg: `gray.500`,
                                    transform: "scale(1, 1)",
                            
                                    _dark: {
                                    bg: `gray.400`,
                                    }
                                }}>
                                    編輯帳戶資料
                            </Button>
                            <AlertDialogModel/>
                        </CardFooter>
                    </Card>
                ) : (
                  <Box align="center">
                    <p>請登入...</p>
                  </Box>
                )}
            </Box>
        </div>
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
                  刪除
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }