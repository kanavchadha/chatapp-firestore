import React, { useEffect, useState } from 'react';
import './sidebar.css';
import SidebarThreads from './sidebarThreads';
import db, { auth } from '../firebase';
import SearchIcon from '@material-ui/icons/Search';
import BorderColorOutlined from '@material-ui/icons/BorderColorOutlined';
import { Avatar, IconButton, Tooltip } from '@material-ui/core';
import { PhoneOutlined, QuestionAnswerOutlined, Settings } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/user/userSlice';

const Sidebar = (props) => {
    const user = useSelector(selectUser);
    const [threads, setThreads] = useState([]);
    const [searchThreads, setSearchThreads] = useState([]);

    useEffect(() => {
        db.collection('threads').onSnapshot(snapshot => {
            setThreads(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
            setSearchThreads(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })));
        })
    }, []);

    const addThread = () => {
        const threadName = prompt('Enter a Thread Name: ');
        const threadAvatar = prompt('Enter a Thread Avatar URL: ');
        if (threadName) {
            db.collection('threads').add({
                threadName: threadName,
                threadAvatar: threadAvatar
            });
        }
    }

    const searchedThread = (event, value) => {
        const newThreads = searchThreads.filter(th => th.data.threadName === value);
        // console.log(newThreads);
        setThreads(newThreads);
    }
    const showAllThreads = () => {
        setThreads(searchThreads);
    }

    const sidebarClasses = props.sideDrawer ? " toggleDrawer" : "";

    return (
        <div className={"sidebar" + sidebarClasses}>
            <div className="sidebar__header">
                <div className="sidebar__search">
                    <SearchIcon />
                    {/* <input type="text" placeholder="search here..." /> */}
                    {searchThreads &&
                        <Autocomplete
                            onChange={searchedThread}
                            freeSolo
                            id="free-solo-2-demo"
                            disableClearable
                            fullWidth
                            options={searchThreads.map((thread) => thread.data.threadName)}
                            onInputChange={showAllThreads}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    color="secondary"
                                    variant="outlined"
                                    label="Search"
                                    InputProps={{ ...params.InputProps, type: 'search' }}
                                    id="search"
                                />
                            )}
                        />}
                </div>
                <IconButton variant="outlined" id="sidebar__button" onClick={addThread}>
                    <BorderColorOutlined />
                </IconButton>
            </div>
            <div className="sidebar__threads">
                {
                    threads.map(({ id, data: { threadName, threadAvatar } }) =>
                        <SidebarThreads key={id} id={id} displayName={threadName} threadAvatar={threadAvatar} toggleDrawer={props.toggleDrawer} />
                    )
                }

            </div>
            <div className="sidebar__bottom">
                <Tooltip title="Logout" arrow>
                    <Avatar src={user.photo} className="user_avatar" onClick={() => auth.signOut()} />
                </Tooltip>
                <IconButton>
                    <PhoneOutlined />
                </IconButton>
                <IconButton onClick={() => { props.toggleDrawer(prevState => !prevState) }}>
                    <QuestionAnswerOutlined />
                </IconButton>
                <IconButton>
                    <Settings />
                </IconButton>
            </div>
        </div>
    )
}

export default Sidebar;
