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
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import socket from '../../utils/socket'



const FindModal = ({
    users, setUsers, token, userId, setDialogId, setShowFindModal, userInit
}) => {
    const [selectFindCategory, setSelectFindCategory] = useState('Люди')
    const [selectCheckedGender, setSelectCheckedGender] = useState('Любой')

    const findUsers = async (value) => {
        await axios.get(`${config.url}/find_users?data=${value}`, { 'headers': { 'Authorization': token } })
            .then(res => { setUsers(res.data) })
    }
    const getUsers = async () => {
        await axios.get(`${config.url}/get_users?userId=${userId}&limit=6`, { 'headers': { 'Authorization': token } })
            .then(res => setUsers(res.data))
    }
    const createDialog = async partnerId => {
        var data = { partnerId, userId: userInit, category: 'privateChat' }
        await axios.post(`${config.url}/create_dialog`, data, { 'headers': { 'Authorization': token } })
            .then(res => { setDialogId(res.data) })
        setShowFindModal(false)
    }
    const createContact = async (partnerId) => {
        var data = { partnerId, userId: userInit._id }
        await axios.post(`${config.url}/create_contact`, data, { 'headers': { 'Authorization': token } })
    }
    const deleteContact = async (partnerId) => {
        await axios.delete(`${config.url}/delete_contact?userId=${userInit._id}&partnerId=${partnerId}`, { 'headers': { 'Authorization': token } })
    }
    useEffect(() => {
        getUsers()

        socket.on('server_delete_contact', () => {
            getUsers()
        })
        socket.on('server_create_contact', () => {
            getUsers()
        })
    }, [])


    return (
        <div className='findsModalWrapper'>
            <div className='findsModal'>
                <div className='findModalLeft'>
                    <div className='findModalHeader'>
                        <CloseOutlined className='closeIcon' onClick={() => setShowFindModal(false)} />
                        <div className='title'>{selectFindCategory}</div>
                    </div>
                    <div className='findModalContent'>
                        {users && users.map((item, i) => (
                            <div className="findModalItem" key={item._id}>
                                <div className="avatar">
                                    {Avatar(item.avatar, item.name)}
                                </div>
                                <div className="findModalIteminfo">
                                    <div>
                                        <span className="findModalItemName" onClick={createDialog.bind(this, item._id)}>{item.name}</span>
                                        {item.isOnline ?
                                            <span className='findModalOnline'> Онлайн </span> :
                                            <span className='findModalOffline' > Был(а) {formatDistanceToNow(new Date(item.last_seen), { addSuffix: true, locale: ruLocale })}</span>
                                        }
                                    </div>
                                    {!item.signed ?
                                        <div className='addContact' onClick={createContact.bind(this, item._id)}>Добавить в контакт</div>
                                        :
                                        <div className='addContact added' onClick={deleteContact.bind(this, item._id)}>Удалить из контакта</div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                    <input
                        onChange={e => findUsers(e.target.value)}
                        type="text"
                        placeholder='Введите запрос...' />
                    <SearchOutlined className='searchItem' />
                </div>
                <div className='findModalRight'>
                    <div className='findModalSelect'>
                        <div className={selectFindCategory === 'Люди' ? 'selected' : ''} onClick={() => setSelectFindCategory('Люди')}>Люди</div>
                        <div className={selectFindCategory === 'Сообщества' ? 'selected' : ''} onClick={() => setSelectFindCategory('Сообщества')}>Сообщества</div>
                        <div className={selectFindCategory === 'Чаты' ? 'selected' : ''} onClick={() => setSelectFindCategory('Чаты')}>Чаты</div>
                        <div className={selectFindCategory === 'Видео' ? 'selected' : ''} onClick={() => setSelectFindCategory('Видео')}>Видео</div>
                        <div className={selectFindCategory === 'Музыка' ? 'selected' : ''} onClick={() => setSelectFindCategory('Музыка')}>Музыка</div>
                    </div>
                    <div className="findModalSort">
                        <div className='title'>Сортировать</div>
                        <select>
                            <option>По популярности</option>
                            <option>По дате регистрации</option>
                        </select>
                        <div className='title'>По возрасту</div>
                        <div className='sortByAge'>
                            <select>
                                <option>От</option>
                                <option>14</option>
                                <option>18</option>
                                <option>30</option>
                                <option>40</option>
                            </select>
                            <select>
                                <option>До</option>
                                <option>14</option>
                                <option>18</option>
                                <option>30</option>
                                <option>40</option>
                            </select>
                        </div>
                        <div className='title'>Пол</div>
                        <div className='selectGender'>
                            <div onClick={() => setSelectCheckedGender('Мужской')}>
                                <input
                                    onChange={e => setSelectCheckedGender(e.target.value)}
                                    checked={selectCheckedGender === 'Мужской' ? true : false}
                                    value='Мужской' type="radio" />
                                <label htmlFor='Мужской'>Мужской</label >
                            </div>
                            <div onClick={() => setSelectCheckedGender('Женский')}>
                                <input
                                    onChange={e => setSelectCheckedGender(e.target.value)}
                                    checked={selectCheckedGender === 'Женский' ? true : false}
                                    value='Женский' type="radio" />
                                <label htmlFor='Женский'>Женский</label >
                            </div>
                            <div onClick={() => setSelectCheckedGender('Любой')}>
                                <input
                                    onChange={e => setSelectCheckedGender(e.target.value)}
                                    checked={selectCheckedGender === 'Любой' ? true : false}
                                    value='Любой' type="radio" />
                                <label htmlFor='Любой'>Любой</label >
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}


export default connect(reduxState, reduxActions)(FindModal)