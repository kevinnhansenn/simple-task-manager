const mongoose = require("mongoose");
const Task = require("../model");

const mockItems = [
  {
    name: "Learn GraphQL",
    description: "Description to learning the framework",
    deadline: "2021-12-02",
    group: "111111111111111111111111",
  },
  {
    name: "Learn Keras",
    description: "Description to learning the framework",
    deadline: "2021-12-02",
    group: "111111111111111111111111",
    completed: true,
  },
  {
    name: "Learn Feather.js",
    description: "Description to learning the framework",
    deadline: "2021-12-02",
    group: "111111111111111111111111",
  },
  {
    name: "Learn Tensorflow.js",
    description: "Description to learning the framework",
    deadline: "2021-12-02",
    group: "111111111111111111111111",
  },
  {
    name: "Read Diary of Anne Frank",
    description: "Description to reading the book",
    deadline: "2021-04-04",
    group: "222222222222222222222222",
    expired: true,
  },
  {
    name: "Read Outliers book",
    description: "Description to reading the book",
    deadline: "2021-12-02",
    group: "222222222222222222222222",
  },
];
mongoose
  .connect("mongodb://db_task/task", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("db_task connected");

    Task.find({}).then(async (task) => {
      if (!task.length) {
        await Task.insertMany(mockItems);
      }
    });
  })
  .catch((err) => {
    console.error(err);
  });
