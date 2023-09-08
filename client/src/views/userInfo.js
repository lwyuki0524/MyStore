import React ,{useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { decrypt } from '../util/utils'

// 測試檢查用頁面
export default function UserInfo() {
  
  const [backendData, setBackendData] = useState([])

  useEffect( ()=>{ // 讀取所有用戶資料
    fetch("/api/user/index").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])
  
  return (
    <div>
      { 
        backendData.map((user, i)=>(
          <Box m='10px'>
            <p>{user.username}</p>
            <p>{user.address}</p>
            <p>{decrypt(user.password)}</p>
            <p>{user.password}</p>
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <hr borderColor='black'/>
          </Box>
        ))
      }
    </div>
  );
}
