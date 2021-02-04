const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  dialog: {
    type: Types.ObjectId,
    ref: "Dialogs",
    required: true,
  },
  partner: {
    type: Types.ObjectId,
    ref: "Users",
    default: null,
  },
  owner: {
    type: Types.ObjectId,
    ref: "Users",
    required: true,
  },
  unReaded: {
    type: Number,
    default: 0,
  },
});

module.exports = model("DialogsForUsers", schema);
