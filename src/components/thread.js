import React, { useState, useEffect } from 'react';
import './thread.css';
import Message from './message';
import db from '../firebase';
import firebase from 'firebase';
import { useSelector } from 'react-redux'
import { selectThreadId, selectThreadName, selectThreadAvatar } from '../features/thread/threadSlice';
import { selectUser } from '../features/user/userSlice';

import FlipMove from 'react-flip-move';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { Avatar, IconButton, Tooltip } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import SendIcon from '@material-ui/icons/Send';
import TimerOutlinedIcon from '@material-ui/icons/TimerOutlined';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';

const Thread = (props) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [selfDestruct, setSelfDestruct] = useState(0);
    const [emojiKeyboard, setEmojiKeyBoard] = useState(false);

    const user = useSelector(selectUser);
    const threadName = useSelector(selectThreadName);
    const threadId = useSelector(selectThreadId);
    const threadAvatar = useSelector(selectThreadAvatar);

    const onEmojiClick = (e) => {
        console.log(e.native);
        setInput(`${input} ${e.native}`);
    };

    const handleTimeOut = (input, uid) => {
        if (selfDestruct !== null && selfDestruct !== 0 && selfDestruct !== '') {
            setTimeout(() => {
                startTimeOut(input, uid)
            }, selfDestruct * 1000);
        }
    }

    const startTimeOut = (input, uid) => {
        console.log("self destructiomn started!");
        db.collection('threads').doc(threadId).collection('messages')
            .where('message', '==', input).where('uid', '==', uid).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    doc.ref.delete().then(() => {
                        console.log('Message Deleted Successfully!');
                    }).catch(err => {
                        console.log('self-destruction failed! ', err);
                        alert(err.message);
                    })
                })
            })
    }

    const sendMessage = (event) => {
        event.preventDefault();
        handleTimeOut(input, user.uid);
        db.collection('threads').doc(threadId).collection('messages').add({
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            uid: user.uid,
            photo: user.photo,
            email: user.email,
            displayName: user.displayName
        });
        setInput('');
        setSelfDestruct(0);
    }

    const sendCurrLocation = () => {
        if (!navigator.geolocation) {
            return alert("GeoLocation is not supported by your Browser!");
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const location = { lattitude: position.coords.latitude, longitude: position.coords.longitude }
            const myLoc = 'https://google.com/maps?q=' + location.lattitude + ',' + location.longitude;
            console.log("Location Shared..", myLoc);
            setInput(myLoc);
        })
    }

    useEffect(() => {
        if (threadId) {
            db.collection('threads').doc(threadId).collection('messages').orderBy('timeStamp', 'desc').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                })))
            })
        }
    }, [threadId])

    return (
        <div className="thread">
            <div className="thread__header">
                <div className="thread__head__cont">
                    <Avatar src={threadAvatar} />
                    <div className="threadName">
                        <span>{threadName}</span> <br />
                        {threadId && <small>Last seen</small>}
                    </div>
                </div>
                <IconButton id="sidebar__button" onClick={() => { props.toggleDrawer(prevState => !prevState) }}>
                    <Tooltip title="Open Chats" arrow>
                        <MoreHoriz fontSize="large" />
                    </Tooltip>
                </IconButton>
            </div>

            <div className="thread__messages">
                <FlipMove>
                    {
                        messages.map(msg => <Message key={msg.id} id={msg.uid} data={msg.data} />)
                    }
                </FlipMove>
            </div>
            <div className="thread__input">
                {emojiKeyboard && <Picker style={{ position: 'absolute', bottom: '58px', left: '2px', boxShadow: '0 15px 20px rgba(0,0,0,0.5)' }} onSelect={onEmojiClick} />}
                
                <form onSubmit={sendMessage}>
                    <IconButton onClick={() => { setEmojiKeyBoard(prevState => !prevState) }} disabled={!threadId?true:false}>
                        <EmojiEmotionsIcon style={{ color: 'white' }} />
                    </IconButton>

                    <input type="text" placeholder="Type message here..." value={input} onChange={(e) => setInput(e.target.value)} disabled={!threadId ? 'disabled': false}/>

                    <IconButton onClick={sendMessage} disabled={!threadId?true:false}><SendIcon /></IconButton>
                    <IconButton onClick={() => {
                        setSelfDestruct(Number(prompt('Enter delay in seconds after which the message will Self-Destruct.')))
                    }} disabled={!threadId?true:false}>
                        <Tooltip title="Set Auto Delete Message" arrow>
                            <TimerOutlinedIcon />
                        </Tooltip>
                    </IconButton>
                    <IconButton onClick={sendCurrLocation} disabled={!threadId?true:false}>
                        <Tooltip title="Send Location" arrow>
                            <PersonPinCircleIcon />
                        </Tooltip>
                    </IconButton>

                </form>
            </div>

        </div>
    )
}

export default Thread;