

export default () =>{
    return(
        (state)=>({
            dialogs:state.dialogs,
            messages:state.messages,
            currentDialogId:state.currentDialogId,
            statusInfo:state.statusInfo,
            isLoadingMessage:state.isLoadingMessage,
            isLoadingDialog:state.isLoadingDialog,
            users:state.users,
            chatInputText:state.text,
            showEmoji:state.showEmoji,
            token:state.token,
            userId:state.userId,
            isAuth:state.isAuth,
            findDialogOnClientValue:state.findDialogOnClientValue,
            userInit:state.userInit,
            showFindModal:state.showFindModal,
            files:state.files,
            showUploadFilesModal:state.showUploadFilesModal,
            currentFileId:state.currentFileId,
            currentFileInit:state.currentFileInit,
            showFileModal:state.showFileModal,
            usersOnline: state.usersOnline,
            showCreateChannelModal:state.showCreateChannelModal,
            showCreateChatModal:state.showCreateChatModal,
            showUserModal:state.showUserModal,
            currentDialogInfo:state.currentDialogInfo,
            showContactModal: state.showContactModal,
            contacts: state.contacts,
            showAddedIcon: state.showAddedIcon,
        })
    )
}