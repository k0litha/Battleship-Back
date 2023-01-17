const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();
require('dotenv').config()
require("./socket.js")

var corsOptions = {
  origin: [ process.env.FRONTEND_URL],
  credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());


app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "battleship-session",
    secret: process.env.MONGO_URL,
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Battlship Multiplayer" });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const SERVER_PORT = process.env.SERVER_PORT || 8080;
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

    
      // new Role({
      //   name: "admin"
      // }).save(err => {
      //   if (err) {
      //     console.log("error", err);
      //   }

      //   console.log("added 'admin' to roles collection");
      // });
    }
  });
}


