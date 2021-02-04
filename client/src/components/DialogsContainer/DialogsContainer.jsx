import React from "react";
import { connect } from "react-redux";
import reduxActions from '../../Redux/actions'
import reduxState from '../../Redux/state'
// import orderBy from 'lodash/orderBy'
import { LoadingOutlined } from '@ant-design/icons';
import Dialog from '../Dialog/Dialog'
import './dialogsContainer.scss'



const DialogsContainer = ({ dialogs, isLoadingDialog, findDialogOnClientValue, findPartner, userInit }) => {
  

  const findDialogs = (array) => {
    return array.filter(item => item.dialog.dialogName.toLowerCase().indexOf(findDialogOnClientValue.toLowerCase()) >= 0
      || item.partner && item.partner.name.toLowerCase().indexOf(findDialogOnClientValue.toLowerCase()) >= 0)

  }
  return (
    // orderBy(dialogs , "date", "desc")
    <div className="dialogs">
      {
        findDialogs(dialogs).length && !isLoadingDialog ? (
          findDialogs(dialogs).map((item) => (
            <Dialog
  
              key={item._id}
              id={item.dialog._id}
              avatar={item.dialog.privateChat ? item.partner.avatar : item.dialogAvatar}
              username={item.dialog.privateChat ? item.partner.name : item.dialog.dialogName}
              lastMessage={item.dialog.lastMessage && (item.dialog.lastMessage.owner === userInit.id ? 'Вы: ' + item.dialog.lastMessage.text : item.dialog.lastMessage.text)}
              online={item.dialog.privateChat && item.partner.isOnline}
              date={item.dialog.lastMessage && item.dialog.lastMessage.date}
              unReaded={item.unReaded}
              channel={item.dialog.channel}
              chat={item.dialog.chat}
              privateChat={item.dialog.privateChat}
            />
          ))
        ) : dialogs.length && !isLoadingDialog ? (

          <div className="no_dialogs">
          </div>

        ) : isLoadingDialog &&
            <LoadingOutlined />
      }
    </div>
  )
}

export default connect(reduxState(), reduxActions)(DialogsContainer);
