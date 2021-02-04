const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const config = require('./utils/config.json')

app.use(cors());
app.use(express.json({ extended: true }));
app.use("/uploads", express.static("uploads"));
require("./routes/auth-registr")(app);


// app.use(passport.initialize());
require("./middleware/passport")(passport);
app.use(passport.authenticate("jwt", { session: false }));



io.on("connection", (socket) => {
  require('./utils/socketConnection')(io, socket)
  require("./routes/uploadsFiles")(app, io);
  require("./routes/messages")(app, io, socket);
  require("./routes/dialogs")(app, io);
  require("./routes/home")(app, io);
})

async function start() {
  try {
    await mongoose.connect(config.urlMongoDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex:true
    });
    http.listen(config.urlServer, () => console.log("Server has been started"));
  } catch (e) {
    console.log(e);
  }
}
start();


