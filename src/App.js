import './App.scss';
import Navbar from './components/Navbar';
import Router from './Router';
import 'antd/dist/antd.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

function App() {
  const [currentPath, setCurrentPath] = useState()
  const location = useLocation();
  useEffect(() => {
    console.log(location.pathname);
    setCurrentPath(location.pathname)

  }, [])

  return (
    <>
      {/* {(currentPath === '/') ? "" :
        <Navbar />} */}
      {/* <Navbar /> */}
      <Router />
    </>
  );
}

export default App;
