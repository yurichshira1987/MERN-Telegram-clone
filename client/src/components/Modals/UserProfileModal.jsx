import React from 'react'
import reduxActions from '../../Redux/actions'
import reduxState from '../../Redux/state'
import { connect } from 'react-redux'
import './modals.scss'



const UserProfileModal = ({logout, setShowCreateChannelModal, setShowUserModal,
    setShowCreateChatModal, setShowContactModal }) => {
    const showChannelModal = () => {
        setShowCreateChatModal(false)
        setShowUserModal(false)
        setShowCreateChannelModal(true)
    }
    const showChatModal = () => {
        setShowCreateChannelModal(false)
        setShowUserModal(false)
        setShowCreateChatModal(true)
    }
    const showContactsModal = () => {
        setShowContactModal(true)
        setShowUserModal(false)
    }
    return(
        <div className='userModal'>
            <div className='userModalItem'>Профиль</div>
            <div className='userModalItem'>Настройки</div>
            <div className='userModalItem' onClick={showContactsModal}>Мои контакты</div>
            <div className='userModalItem' onClick={showChannelModal}>Создать сообщество</div>
            <div className='userModalItem' onClick={showChatModal}>Создать чат</div>
            <div className='userModalItem' onClick={logout}>Выйти</div>
        </div>
    )
}

export default connect(reduxState, reduxActions)(UserProfileModal)