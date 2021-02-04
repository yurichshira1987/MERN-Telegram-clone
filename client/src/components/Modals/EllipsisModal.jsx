import React from 'react'
// import config from '../../utils/config.json'
// import axios from 'axios'
import { connect } from 'react-redux'
import reduxActions from '../../Redux/actions'
import reduxState from '../../Redux/state'

const CreateModal = ({ currentDialogInfo, userInit, setShowContactModal, setShowAddedIcon }) => {

    const showContactModalForAdd = () => {
        setShowContactModal(true)
        setShowAddedIcon(true)
    }

    return (
        <>
            {currentDialogInfo.dialog.privateChat ?
                <div className='ellipsisModal generalModal'>
                    <div className='ellipsisModalItem' onClick={() => console.log('asdasds')}>Показать профиль</div>
                    <div className='ellipsisModalItem'>Добавить в контакт</div>
                    <div className='ellipsisModalItem'>Выйти из диалога </div>
                    <div className='ellipsisModalItem'>Заблокировать</div>
                </div >
                : currentDialogInfo.dialog.chat ?
                    <div className='ellipsisModal generalModal'>
                        {currentDialogInfo.dialog.owner === userInit.id ?
                            <div className='ellipsisModalItem' onClick={() => console.log(currentDialogInfo.colorName)}>Удалить чат</div>
                            :
                            <div className='ellipsisModalItem' onClick={() => console.log('asdasds')}>Покинуть чат</div>
                        }
                        {currentDialogInfo.dialog.owner === userInit.id &&
                            <div className='ellipsisModalItem' onClick={showContactModalForAdd}>Добавить пользователей</div>
                        }
                        {!currentDialogInfo.dialog.owner === userInit.id &&
                            <div className='ellipsisModalItem'>Пожаловаться</div>
                        }
                        {currentDialogInfo.dialog.owner === userInit.id &&
                            <div className='ellipsisModalItem'>Управление группой</div>
                        }
                        <div className='ellipsisModalItem'>Отключить уведомления</div>
                        <div className='ellipsisModalItem'>Описание чата</div>
                    </div > :
                    <div className='ellipsisModal generalModal'>
                        <div className='ellipsisModalItem' onClick={() => console.log('asdasds')}>Покинуть канал</div>
                        <div className='ellipsisModalItem'>Добавить пользователей</div>
                        <div className='ellipsisModalItem'>Пожаловаться</div>
                        <div className='ellipsisModalItem'>Отключить уведомления</div>
                        <div className='ellipsisModalItem'>Описание канала</div>
                    </div >}
        </>
    )
}





export default connect(reduxState, reduxActions)(CreateModal)