import React, { useState } from 'react'
import './modals.scss'
import { Avatar } from '../Avatar/Avatar'
import { useEffect } from 'react'
import axios from 'axios'
import config from '../../utils/config.json'
import { formatDistanceToNow } from 'date-fns';
import ruLocale from "date-fns/locale/ru"
import { connect } from 'react-redux'
import reduxActions from '../../Redux/actions'
import reduxState from '../../Redux/state'
import { SearchOutlined, CloseOutlined, UserAddOutlined } from '@ant-design/icons';
import socket from '../../utils/socket'




const ContactModal = ({
     token, userInit, setShowContactModal, setContacts, contacts, setDialogId,
     showAddedIcon, setShowAddedIcon, currentDialogInfo
}) => {
    const [localInputValue, setLocalInputValue] = useState('')

    const addUserToGroup = async (partnerId) => {
        var data = { candidateId:partnerId, currentDialogInfo, userId:userInit._id }
        await axios.post(`${config.url}/add_user_to_dialog`, data, { 'headers': { 'Authorization': token } })
        .then(res => console.log(res))
    }

    const createDialog = async (partnerId) => {
        var data = { partnerId, userId: userInit, category: 'privateChat' }
        await axios.post(`${config.url}/create_dialog`, data, { 'headers': { 'Authorization': token } })
            .then(res =>  setDialogId(res.data) )
            setShowContactModal(false)
    }

    const findContact = (array) => {
        return array.filter(item => item.contact.name.toLowerCase().indexOf(localInputValue.toLowerCase()) >= 0 )       
    }

    const getContacts = async () => {
        await axios.get(`${config.url}/get_contacts?userId=${userInit._id}&limit=3&dialogId=${currentDialogInfo.dialog._id}&chat=${currentDialogInfo.dialog.chat}&channel=${currentDialogInfo.dialog.chat}`, { 'headers': { 'Authorization': token } })
        .then(res => setContacts(res.data))
    }

    const closeThisModal = () => {
        setShowContactModal(false)
        setShowAddedIcon(false)
    }
    socket.on('contacts_update', ()=>{
        getContacts() 
    })
    useEffect(() => {
        getContacts() 
    }, [])

    return (
        <div className='findsModalWrapper'>
            <div className='findsModal'>
                <div className='findModalLeft'>
                    <div className='findModalHeader'>
                        <CloseOutlined className='contactCloseIcon ' onClick={closeThisModal} />
                        <div className='title'>Контакты</div>
                    </div>
                    <div className='findModalContent contacts'>
                        {contacts && 
                            findContact(contacts).map((item, i) => (
                            <div className="findModalItem contactItem" key={item._id} > 
                                <div className="avatar">
                                    {Avatar(item.contact.avatar, item.contact.name)}
                                </div>
                                <div className="findModalIteminfo">
                                    <div>
                                        <span className='findModalItemName' onClick={createDialog.bind(this, item.contact._id)} >{item.contact.name}</span>
                                        { item.contact.isOnline ?
                                                <span className='findModalOnline'> Онлайн </span> :
                                                <span className='findModalOffline'> Был(а) {formatDistanceToNow(new Date(item.contact.last_seen), { addSuffix: true, locale: ruLocale })}</span>
                                        }
                                    </div>
                                   {showAddedIcon && !item.contact.signed && <div onClick={addUserToGroup.bind(this, item.contact._id)}><  UserAddOutlined /> </div> }
                                </div>
                            </div>
                        ))}
                    </div>
                    <input
                        onChange={e => setLocalInputValue(e.target.value)}
                        type="text"
                        placeholder='Введите запрос...' />
                    <SearchOutlined className='searchItem' />
                </div>
            </div>
        </div>
    )
}


export default connect(reduxState, reduxActions)(ContactModal)