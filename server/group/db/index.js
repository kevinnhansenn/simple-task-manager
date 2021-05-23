const mongoose = require("mongoose");
const Group = require("../model");

const mockItems = [
  {
    _id: mongoose.Types.ObjectId("111111111111111111111111"),
    name: "Framework to learn",
  },
  {
    _id: mongoose.Types.ObjectId("222222222222222222222222"),
    name: "Book to read",
  },
  {
    _id: mongoose.Types.ObjectId("333333333333333333333333"),
    name: "Things to buy",
  },
  {
    _id: mongoose.Types.ObjectId("444444444444444444444444"),
    name: "Places to visit",
  },
];

mongoose
  .connect("mongodb://db_group/group", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("db_group connected");

    Group.find({}).then(async (group) => {
      if (!group.length) {
        await Group.insertMany(mockItems);
      }
    });
  })
  .catch((err) => {
    console.error(err);
  });
