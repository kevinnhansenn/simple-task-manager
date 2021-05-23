const express = require("express");
const app = express();
const chalk = require("chalk");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 5002;

app.use(cors());
app.use(bodyParser.json());

const redLog = (log) => {
  console.log(chalk.red(log));
};

const boldRedLog = (log) => {
  console.log(chalk.bold.red(log));
};

const greenLog = (log) => {
  console.log(chalk.green(log));
};

const boldGreenLog = (log) => {
  console.log(chalk.bold.green(log));
};

app.post("/taskCompleted", (req, res) => {
  const { task } = req.body;

  chalk.red();

  console.log(`\n`);
  boldGreenLog(`EMAIL: [A TASK HAS BEEN COMPLETED]`);
  greenLog(`Name: ${task.name}`);
  greenLog(`Description: ${task.description}`);
  greenLog(`Deadline: ${task.deadline}`);
  greenLog(`Completed on: ${new Date().toISOString().slice(0, 10)}`);
  console.log(`\n`);

  res.status(201).send("OK");
});

app.post("/taskExpired", (req, res) => {
  const { task } = req.body;

  console.log(`\n`);
  boldRedLog(`EMAIL: [A TASK HAS BEEN EXPIRED]`);
  redLog(`Name: ${task.name}`);
  redLog(`Description: ${task.description}`);
  redLog(`Deadline: ${task.deadline}`);
  console.log(`\n`);

  res.status(201).send("OK");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
