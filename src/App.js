import React, {useEffect} from 'react';
import Telegram from './components/telegram';
import Login from './components/login';
import './App.css';
import {auth} from './firebase';
import { useSelector, useDispatch } from 'react-redux';
import {selectUser, login, logout} from './features/user/userSlice';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(()=>{
    auth.onAuthStateChanged(authUser=>{
      if(authUser){
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          email: authUser.email,
          displayName: authUser.displayName
        }));
      } else{
        dispatch(logout());
      }
    })
  },[dispatch]);

  return (
    <div className="App">
      {
        !user ? <Login /> : <Telegram />
      }
    </div>
  );
}

export default App;
