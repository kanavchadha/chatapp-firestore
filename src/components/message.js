import React, {forwardRef} from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/user/userSlice';
import './message.css';
import ReactEmoji from 'react-emoji';
import { Avatar } from '@material-ui/core';

var urlRegex = /(https?:\/\/[^\s]+)/g;

const Message = forwardRef(({id, data: {timeStamp,displayName,email,message,photo,uid}},ref)=>{
    const user = useSelector(selectUser);
    return (
        <div className={`message ${user.email === email && 'message__sender'}`} ref={ref}>
            <Avatar className="message__photo" src={photo}/>
            <div className="message__content">
                <p>
                    {
                        message.match(urlRegex) ? message.match(urlRegex).map(url => <a target="_blank" rel="noopener noreferrer" href={url}>{message}</a>) :
                        ReactEmoji.emojify(message)
                    }
                </p>
                <small> { new Date(timeStamp?.toDate()).toLocaleString() } </small>
            </div>
        </div>
    )
});

export default Message;