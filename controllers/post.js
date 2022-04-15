/**
 * We can interact with mongoose in three diffirent ways:
 * [v] Callback
 * [v] Promises
 * [v] Async/await (Promises)
 */

const { Post, Room } = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");

const newPost = async (req, res, next) => {
  // Find owner
  const files = req.files;
  body = req.body;
  const folder = req.body.name;
  const { userID } = req.params;

  const user = await User.findById(userID);

  const newPost = new Post(body);

  const urls = await uploadImage(files, folder);
  console.log(urls);
  console.log("====URLS=====");
  for (const room_body of urls) {
    console.log(room_body);
    console.log("====ROOM_BODY=====");
    const newRoom = new Room(room_body);
    newRoom.post = newPost;
    await newRoom.save();
    newPost.rooms.push(newRoom._id);
  }

  newPost.owner = user;

  await newPost.save();

  user.posts.push(newPost._id);
  await user.save();

  return res.status(200).json({ post: newPost });
};

module.exports = {
  newPost,
};

//helpers function
const uploadImage = async (files, folder) => {
  const uploader = async (path, originalname) =>
    await cloudinary.uploader.upload(path, {
      folder: `${folder}`,
      //use_filename: true,
      //public_id: originalname,
    });

  const urls = [];
  console.log(files.length);

  for (const file of files) {
    const { path, originalname } = file;
    let org_name = originalname.split(".")[0]; // phong_khach.jpg => phong_khach
    //org_name shoule be phong_khach, phong_ngu v.v.
    let newPath = await uploader(path, org_name);
    console.log(newPath);
    urls.push({ url: newPath.url, org_name: org_name });
  }
  return urls;
};
