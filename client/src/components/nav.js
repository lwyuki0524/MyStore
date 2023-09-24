import {Box,Flex,Text,IconButton,Button,Stack,Collapse,Icon,Popover,
    PopoverTrigger,PopoverContent,useColorModeValue,useBreakpointValue,useDisclosure,} from '@chakra-ui/react'
import {HamburgerIcon,CloseIcon,ChevronDownIcon,ChevronRightIcon,} from '@chakra-ui/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import {getCookie, deleteAllCookies} from '../util/utils';

export default function Nav() {
  // 取得cookie
  const userID = getCookie('userID');
  const manager = getCookie('manager');

  const { isOpen, onToggle } = useDisclosure()
  const location = useLocation(); // 取得目前路徑
  const navigate = useNavigate(); // 導航至其他頁面

  // 點擊註冊按鈕，導航到註冊頁面
  const handleRegisterClick = () => {
    if (location.pathname==='/login'){
      navigate('/signup', { replace: true });
    }
    else{
      navigate('/signup');
    }
  };

  // 點擊登入按紐，導航到登入頁面
  const handleLoginClick = () => {
    if (location.pathname==='/signup'){
      navigate('/login', { replace: true });
    }
    else{
      navigate('/login');
    }
  };

  // 點擊登出按鈕，清除cookie，並導航到首頁
  const handleLogoutClick =() => {
    deleteAllCookies();
    navigate('/', { replace: true });
  }

  return (
    <Box >
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} ml='50px'>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}>
              <a href='/'>
                MyStore
              </a>
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav cookies_u={userID} cookies_m={manager} />
          </Flex>
        </Flex>

        <div>
        { 
        // 若cookie取得了userID 或 manager，顯示登出按紐；否則顯示登入和註冊按紐。 
        (userID || manager ) ? (
          <Box>
            <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'} onClick={handleLogoutClick} >
              Logout
            </Button>
          </Box>
          ):(
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={'flex-end'}
              direction={'row'}
              spacing={6}>
              <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'} onClick={handleLoginClick} >
                Login
              </Button>
                <Button
                  onClick={handleRegisterClick}
                  as={'a'}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'pink.400'}
                  _hover={{
                    bg: 'pink.300',
                  }}>
                  Sign Up
                </Button>
            </Stack>
          )
        }
        </div>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  )
}

const DesktopNav = (cookies) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')
  
  const handleNavClick = () => {
    // 從nav點擊後台時，將page設定為預設值
    sessionStorage.setItem('page', '#');
  }

  return (
    <Stack direction={'row'} spacing={4}>
      {
        NAV_ITEMS.map((navItem) => (
        ( ( 
            // 一般使用者(未登入狀態下)
            (!navItem.identity) || 
            // 登入的管理員 => 要顯示管理後台
            (cookies.cookies_m && (navItem.identity !== 'user')) || 
            // 登入後的用戶 => 要顯示會員中心
            (cookies.cookies_u && (navItem.identity!=='manager')) 
          ) &&
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box
                as="a"
                p={2}
                href={navItem.href ?? '#'}
                onClick={handleNavClick}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
        )
      ))}
    </Stack>
  )
}

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Box
      as="a"
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  )
}

const MobileNav = () => {
  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}>
        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Box as="a" key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

const NAV_ITEMS = [
  {
    label: '產品總表',
    children: [
      {
        label: '分類一',
        subLabel: '包包、娃娃...',
        href: '#',
      },
      {
        label: '分類二',
        subLabel: '3C產品、家電...',
        href: '#',
      },
    ],
  },
  {
    label: '會員中心',
    href: '/memberCenter',
    identity:'user'
  },
  {
    label: '管理後台',
    href: '/backStage',
    identity:'manager'
  },
]
