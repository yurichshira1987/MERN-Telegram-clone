let users = []
module.exports = (io, socket) => {

    users.push(socket.id)

    socket.on("disconnect", () => {
        users.pop()
    });
    socket.on('client_get_online_users', (data)=>{
        io.to(data).emit('server_send_online_users', users.length)
    })

    socket.on("join_user_id", (data) => {
      socket.join(data);
    });

    socket.on("join_to_dialog", (data) => {
      socket.join(data);
    });
    socket.on("join_to_all_dialog", (data) => {
      socket.join(data);
    });

    socket.on("leave_to_dialog", (data) => {
      socket.leave(data);
    });

    socket.on("client_typing_start", (data) => {
      socket.to('room'+data.currentDialogId).emit("server_message_typing_start", data.userInit);
      socket.to('allDialogs'+data.currentDialogId).emit("server_dialogs_typing_start", data);
    });

    socket.on("client_typing_stop", (data) => {
      socket.to('room'+data.currentDialogId).emit("server_message_typing_stop");
      socket.to('allDialogs'+data.currentDialogId).emit("server_dialogs_typing_stop");
    });
  
};
