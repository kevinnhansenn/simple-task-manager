require("./db");

const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const Task = require("./model");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

schedule.scheduleJob("0 0 0 * * *", async function () {
  Task.find({ completed: false }, function (err, tasks) {
    if (err) {
      console.error(err);
    } else {
      tasks.forEach(async (task) => {
        const today = new Date(new Date().toISOString().slice(0, 10)).getTime();
        const taskDeadline = new Date(task.deadline).getTime();
        if (today > taskDeadline) {
          await Task.findByIdAndUpdate(task.id, { expired: true });
          await axios.post("http://server_email:5002/taskExpired", { task });
        }
      });
    }
  });
});

app.get("", (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.status(200).send(tasks);
    })
    .catch(() => {
      res.status(400).send();
    });
});

app.post("/add", (req, res) => {
  const { name, deadline, description, group } = req.body;

  let expired = false;
  const today = new Date(new Date().toISOString().slice(0, 10)).getTime();
  const _deadline = new Date(deadline).getTime();

  if (today > _deadline) {
    expired = true;
  }

  const newTask = new Task({
    name,
    deadline,
    description,
    group,
    expired,
  });

  newTask
    .save()
    .then(async () => {
      const updated = await Task.find({});
      res.status(200).send(updated);
    })
    .catch(() => {
      res.status(400).send();
    });
});

app.post("/complete", (req, res) => {
  const { id } = req.body;

  Task.findByIdAndUpdate(id, { completed: true }, async function (_, task) {
    await axios.post("http://server_email:5002/taskCompleted", { task });
    const updated = await Task.find({});
    res.status(200).send(updated);
  });
});

app.post("/edit", (req, res) => {
  const { id, name, deadline, description } = req.body;

  let expired = false;
  const today = new Date(new Date().toISOString().slice(0, 10)).getTime();
  const _deadline = new Date(deadline).getTime();

  if (today > _deadline) {
    expired = true;
  }

  Task.findByIdAndUpdate(id, { name, deadline, description, expired })
    .then(async () => {
      const updated = await Task.find({});
      res.status(200).send(updated);
    })
    .catch(() => {
      res.status(400).send();
    });
});

app.post("/delete", (req, res) => {
  const { listOfId } = req.body;

  Task.deleteMany({ _id: { $in: listOfId } })
    .then(async () => {
      const updated = await Task.find({});
      res.status(200).send(updated);
    })
    .catch(() => {
      res.status(400).send();
    });
});

app.post("/move", (req, res) => {
  const { listOfId, targetGroup } = req.body;

  Task.updateMany({ _id: { $in: listOfId } }, { group: targetGroup })
    .then(async () => {
      const updated = await Task.find({});
      res.status(200).send(updated);
    })
    .catch(() => {
      res.status(400).send();
    });
});

app.post("/deleteByGroup", (req, res) => {
  const { id } = req.body;

  Task.deleteMany({ group: id })
    .then(async () => {
      const updated = await Task.find({});
      res.status(200).send(updated);
    })
    .catch(() => {
      res.status(400).send();
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
