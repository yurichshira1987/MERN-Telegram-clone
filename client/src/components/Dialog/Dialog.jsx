import React, { useState } from 'react'
import './dialog.scss'
import { CommentOutlined, SoundOutlined } from '@ant-design/icons';
import { isToday, format } from 'date-fns/'
import { Avatar } from '../Avatar/Avatar'
import { connect } from 'react-redux'
import reduxActions from '../../Redux/actions'
import reduxState from '../../Redux/state'
import { NavLink } from 'react-router-dom'
import socket from '../../utils/socket'


const Dialog = ({ currentDialogId, avatar, username, date, lastMessage, online, unReaded, id,
    chat, channel, privateChat }) => {
    const [dialogTyping, setDialogTyping] = useState(null)

    socket.on("server_dialogs_typing_start", (data) => {
        if(data.currentDialogId === id && !dialogTyping){
            setDialogTyping(data)
            // console.log('тайпинг диалог ' + id )
        }
    });
    socket.on("server_dialogs_typing_stop", () => {
        if(dialogTyping){
            setDialogTyping(null)
            // console.log('стоп тайпинг диалог ' + id)
        }
    });

    const getDate = (date) => {
        if (isToday(date))
            return format(date, 'H:mm')
        else
            return format(date, 'dd.MM.yy')
    }

    const getIcon = (chat, channel, privateChat) => {
        if (chat) return <CommentOutlined />
        if (channel) return <SoundOutlined />
        if (privateChat) return null
        // <TeamOutlined />
    }

    return (
        <NavLink to={`/dialog/${id}`}>
            <div className={"dialog " + (currentDialogId === id && "selected")}>
                <div className="dialogAvatar">
                    {Avatar(avatar, username)}
                </div>

                <div className="dialogInfo">
                    <div className="dialodialogInfoTop">
                        <span className="dialodialogInfoTopLeft">
                            <span>{getIcon(chat, channel, privateChat)}</span>
                            <span className="userName">{username}</span>
                        </span>
                        {date &&
                            <span className='date'>{getDate(new Date(date))}</span>
                        }
                    </div>
                    <div className="dialodialogInfoBottom">
                        {dialogTyping ?
                            <div className='lastMessage'><DialogTyping />{dialogTyping.userInit.name}: печатает...</div>
                            :
                            <div className='lastMessage'>{lastMessage}</div>
                        }
                        {unReaded !== 0 ? <span> <span className='unReaded'>{unReaded}</span> </span> : null}
                    </div>
                </div>
                {online && <div className='online'></div>}
            </div>
        </NavLink>
    )
}

const DialogTyping = () => {
    return (
        <div className='dialogTyping'>
            <div className='dialogTypingItemWrapper'>
                <div className='dialogTypingItem one'></div>
                <div className='dialogTypingItem two'></div>
                <div className='dialogTypingItem three'></div>
            </div>
        </div>
    )
}

export default connect(reduxState(), reduxActions)(Dialog)