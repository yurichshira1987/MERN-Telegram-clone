import React, { useState, useEffect } from 'react'
import { EllipsisOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons';
import ChatInput from '../../components/ChatInput/ChatInput'
import { connect } from 'react-redux'
import FindModal from '../../components/Modals/FindModal.jsx';
import reduxActions from '../../Redux/actions'
import reduxState from '../../Redux/state'
import DialogsContainer from '../../components/DialogsContainer/DialogsContainer.jsx'
import MessagesContainer from '../../components/MessagesContainer/MessagesContainer.jsx';
import './home.scss'
import { Avatar } from '../../components/Avatar/Avatar'
import { useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns';
import ruLocale from "date-fns/locale/ru"
import ShowCurrentFile from '../../components/ShowCurrentFile/ShowCurrentFile.jsx'
import socket from '../../utils/socket'
import UserProfileModal from '../../components/Modals/UserProfileModal.jsx'
import CreateModal from '../../components/Modals/CreateModal.jsx';
import EllipsisModal from '../../components/Modals/EllipsisModal';
import ContactsModal from '../../components/Modals/ContactsModal';

const Home = (props) => {
    const { currentDialogId, statusInfo, setShowEmoji, getDialogs, setDialogsLoading,
        getMessages, findDialogOnClientValue, setFindDialogOnClientValue, setCurrentDialogInfo,
        setMessagesLoading, userInit, showFindModal, setShowFindModal, messages,
        dialogs, setDialogId, setMessages, showEmoji, removeFiles, setCurrentFileId,
        setShowFileModal, showFileModal, showCreateChatModal, showCreateChannelModal,
        setShowCreateChannelModal, setShowCreateChatModal, showUserModal, setShowUserModal,
        currentDialogInfo, showContactModal, setShowContactModal, setShowAddedIcon, setDialogs,
         usersOnline,
   
    } = props

    const [showEllipsisModal, setShowEllipsisModal] = useState(false)
    const [prevDialog, setPrevDialog] = useState([])
    var parramsDialogId = useParams().dialogId

    const closeModals = () => {
        setShowEmoji(false)
        setShowFindModal(false)
        setShowEllipsisModal(false)
        setShowUserModal(false)
        setShowCreateChannelModal(false)
        setShowCreateChatModal(false)
        setShowContactModal(false)
        setShowAddedIcon(false)
        removeFiles([])
    }

    const getStatusOnRightBlockHeader = () => {
        const dialog = dialogs.filter(item => item.dialog._id === currentDialogId)[0]
        if (dialog) setCurrentDialogInfo(dialog)
    }

    const getDialogsByUserId = () => {
        setDialogsLoading(true)
        getDialogs()
    }
    const readMessageOnDialog = () => {
        let cloneDialogs = [...dialogs]
        let findIndexDialog = cloneDialogs.findIndex(item => item.dialog._id === currentDialogId)
        if(findIndexDialog >=0 && cloneDialogs[findIndexDialog].unReaded !== 0){
            cloneDialogs[findIndexDialog].unReaded = 0
            setDialogs(cloneDialogs)
        }
    }
    const getMessageByDialogId = () => {
        if (currentDialogId) {
            setMessagesLoading(true)
            getMessages()
        }
    }
    const fetchCurrentFileId = () => {
        if (window.location.search) {
            var currFile = window.location.search.split('=')[1]
            setCurrentFileId(currFile)
            setShowFileModal(true)
        } else {
            setShowFileModal(false)
            setCurrentFileId(null)
        }
    }
    const joinToAllDialog = () => {
        if(dialogs.length){
            for(let i = 0; i < dialogs.length; i++){
                let allDialogs = 'allDialogs'+dialogs[i].dialog._id
                socket.emit('join_to_all_dialog', allDialogs)
            }
        }
    }
    useEffect(() => {
        if (userInit){
            socket.emit('join_user_id', userInit.id)
        }
    }, [userInit])

    useEffect(() => {
        getDialogsByUserId()
        window.addEventListener('keydown', e => {
            if (e.keyCode === 27) closeModals()
        })
    }, [])

    useEffect(() => {
        getStatusOnRightBlockHeader()
        joinToAllDialog()
    }, [dialogs.length, dialogs])

    useEffect(()=>{
        readMessageOnDialog()
    }, [messages.length])

    useEffect(() => {
        getStatusOnRightBlockHeader()
        getMessageByDialogId()
        if (currentDialogId) {
            let dialogRoom = 'room'+currentDialogId
            socket.emit('join_to_dialog', dialogRoom)
            prevDialog.push(currentDialogId)
            setPrevDialog(prevDialog)
        }
    }, [currentDialogId])

    useEffect(() => {
        if (prevDialog.length >= 2) {
            socket.emit('leave_to_dialog', 'room'+prevDialog[prevDialog.length - 2])
        }
    }, [prevDialog.length])

    useEffect(() => {
        if (parramsDialogId) {
            setDialogId(parramsDialogId)
        } else {
            setMessages([])
            setDialogId(null)
            setCurrentDialogInfo('')
        }
    }, [parramsDialogId])

    useEffect(() => {
        fetchCurrentFileId()
    }, [window.location.search])

    return (
        <div className='home'>
            <div className="chat">
                {showFileModal && <ShowCurrentFile />}
                <div className="findModalWrapper"> {showFindModal && <FindModal />} </div>
                <div className="userModalWrapper">{showUserModal && <UserProfileModal />}</div>
                <div className="modalWrapper">
                    {showCreateChannelModal &&
                        <CreateModal placeholder={'сообщества'} cancel={() => setShowCreateChannelModal(false)} />
                    }
                </div>
                <div className="modalWrapper">
                    {showCreateChatModal &&
                        <CreateModal placeholder={'чата'} cancel={() => setShowCreateChatModal(false)} />
                    }
                </div>
                    { showContactModal &&<ContactsModal /> }


                <div className="leftBlock" onMouseOver={() => showEmoji && setShowEmoji(false)}>
                    <div className="leftBlockHeader">
                        <div className='findIconModalWrapper' onClick={() => setShowFindModal(!showFindModal)}>
                            <SearchOutlined />
                        </div>
                        <div className='leftBlockHeaderRight' onClick={() => setShowUserModal(!showUserModal)} >
                            <div className='userName'> {userInit && userInit.name}</div>
                            {userInit && Avatar(userInit.avatar, userInit.name)}
                            <div className='iconAvatar'>< DownOutlined /></div>

                        </div>
                    </div>
                    <div className='usersOnline'><span className='usersOnlineItem'></span>Сейчас на сайте: <span className='usersOnlineNumber'>{usersOnline}</span></div>
                    <div className="leftBlockSearch">
                        <input
                            placeholder='Поиск среди контактов'
                            type="text"
                            onChange={e => setFindDialogOnClientValue(e.target.value)}
                            value={findDialogOnClientValue}
                        />
                        <SearchOutlined />
                    </div>
                    <DialogsContainer />
                </div>

                <div className='rightBlock'>
                    <div className="rightBlockHeader">

                        <Status statusInfo={statusInfo} currentDialogInfo={currentDialogInfo} />
                        <div className="ellipsisWrapper">
                            <div className="ellipsis" onClick={() => setShowEllipsisModal(!showEllipsisModal)}>
                                {currentDialogId && <EllipsisOutlined />}
                                {showEllipsisModal && <EllipsisModal />}
                            </div>
                        </div>
                    </div>
                    <div className="backgroundWrapper" >
                        <MessagesContainer />
                        <ChatInput />
                    </div>
                </div>
            </div>
        </div>
    )
}


const Status = ({ currentDialogInfo }) => {
    return (
        <div className="status" >
            <div className="statusName">
                {currentDialogInfo && currentDialogInfo.dialog.privateChat ?
                    currentDialogInfo.partner.name
                    : currentDialogInfo && currentDialogInfo.dialog &&
                    currentDialogInfo.dialog.dialogName
                }
            </div>
            <div className="online">
                {currentDialogInfo && currentDialogInfo.dialog.privateChat && currentDialogInfo.partner.isOnline ?
                    <div>
                        <span className="itemOnline"></span>
                        <span>онлайн</span>
                    </div>
                    : currentDialogInfo && currentDialogInfo.dialog.privateChat && !currentDialogInfo.partner.isOnline ?
                        <div className="datePartnerLastSeen">Был(а) {formatDistanceToNow(new Date(currentDialogInfo.partner.last_seen), { addSuffix: true, locale: ruLocale })}</div>
                        : currentDialogInfo && currentDialogInfo.dialog.chat &&
                        <div className="datePartnerLastSeen"><strong>{currentDialogInfo.dialog.dialogFollowers}</strong> участников</div>
                }

            </div>
        </div>
    )
}


export default connect(reduxState, reduxActions)(Home)