import React ,{ useState } from 'react'
import { Box, Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Stack } from '@chakra-ui/react'
import { decrypt } from '../util/utils'
import { Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from 'react-icons/bs'
import Pages from "../components/pagination";

// 所有用戶資料頁面
export default function UserInfo() {
  
  // 資料狀態
  const [userData, setUserData] = useState([]);

  const fetchUserData = async(currentPage, pageSize, offset)=>{
    try{
        const response = await fetch(`/api/user/index?currentPage=${currentPage}&pageSize=${pageSize}`)
        if (!response.ok) { 
            throw new Error('Network response was not ok');
        }
        const user_data = await response.json();
        setUserData(user_data['data']);
        return user_data
    }
    catch(error){
        console.error('Error fetching data:', error);
    }
  }
  
  return (
    <div>
      <Box fontSize={'20px'} fontWeight={'700'} marginBottom={'50px'} align='center'> 用戶管理 </Box>
            <Table variant="simple" align="center" w={'100%'}>
                <Thead>
                    <Tr my=".8rem" pl="0px">
                        <Th pl="0px" color="gray.500">
                            用戶名稱
                        </Th>
                        <Th color="gray.500">用戶地址</Th>
                        <Th color="gray.500">密碼</Th>
                        <Th color="gray.500">(加密)密碼</Th>
                        <Th color="gray.500">Email</Th>
                        <Th color="gray.500">電話</Th>
                        <Th>操作</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {userData?.map((user, i) => {
                        return (
                        <Tr key={i}>
                            <Td>{user.username}</Td>
                            <Td>{user.address}</Td>
                            <Td>{decrypt(user.password)}</Td>
                            <Td>{user.password}</Td>
                            <Td>{user.email}</Td>
                            <Td>{user.phone}</Td>
                            <Td>
                            <Popover placement="bottom" isLazy>
                              <PopoverTrigger>
                                <IconButton 
                              backgroundColor={"white"} 
                              icon={<BsThreeDotsVertical/>}
                              w={"fit-content"}
                              borderRadius={'5px'} />
                              </PopoverTrigger>
                              <PopoverContent w="fit-content" _focus={{ boxShadow: 'none' }}>
                                <PopoverArrow />
                                <PopoverBody>
                                  <Stack>
                                    <Button
                                      w="194px"
                                      variant="ghost"
                                      justifyContent="space-between"
                                      fontWeight="normal"
                                      fontSize="sm"
                                      colorScheme="green">
                                      編輯
                                    </Button>
                                    <Button
                                      w="194px"
                                      variant="ghost"
                                      justifyContent="space-between"
                                      fontWeight="normal"
                                      colorScheme="red"
                                      fontSize="sm">
                                      停權
                                    </Button>
                                    <Button
                                      w="194px"
                                      variant="ghost"
                                      justifyContent="space-between"
                                      fontWeight="normal"
                                      colorScheme="orange"
                                      fontSize="sm">
                                      註銷
                                    </Button>
                                  </Stack>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                            </Td>
                        </Tr>
                        )
                    })}
                </Tbody>
            </Table>
            <Pages fetchdata={fetchUserData} />
    </div>
  );
}
