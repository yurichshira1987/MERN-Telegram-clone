import React, { useState } from 'react'
import config from '../../utils/config.json'
import axios from 'axios'
import { connect } from 'react-redux'
import reduxActions from '../../Redux/actions'
import reduxState from '../../Redux/state'

const CreateModal = ({ placeholder, cancel, token, setDialogId }) => {
    const [dialogName, setDialogName] = useState('')
    const [openChat, setOpenChat] = useState(false)

    const createDialog = async () => {
        let data = { 
            category:placeholder,
            dialogName:dialogName,
            openChat:openChat 
        }
        await axios.post(`${config.url}/create_dialog`, data, { headers: { Authorization: token } })
        .then(res => setDialogId(res))
        cancel(false)
    }
    return (
        <div className='createModal generalModal'>
            <input onChange={e => setDialogName(e.target.value)}
                type="text"
                value={dialogName}
                placeholder={'Название ' + placeholder} />
            {placeholder === 'чата' &&
                < div className='createModalCheck'>
                    <input onChange={e=>setOpenChat(e.target.checked)} className='checkBox' type="checkbox" id='box' />
                    <label htmlFor="box">Открытый чат</label>
                </div>
            }
            <div className='select'>
                <div onClick={createDialog}>Создать</div>
                <div onClick={cancel}>Отмена</div>
            </div>
        </div >
    )
}
export default connect(reduxState, reduxActions)(CreateModal)