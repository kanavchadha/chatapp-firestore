import React, { useState,useEffect } from 'react';
import './sidebarThreads.css';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch } from 'react-redux';
import {setThread} from '../features/thread/threadSlice';
import db from '../firebase';

const SidebarThreads = (props)=>{
    const [threadInfo, setThreadInfo] = useState();
    const dispatch = useDispatch();

    useEffect(()=>{
        db.collection('threads').doc(props.id).collection('messages').orderBy('timeStamp','desc')
        .onSnapshot(snapshot => setThreadInfo(snapshot.docs.map(doc => doc.data())));
    },[props.id]);
    
    const openThread = ()=>{
        dispatch(setThread({threadId: props.id, threadName: props.displayName, threadAvatar: props.threadAvatar}));
        props.toggleDrawer(prevState => !prevState);
    }

    return(
        <div className="sidebarThreads" onClick={openThread}>
            <Avatar src={props.threadAvatar}/>
            <div className="sbThreads__details">
                <div> {props.displayName} </div>
                <div>{threadInfo && threadInfo[0]?.message}</div>
                <small>{ new Date(threadInfo && threadInfo[0]?.timeStamp?.toDate()).toLocaleString() }</small>
            </div>
        </div>
    )
}

export default SidebarThreads;