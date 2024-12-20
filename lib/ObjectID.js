import mongoose from "mongoose";

const ObjectID = (userId) => {
  const specificId = new mongoose.Types.ObjectId(`${userId}`);
  return specificId;
};

export default ObjectID;
