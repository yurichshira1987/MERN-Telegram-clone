const DialogsForUsers = require('../models/dialogsForUsers')
const Users = require("../models/user");
const Dialogs = require("../models/dialogs")
const Contacts = require("../models/contacts");

module.exports = (app, io) => {

  app.get("/get_user_info_by_dialog_id/:dialogId", async (req, res) =>{
    try{
      var dialog = await Dialogs.findById(req.params.dialogId)
      .populate(['members'])

      if(!dialog) return res.status(500).json({message:'Диалог не найден не найден'})
      res.json(dialog)

    }catch(e){
      res.status(500).json(e)
    }
  })

  app.get("/get_users/", async (req, res) => {
    try {
      const users = await Users.find()
      // .limit(+req.query.limit)
      var filterUsers = users.filter((item) => item.id !== req.query.userId);
      for(let i = 0; i < filterUsers.length; i++){
        var equals = await Contacts.findOne({owner:req.user.id, contact:filterUsers[i]._id})
        if(equals){
          filterUsers[i].signed = true
        } 
      }
      res.json(filterUsers);
      
    } catch (e) {
      res.status(500).json(e)
    }
  });

  app.get("/find_users/", async (req, res) => {
    try {
      const query = req.query.data
      const users = await Users.find({name:new RegExp(query)})
        //$or:[{ name:new RegExp(query) }]
      var data = users.filter((item) => item.id !== req.user.id);
      res.json(data);
      
    } catch (e) {
      res.status(500).json(e)
    }
  });

  app.post("/create_contact", async(req, res)=>{
    try{
      const {userId, partnerId} = req.body
      let contact = await Contacts.findOne({owner:userId, contact:partnerId})
      if(contact) res.json({message:'Такой контакт уже добавлен', contact})
      else{
        let contact = new Contacts({
          owner:userId, 
          contact:partnerId
        })
        await contact.save()
        io.to(userId).emit('server_create_contact')
        res.json(contact)
      }
    }catch(e){
      res.status(500).json(e)
    }
  })
  // dialog.chat || dialog.channel
  app.get("/get_contacts/", async(req, res)=>{
    try{
      let userId = req.query.userId
      let dialogId = req.query.dialogId
      let chat = req.query.chat  
      let channel = req.query.channel  

      let contacts = await Contacts.find({owner:userId})
      .populate(['contact'])
      // .limit(+req.query.limit)

      if(chat || channel){
        for(let i = 0; i < contacts.length; i++){
          let equals = await DialogsForUsers.findOne({owner:contacts[i].contact._id, dialog:dialogId})
          if(equals) contacts[i].contact.signed = true
        }
      }

      res.json(contacts)
    }catch(e){
      res.json(e)
    }
  })

  app.delete("/delete_contact/", async(req, res)=>{
    try{
      await Contacts.deleteOne({owner:req.query.userId, contact:req.query.partnerId})
      io.to(req.query.userId).emit('server_delete_contact')
      res.json({message:'сообщение удалено'})
    }catch(e){
      res.json(e)
    }
  })

}

