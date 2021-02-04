const Dialogs = require("../models/dialogs");
const DialogsForUsers = require("../models/dialogsForUsers");
const Messages = require("../models/messages")



module.exports = (app, io) => {



  app.post("/add_user_to_dialog", async (req, res) => {
    try {
      const { candidateId, currentDialogInfo, userId } = req.body;
      if (currentDialogInfo.dialog.chat || currentDialogInfo.dialog.channel) {
        let dialogForUser = await DialogsForUsers.findOne({owner: candidateId, dialog: currentDialogInfo.dialog._id,})
        if(dialogForUser){
          res.json({message:'подписка уже есть'})
        }
        else{
          let dialogForUser = new DialogsForUsers({
            owner: candidateId,
            dialog: currentDialogInfo.dialog._id,
          });
          let dialog = await Dialogs.findById(currentDialogInfo.dialog._id)
          dialog.dialogFollowers = (dialog.dialogFollowers + 1)
          await dialog.save()
          await dialogForUser.save()
          io.to(userId).to(candidateId).emit("dialogs_update");
          io.to(userId).emit("contacts_update");
          res.json({message:'кандидат успешно подписан'});
        }

      } 
      else {
        res.json({ message: "ошибка" });
      }
    } catch (e) {
      res.json(e);
    }
  });



  app.get("/get_dialogs", async (req, res) => {
    try {
  
      let dialogsForUsers = await DialogsForUsers.find({ owner: req.user.id })
        .populate(["partner", "dialog"])
        .populate({ path: "dialog", populate: "lastMessage" }); 

      res.json(dialogsForUsers);
    } catch (e) {
      res.json(e);
    }
  });






  app.post("/create_dialog", async (req, res) => {
    try {
      if (req.body.category === "privateChat") {
        var { partnerId } = req.body;
        var dialog = await Dialogs.findOne({
          $and: [{ members: req.user._id }, { members: partnerId }],
        });
        if (dialog) res.json(dialog.id);


        else {
          var dialog = new Dialogs({
            privateChat: true,
            members: [partnerId, req.user._id],
          });
          var dialogForUser = new DialogsForUsers({
            owner: req.user.id,
            partner: partnerId,
            dialog: dialog._id,
          });
          var dialogForPartner = new DialogsForUsers({
            owner: partnerId,
            partner: req.user.id,
            dialog: dialog._id,
          });
          await dialog.save();
          await dialogForPartner.save();
          await dialogForUser.save();
          io.to(req.user.id).to(partnerId).emit("dialogs_update");
          res.json(dialog._id);
        }


      } else if (req.body.category === "чата") {
        var { dialogName, openChat } = req.body;
        if (dialogName === "") {
          res.json({ message: "Введите название сообщества" });
        } else {
          var dialogChat = new Dialogs({
            dialogName,
            openChat,
            chat: true,
            owner: req.user.id,
            dialogFollowers: 1,
          });
          var dialogChatForUser = new DialogsForUsers({
            owner: req.user.id,
            dialog: dialogChat._id,
          });
          await dialogChat.save();
          await dialogChatForUser.save();
          io.to(req.user.id).emit("dialogs_update");
          res.json(dialogChat._id);
        }


      } else if (req.body.category === "сообщества") {
        var { dialogName } = req.body;
        res.json("privateChat");


      } else {
        res.status(500).json("Ошибка");
      }
    } catch (e) {
      res.json(e);
    }
  });
};
