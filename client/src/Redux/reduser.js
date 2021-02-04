const initialState ={
    showCreateChannelModal:false,
    showCreateChatModal:false,
    showUserModal:false,
    text:'',
    showEmoji:false,
    messages:[],
    currentDialogId:null,
    statusInfo:null,
    isLoadingMessage:false,
    users:null,
    userId:null,
    userInit:null,
    token:null,
    isAuth:false,
    dialogs:[],
    isLoadingDialog:false,
    findDialogOnClientValue:'',
    showFindModal:false,
    files:[],
    showUploadFilesModal:false,
    currentFileId:null,
    currentFileInit:null,
    showFileModal:false,
    usersOnline:null,
    currentDialogInfo:null,
    showContactModal:false,
    contacts:[],
    showAddedIcon:false,
}


export default (state = initialState, { type, payload}) =>{
    switch(type){
    
        case 'set_show_added_icon': return{
            ...state, showAddedIcon: payload,
        }
        case 'set_show_contacts': return{
            ...state, contacts: payload,
        }
        case 'set_show_contact_modal': return{
            ...state, showContactModal: payload,
        }
        case 'set_current_dialog_info': return{
            ...state, currentDialogInfo: payload,
        }
        case 'set_show_user_modal': return{
            ...state, showUserModal: payload,
        }
        case 'set_show_create_chat_modal': return{
            ...state, showCreateChatModal: payload,
        }
        case 'set_show_create_channel_modal': return{
            ...state, showCreateChannelModal: payload,
        }
        case 'set_users_online': return{
            ...state, usersOnline: payload,
        }
        case 'set_file_modal': return{
            ...state, showFileModal: payload, 
        }
        case 'set_current_file_url': return{
            ...state, currentFileInit: payload, 
        }
        case 'set_current_file_id': return{
            ...state, currentFileId: payload, 
        }

        case 'set_show_files_modal': return{
            ...state, showUploadFilesModal: payload, 
        }
        case 'set_dialogs': return{
                ...state, dialogs:payload, isLoadingDialog:false,
        }
        case 'set_dialog_id': return{
            ...state, currentDialogId:payload
        }
        case 'set_status_info': return{
            ...state, statusInfo: payload
        }
        case 'set_dialogs_loading': return{
            ...state, isLoadingDialog: true
        }
        case 'set_chat_text': return {
            ...state, text:payload 
        }
        case 'set_show_emoji': return { 
            ...state, showEmoji:payload 
        } 
        case 'set_user_id': return{
            ...state, userId: payload
        }
        case "set_users": return{
            ...state, users: payload
        }
        case "set_token": return{
            ...state, token: payload
        }
        case "set_auth": return {
            ...state, isAuth: payload
        }
        case 'set_messages': return{
            ...state, messages:payload, isLoadingMessage:false
        }
        case 'set_messages_loading': return{
        ...state, isLoadingMessage: payload
        }
        case 'set_find_dialog_on_client_value': return{
            ...state, findDialogOnClientValue: payload
        }
        case 'set_user_init': return{
            ...state, userInit: payload
        }
        case 'set_show_find_modal': return{
            ...state, showFindModal: payload
        }
        case 'add_files': return{
            ...state, 
            files: [...state.files, payload]
        }

        case 'remove_file': return{
            ...state, 
            files: payload
        }
        case 'remove_files': return{
            ...state, 
            files:payload
        }     
        default: return state
    }
}