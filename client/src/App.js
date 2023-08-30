import React ,{useEffect, useState} from 'react'


function App() {
  
  const [backendData, setBackendData] = useState([{}])

  useEffect( ()=>{
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
          <>
            <p>{user.username}</p>
            <p>{user.address}</p>
            <p>{user.password}</p>
            <p>{user.email}</p>
            <p>{user.phone}</p>
          </>
        ))
        
      }
    </div>
  );
}

export default App;
