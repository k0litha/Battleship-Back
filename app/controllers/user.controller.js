const db = require("../models");
const Score = db.score;
const User = db.user;


exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};


exports.saveScore = (req, res) => {
  const score = new Score({
    username: req.body.username,
    state: req.body.state
  });

  score.save((err, score) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.username) {
      User.find(
        {
          username: { $in: req.body.username },
        },
        (err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          score.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "Score saved successfully!" });
          });
        }
      );
    }

  });

};


exports.showScore = (req, res) => {
  Score.find({
    username: req.body.username,
  })
    .sort({"_id":-1})
    .exec((err, score) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      console.log(req.body.username)
      res.status(200).send({score});
    });
};