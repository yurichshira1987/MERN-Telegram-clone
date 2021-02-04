import React from 'react'
import { useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import  RegistrSuccess  from '../components/RegistrSuccess/RegistrSuccess.jsx'
import axios from 'axios'
import config from '../utils/config.json'
import { useState } from 'react'
import { CheckCircleOutlined  } from '@ant-design/icons';

export default   () => {
    const hash = useParams().hash
    const [showConfirm, setShowConfirm] = useState(false)

    const confirmEmail = async () => {
        let res = await axios.put(config.url + "/confirm/" + hash)
        if (res.data === 'Акаунт подтверждён') {
            setShowConfirm(true)
        }
    }

    useEffect(() => {
        confirmEmail()
    })

    return (
        <>
            {
                showConfirm &&
                <RegistrSuccess
                    text={<NavLink style={{color:'#0B9653'}} to='/'> {'Перейти на авторизацию'}   </NavLink>}
                    heading={'Вы успешно подтвердили свой аккаунт'}
                    img = {<CheckCircleOutlined  style={{color:'#0B9653'}}/> }
                />          
            }
        </>
    )
}