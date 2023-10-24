import UserModel from "./models/userModel";
import mongoose from "mongoose";

export class User {
  constructor() {
    this.#connect();
  }

  // connect mongoose to mongodb
  #connect() {
    mongoose.set("strictQuery", false);
    try {
      mongoose.connect(process.env.MONGO_DB_URI);
      console.log(process.env.MONGO_DB_URI);
    } catch (err) {
      console.log(err);
    }
  }

  async createUser(name, email, gender, verified) {
    // Check if email is the right format using regex
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      return { success: false, msg: "wrong email format" };
    }
    // Check if there is another user with the same email address
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return { success: false, msg: "Email already exists" };
    }
    // Create the user
    var err,
      newUser = await UserModel.create({
        name: name,
        email: email,
        gender: gender,
        verified: verified,
      });

    if (err) {
      return {
        success: false,
        msg: "Error at database",
        error: err,
      };
    }
    return {
      success: true,
      user: newUser,
    };
  }

  async getUsers() {
    // get all users
    const users = await UserModel.find();
    if (users) {
      return { success: true, msg: "Users retrived succesfully", users: users };
    }
    return { success: false, msg: "Error at database" };
  }

  async getUserByEmail(email) {
    // Search for the user by email
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return { success: true, msg: "User retrived succesfully", user: user };
    }
    return { success: false, msg: "User dosen't exist" };
  }

  async updateUser(email, updatedUser) {
    // Check if a user with this email exists
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return { success: false, msg: "User dosen't exist" };
    }
    // Create a data to set which has all the new user info
    const dataToSet = {};
    if (updatedUser.name != null) {
      dataToSet.name = updatedUser.name;
    }
    if (updatedUser.gender != null) {
      dataToSet.gender = updatedUser.gender;
    }
    if (updatedUser.verified != null) {
      dataToSet.verified = updatedUser.verified;
    }

    // Update the user with the new values
    const newValues = { $set: dataToSet };
    try {
      await UserModel.updateOne({ _id: user._id }, newValues);
      return { success: true, msg: "update completed" };
    } catch (err) {
      return { success: false, msg: "error at update", error: err };
    }
  }

  async delete(email) {
    // Check if a user with this email exists
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return { success: false, msg: "User dosen't exist" };
    }
    try {
      await UserModel.deleteMany({ _id: user._id });
      return { success: true, msg: "User deleted succesfully" };
    } catch (err) {
      return {
        success: false,
        msg: "Unexpected error at deletion",
        error: err,
      };
    }
  }
}
