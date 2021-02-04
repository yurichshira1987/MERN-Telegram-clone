const Dialogs = require("../models/dialogs");
const Messages = require("../models/messages");
const DialogsForUsers = require('../models/dialogsForUsers')

module.exports = (app, io, socket) => {
  

  app.get("/get_messages", async (req, res) => {
    try {
      const dialogId = req.query.id;
      await Messages.updateMany(
        { dialogId: dialogId, ownerId: { $ne: req.user.id }},
        { $set: { readed: true } }
      );
      await DialogsForUsers.updateMany({
        dialog:dialogId, owner: req.user.id},
        {$set:{unReaded:0}})

      const messages = await Messages.find({
        dialogId: req.query.id,
      }).populate(["ownerId", "attachments"]);

      res.json(messages);

      socket.broadcast.to('room'+req.query.id).emit("update_read", req.user.id);

    } catch (e) {
      res.json({e});
    }
  });

  app.post("/create_message", async (req, res) => {
    try{
      const { text, currentDialogId } = req.body;
      if (!currentDialogId) {
        return res.status(404).json({ message: "Диалог не выбран" });
      }
      if (!text) {
        return res.status(404).json({ message: "Текст не введён" });
      }
      const message = new Messages({
        text,
        ownerId: req.user.id,
        dialogId: currentDialogId,
      });
      await message.save();
      io.to('room'+currentDialogId).emit("messages_update");

      await Dialogs.findOneAndUpdate(
        { _id: currentDialogId },
        { lastMessage: message._id }
      );
      await DialogsForUsers.updateMany({
        dialog:currentDialogId, owner: { $ne: req.user.id }
      }, {$inc:{unReaded: + 1}})

      io.to('allDialogs'+currentDialogId).emit("dialogs_update");
      res.json({ message: "Вы создали сообщение" });
      
    }catch(e){
      res.json(e)
    }
  });

  app.delete("/delete_message", async (req, res) => {
    try {
      const message = await Messages.findOneAndDelete({ _id: req.query.id });
      io.emit("messages_update");
      if (message) {
        io.to(req.user.id).emit("dialogs_update");
        res.json({ message: "Сообщение удалено" });
      } else {
        res.json({ message: "Что то пошло не так" });
      }
    } catch (e) {
      res.json({e});
    }
  });

  app.put("/change_message", async (req, res) => {
    try {
      const message = await Messages.findOneAndUpdate(
        { _id: req.query.id },
        { text: req.body.value }
      );
      io.to(req.user.id).emit("messages_update");
      if (message) {
        res.json({ message: "Сообщение удалено" });
      } else {
        res.json({ message: "Что то пошло не так" });
      }
    } catch (e) {
      res.json({e});
    }
  });

};
