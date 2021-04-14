import React, {useState} from 'react';
import './telegram.css';
import Sidebar from './sidebar';
import Thread from './thread';

const Telegram = ()=>{
    const [drawer, setDrawer] = useState(true);
    return (
        <div className="telegram">
            <Sidebar sideDrawer={drawer} toggleDrawer={setDrawer} />
            <Thread toggleDrawer={setDrawer} />
        </div>
    )
}

export default Telegram;
