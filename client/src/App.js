import React from 'react';
import { ChakraProvider, } from '@chakra-ui/react';
import Home from './views/home';
import SignUp from './views/signUp';
import Login from './views/login';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import MemberCenter from './views/memberCenter';
import BackStage from './views/backStage';

// 導入客製化Button
import {extendTheme} from '@chakra-ui/react'
import { buttonTheme } from './components/buttonTheme';

const theme = extendTheme({
    components: {
      Button: buttonTheme,
    }
  });

function App() {

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/memberCenter' element={<MemberCenter/>}/>
          <Route path='/backStage' element={<BackStage/>}/>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
