// server-crud-app/models/userModel.js
import mongoose from "mongoose";
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const userModel = mongoose.model("User", usersSchema);

export default userModel;
