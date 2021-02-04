import React, { useState } from "react";
import { useRef, useEffect } from "react";
import { connect } from "react-redux";
import reduxActions from '../../Redux/actions'
import reduxState from '../../Redux/state'
import { LoadingOutlined } from '@ant-design/icons';
import Message from '../Message/Message.jsx'
import './messagesContainer.scss'
import UploadFilesModal from '../UploadFiles/UploadFilesModal'
import socket from '../../utils/socket'




const MessagesContainer = ({ isLoadingMessage, userId, messages, setShowEmoji, showEmoji, showUploadFilesModal, chatInputText, 
    currentDialogId, userInit, files}) => {
    const refMessages = useRef()
    const [typingUserInit, setTypingUserInit] = useState(null)
    const [isTyping, setIsTyping] = useState(false)
    
    // const messageScrollPagination = () =>{
    //     refMessages.current.onscroll = () =>{
    //         console.log('Высотаа скрола ' + refMessages.current.scrollHeight)
    //         console.log('Скрол топ ' + refMessages.current.scrollTop)
    //         console.log('Скрол офсет ' + refMessages.current.offsetHeight)
    //         console.log('Ты заскролил меня')
    //     }
    // }
   
    useEffect(()=>{
        let data = { currentDialogId, userInit }
        if((chatInputText || files.length) && !isTyping ){
            socket.emit('client_typing_start', data)
        }
        if(!chatInputText && !files.length){
            socket.emit('client_typing_stop', data)
        }
    },[files.length , chatInputText])

    useEffect(()=>{
        socket.on('server_message_typing_start', data =>{
            setTypingUserInit(data)
            setIsTyping(true)
            refMessages.current.scrollTo(0, 999990)
        })
        socket.on('server_message_typing_stop', ()=>{
            setTypingUserInit(null)
            setIsTyping(false)
        })
    },[])

    useEffect(() => {
        refMessages.current.scrollTo(0, 999990)
    }, [messages.length])

    return (
        <div className="messagesWrapper" >
            <div ref={refMessages}
                className="messages"
                onMouseOver={() => showEmoji && setShowEmoji(false)}>
                {messages.length && !isLoadingMessage ?

                    messages.map((item, i) => (
                        <Message
                            key={i}
                            colorName={item.ownerId.colorName}
                            avatar={item.ownerId.avatar}
                            text={item.text}
                            date={item.date}
                            isMe={item.ownerId._id === userId}
                            readed={item.readed}
                            attachments={item.attachments}
                            audioSrc={item.audio}
                            userName={item.ownerId.name}
                            id={item._id}
                        />))
                    : isLoadingMessage ? <div className="isloading"> <LoadingOutlined /> </div>
                        : null
                }
                {isTyping &&
                    <Message
                        attachments={[]}
                        typing={true}
                        userName={typingUserInit ? typingUserInit.name :null}
                        avatar={typingUserInit ? typingUserInit.avatar :null}
                    />
                }
            </div>
            { showUploadFilesModal && <UploadFilesModal /> }
        </div>
    )
}

export default connect(reduxState, reduxActions)(MessagesContainer)
