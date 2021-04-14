import React from 'react';
import './login.css';
import {auth, provider} from '../firebase';
import { Button } from '@material-ui/core';

const Login = ()=>{
    const signin = ()=>{
        auth.signInWithPopup(provider).catch(err=>{
            alert(err.message);
        });
    }
    return (
        <div className="login"> 
            <div className="login__telegram"> 
                <img src="https://pngimg.com/uploads/telegram/telegram_PNG19.png" alt="user pic"/>
                <h1>Welcom To Telegram</h1>
            <Button onClick={signin}>SignIn with Google</Button>
            </div>
        </div>
    )
}

export default Login;