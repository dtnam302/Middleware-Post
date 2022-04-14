const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const RoomSchema = new Schema({
  org_name: {
    type: String,
  },
  url: {
    type: String,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
});

module.exports = {
  Post: mongoose.model("Post", PostSchema),
  Room: mongoose.model("Room", RoomSchema),
};
