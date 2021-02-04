const Messages = require("../models/messages");
const upload = require("../middleware/uploads");
const UploadsFiles = require("../models/uploadsFiles");
const DialogsForUsers = require('../models/dialogsForUsers')

module.exports = (app, io) => {
  app.get("/get_files_by_message_id", async (req, res) => {
    try {
      const id = req.query.id;
      const files = await UploadsFiles.find({ messageId: id });
      res.json(files);
    } catch (e) {
      res.status(500).json(e);
    }
  });

  app.get("/get_file_url", async (req, res) => {
    try {
      const files = await UploadsFiles.findById(req.query.currentFileId);
      res.json(files);
    } catch (e) {
      res.status(500).json(e);
    }
  });

  app.post("/upload_files_message", upload.array("file"), async (req, res) => {
    try {
      const date = new Date().getTime();
      var message = new Messages({
        text: req.query.text && req.query.text,
        ownerId: req.user._id,
        dialogId: req.query.dialogId,
      });

      for (var i = 0; i < req.files.length; i++) {
        var uploadFiles = new UploadsFiles({
          ownerId: req.user._id,
          messageId: message._id,
          dialogId: req.query.dialogId,
          src: req.files[i].destination + req.files[i].filename,
          size: req.files[i].size,
          format: req.files[i].mimetype,
          date: date,
        });
        message.attachments.push(uploadFiles._id);
        await uploadFiles.save();
      }
      await message.save();

      await DialogsForUsers.updateMany({
        dialog: req.query.dialogId, owner: { $ne: req.user.id }
      }, {$inc:{unReaded: + 1}})

      io.to('room'+req.query.dialogId).emit("messages_update");
      io.to('allDialogs'+req.query.dialogId).emit("dialogs_update");
      res.status(200).json({ message: "Сообщение создано" });
    } catch (e) {
      res.json(e);
    }
  });

  app.post("/upload_audio_message", upload.array("file"), async (req, res) => {
    try {
      var message = new Messages({
        dialogId:req.query.dialogId,
        ownerId:req.user._id,
        audio: req.files[0].destination + req.files[0].filename,
      });
      await message.save();

      await DialogsForUsers.updateMany({
        dialog:req.query.dialogId, owner: { $ne: req.user.id }
      }, {$inc:{unReaded: + 1}})

      io.to('room'+req.query.dialogId).emit("messages_update");
      io.to('allDialogs'+req.query.dialogId).emit("dialogs_update");
      res.status(200).json({ message });
    } catch (e) {
      res.json(e);
    }
  });


};
