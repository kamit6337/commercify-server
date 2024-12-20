import mongoose from "mongoose";
import validation from "validator";
import { hashUserPassword } from "../lib/bcrypt.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return validation.isEmail(value);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    default: "",
    trim: true,
  },
  photo: {
    type: String,
    required: [true, "Please provide pic"],
    trim: true,
  },
  OAuthId: {
    type: String,
    default: null,
    select: false,
  },
  OAuthProvider: {
    type: String,
    default: null,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  passwordLastUpdated: {
    type: Date,
    default: Date.now(),
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.index({ email: 1 });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    await hashUserPassword(this); // Hash only if password is modified.
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
