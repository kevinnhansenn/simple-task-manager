require("./db");

const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const Group = require("./model");
const bodyParser = require("body-parser");
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("", (req, res) => {
  Group.find({})
    .then((groups) => {
      res.status(200).send(groups);
    })
    .catch(() => {
      res.status(400).send();
    });
});

app.post("/add", (req, res) => {
  const { name } = req.body;

  const newGroup = new Group({
    name,
  });

  newGroup
    .save()
    .then(async () => {
      const updated = await Group.find({});
      res.status(201).send(updated);
    })
    .catch(() => {
      res.status(400).send();
    });
});

app.post("/delete", async (req, res) => {
  const { id } = req.body;
  Group.findByIdAndDelete(id)
    .then(async () => {
      const updatedGroup = await Group.find({});
      const updatedTask = await axios.post(
        "http://server_task:5001/deleteByGroup",
        { id }
      );

      res.status(200).send({
        updatedGroup,
        updatedTask: updatedTask.data,
      });
    })
    .catch(() => {
      res.status(400).send();
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
