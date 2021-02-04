import axios from "axios";
import config from "../utils/config.json";

const Actions = {
  setDialogs: (item) => ({ type: "set_dialogs", payload: item }),
  setStatusInfo: (item) => ({ type: "set_status_info", payload: item }),
  setDialogId: (item) => ({ type: "set_dialog_id", payload: item }),
  setDialogsLoading: (item) => ({ type: "set_dialogs_loading", payload: item }),
  setMessages: (item) => ({ type: "set_messages", payload: item }),
  setMessagesLoading: (item) => ({type: "set_messages_loading",payload: item,}),
  setShowEmoji: (item) => ({ type: "set_show_emoji", payload: item }),
  setUsers: (item) => ({ type: "set_users", payload: item }),
  setToken: (item) => ({ type: "set_token", payload: item }),
  setUserId: (item) => ({ type: "set_user_id", payload: item }),
  setUserInit: (item) => ({ type: "set_user_init", payload: item }),
  setAuth: (item) => ({ type: "set_auth", payload: item }),
  setText: (item) => ({ type: "set_chat_text", payload: item }),
  setFindDialogOnClientValue: (item) => ({type: "set_find_dialog_on_client_value",payload: item,}),
  setShowFindModal: (item) => ({type: "set_show_find_modal",payload: item,}),
  addFiles: (item) => ({ type: "add_files", payload: item }),
  removeFileOnClient: (item) => ({ type: "remove_file", payload: item }),
  removeFiles: (item) => ({ type: "remove_files", payload: item }),
  setShowUploadFilesModal: (item) => ({type: "set_show_files_modal",payload: item,}),
  setCurrentFileId: (item) => ({type: "set_current_file_id",payload: item,}),
  setCurrentFileInit: (item) => ({type: "set_current_file_url",payload: item,}),
  setShowFileModal: (item) => ({type: "set_file_modal",payload: item,}),
  setUsersOnline: item => ({type:'set_users_online', payload:item}),
  setShowCreateChatModal:item => ({type:'set_show_create_chat_modal', payload:item}),
  setShowCreateChannelModal:item => ({type:'set_show_create_channel_modal', payload:item}),
  setShowContactModal:item => ({type:'set_show_contact_modal', payload:item}),
  setShowUserModal:item => ({type:'set_show_user_modal', payload:item}),
  setCurrentDialogInfo:item => ({type:'set_current_dialog_info', payload:item}),    
  setContacts:item => ({type:'set_show_contacts', payload:item}),
  setShowAddedIcon:item => ({type:'set_show_added_icon', payload:item}),  
  




  startAuthUser: (token, userId, userInit) => (dispatch) => {
    dispatch(Actions.setToken(token));
    dispatch(Actions.setUserId(userId));
    dispatch(Actions.setAuth(true));
    dispatch(Actions.setUserInit(userInit));
  },

  logout: () => (dispatch) => {
    dispatch(Actions.setToken(null));
    dispatch(Actions.setUserId(null));
    dispatch(Actions.setUserInit(null));
    dispatch(Actions.setAuth(false));
    dispatch(Actions.setDialogId(null));
    dispatch(Actions.setMessages(""));
    dispatch(Actions.setText(""));
    localStorage.removeItem("initUser");
    window.location.replace(config.clientUrl);
  },

  login: (token, userId, userInit) => (dispatch) => {
    localStorage.setItem(
      "initUser",
      JSON.stringify({ token, userId, userInit })
    );
    dispatch(Actions.startAuthUser(token, userId, userInit));
  },

  getMessages: () => async (dispatch, getState) => {
    var { token, currentDialogId } = getState();
    await axios.get(`${config.url}/get_messages?id=${currentDialogId}`, {headers: { Authorization: token }})
    .then((res) => {
      
      dispatch(Actions.setMessages(res.data))
    })
  },

  getDialogs: () => async (dispatch, getState) => {
    var { token } = getState();
    await axios
      .get(`${config.url}/get_dialogs`, { headers: { Authorization: token } })
      .then((res) => dispatch(Actions.setDialogs(res.data)));
  },

  sendMessage: () => async (dispatch, getState) => {
    var { currentDialogId, text, token, files } = getState();
    if (currentDialogId) {
      var data = { text, currentDialogId };
      if (!files.length && text) {
        dispatch(Actions.setText(""));
        await axios.post(`${config.url}/create_message`, data, { headers: { Authorization: token }});
      }

      if (files.length) {
        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
          data.append("file", files[i]);
        }
        dispatch(Actions.setText(""));
        dispatch(Actions.setShowUploadFilesModal(false))
        await axios.post(`${config.url}/upload_files_message?text=${text}&dialogId=${currentDialogId}`, data, { headers: { Authorization: token },})
        dispatch(Actions.removeFiles([]))  
        
      }
    }
  },
 
  findPartner: (array) => (dispatch, getState) => {
    var { userId } = getState();
    return array.filter((item) => item._id !== userId);
  },

  getUserInfo: (id) => async (dispatch, getState) => {
    var { token } = getState();
    await axios
      .get(`${config.url}/get_user/${id}`, {
        headers: { Authorization: token },
      })
      .then((res) => dispatch(Actions.setPartnerInfo(res.data)));
  },
};

export default Actions;
