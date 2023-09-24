import Nav from '../components/nav'
import { Box,  Stack, Flex, Text, Icon, useColorModeValue, Drawer, DrawerContent, useToast} from '@chakra-ui/react'
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import UserInfo from './userInfo'
import ProductInfo from './productInfo'
import { getCookie } from '../util/utils'
import { useNavigate } from 'react-router-dom'

export default function BackStage() {

    /* 設定子頁的狀態、儲存子頁至sessionStorage */
    const [showPage, setShowPage] = useState('');
    const page = sessionStorage.getItem('page'); // 需要記錄目前的子頁面，因為reload時要回到此子頁
    if(!page){
        sessionStorage.setItem('page', '#');
    }    
    /* 設定子頁的狀態、儲存子頁至sessionStorage */

    
    const graycolor = useColorModeValue('gray.100', 'gray.900') // 設定樣式
    const toast = useToast() // 彈跳訊息


    /* 若無登入管理員，導航至登入 */
    const navigate = useNavigate();
    const [managerData, setManagerData] = useState(null);
    
    // 第一次渲染時或 managerData 改變時執行
    useEffect(()=>{
        // 取得cookie，只有管理員登入了才能看到此頁面
        const manager = getCookie('manager');
        if(!manager){
            toast({
                title: '請登入',
                status: 'warning',
                isClosable: true,
              })
            setTimeout(() => {
                navigate('/login', { replace: true })
            }, 1000);
        }
        else{
            setManagerData(manager)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[managerData])
    /* 若無登入管理員，導航至登入 */


    useEffect(()=>{
        setShowPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[page])

    return(
        <>
            <Nav/>
            {managerData ? (
                <Stack direction={'row'}>
                    <Box minH="100vh" bg={graycolor}>
                        <SidebarContent display={'block'} 
                            getPage={(url)=>{
                                sessionStorage.setItem('page', url);
                                setShowPage(url)
                            }} />
                        <Drawer
                            placement="left"
                            returnFocusOnClose={false}
                            size="full">
                            <DrawerContent>
                            <SidebarContent />
                            </DrawerContent>
                        </Drawer>
                    </Box>
                    <Box  width='100%' padding={'2%'}>
                        { showPage ==='userInfo' && <UserInfo />}
                        { showPage ==='productInfo' && <ProductInfo />}
                        {/* 其他頁面 */}
                    </Box>
                </Stack>
            ):(
                <Box textAlign='center'>
                    無使用權限
                </Box>
            )}
            
        </>
    )
}

function SidebarContent({ getPage, ...rest }) {
    return (
        <Box
        bg={useColorModeValue('white', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        w={60} h="full" {...rest}>
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
            <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                管理後台
            </Text>
        </Flex>
        {LinkItems.map((link) => (
            // getPage: 將取得的page傳給父組件
            <NavItem key={link.name} icon={link.icon} onClick={()=>getPage(link.page)}>
            {link.name}
            </NavItem>
        ))}
        </Box>
    );
}

function NavItem({ icon, children, ...rest }) {
    return (
        <Box
        as="a" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
        <Flex align="center" p="4" mx="4" borderRadius="lg" role="group" cursor="pointer"
            _hover={{ bg: 'cyan.400', color: 'white', }} {...rest}>
            {icon && ( <Icon mr="4" fontSize="16" _groupHover={{ color: 'white', }} as={icon} /> )}
            {children}
        </Flex>
        </Box>
    );
}

const LinkItems = [
    { name: '管理員資訊', icon: FiHome, page:'#' },
    { name: '用戶管理', icon: FiTrendingUp, page:'userInfo' },
    { name: '商品管理', icon: FiCompass, page:'productInfo' },
    { name: '訂單管理', icon: FiStar, page:'#' },
    { name: '設定', icon: FiSettings, page:'#' },
]