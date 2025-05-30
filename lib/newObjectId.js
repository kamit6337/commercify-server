import mongoose from "mongoose";

const newObjectId = () => {
  const specificId = new mongoose.Types.ObjectId();
  return specificId;
};

export default newObjectId;
