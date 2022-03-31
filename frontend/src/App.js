import './App.scss';
import Navbar from './components/Navbar';
import Router from './Router';
import 'antd/dist/antd.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setUserAdd } from './actions';

function App() {
  const [currentPath, setCurrentPath] = useState()
  const location = useLocation();
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.spoto.userAdd);
  useEffect(() => {
    console.log(location.pathname);
    let userAccAdd = localStorage.getItem("userAddresss")
    dispatch(setUserAdd(userAccAdd))
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
