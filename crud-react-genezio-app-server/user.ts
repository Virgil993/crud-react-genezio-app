// server-crud-app/user.js
import UserModel from "./models/userModel";
import mongoose from "mongoose";
import { GenezioDeploy } from "@genezio/types";

export type User = {
  _id: string;
  name: string;
  email: string;
  gender: string;
  verified: boolean;
};

export type AllUsersResponse = {
  success: boolean;
  msg?: string;
  users?: Array<User>;
  err?: string;
};

export type UserResponse = {
  success: boolean;
  msg?: string;
  user?: User;
  err?: string;
};

/**
 * The User server class that will be deployed on the genezio infrastructure.
 */
@GenezioDeploy()
export class UserHandler {
  constructor() {
    this.#connect();
  }

  /**
   * Private method used to connect to the DB.
   */
  #connect() {
    mongoose.set("strictQuery", false);
    try {
      mongoose.connect(process.env.NEON_POSTGRES_URL || "");
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Method that can be used to create a new user.
   *
   * The method will be exported via SDK using genezio.
   *
   * @param {*} name The user's name.
   * @param {*} email The user's email.
   * @param {*} gender The user's gender.
   * @param {*} verified The user's verified status.
   * @returns An object containing a boolean property "success" which
   * is true if the creation was successfull, false otherwise.
   */
  async createUser(
    name: string,
    email: string,
    gender: string,
    verified: boolean
  ): Promise<UserResponse> {
    // Check if email is the right format using regex
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      return { success: false, msg: "Wrong email format" };
    }
    // Check if there is another user with the same email address
    const user = await UserModel.findOne({ email: email });
    if (user) {
      // if there is another user with the same email address then we don't create the user
      // as we already stated that the email will be a way to identify our users so it must be unique for each user
      return { success: false, msg: "Email already exists" };
    }
    // Create the user and add it to the database

    try {
      var newUser: User = await UserModel.create({
        name: name,
        email: email,
        gender: gender,
        verified: verified,
      });
    } catch (err) {
      return {
        success: false,
        msg: "Error at database",
        err: err,
      };
    }
    // After all the operations are succesfull then we return the new user
    return {
      success: true,
      user: newUser,
    };
  }

  /**
   * Method that can be used to obtain all users.
   *
   * The method will be exported via SDK using genezio.
   *
   * @returns An object containing a boolean property "success" which
   * is true if the retrieval was successfull, false otherwise.
   */
  async getUsers() {
    // get all users
    const users = await UserModel.find();
    if (users) {
      return { success: true, msg: "Users retrived succesfully", users: users };
    }
    return { success: false, msg: "Error at database" };
  }

  /**
   * Method that can be used to obtain a user by a certain email.
   *
   * The method will be exported via SDK using genezio.
   *
   * @param {*} email The user's email.
   * @returns An object containing a boolean property "success" which
   * is true if the retrieval was successfull, false otherwise.
   */
  async getUserByEmail(email) {
    // Search for the user by email
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return { success: true, msg: "User retrived succesfully", user: user };
    }
    return { success: false, msg: "User dosen't exist" };
  }
  /**
   * Method that updates a user with a certain email.
   *
   * The method will be exported via SDK using genezio.
   *
   * @param {*} email The user's email.
   * @param {*} updatedUser The new user object containing the updated values.
   * @returns An object containing a boolean property "success" which
   * is true if the update was successfull, false otherwise.
   */
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
      return { success: true, msg: "Update completed" };
    } catch (err) {
      return { success: false, msg: "Error at update", error: err };
    }
  }

  /**
   * Method that deletes a user given a certain email.
   *
   * The method will be exported via SDK using genezio.
   *
   * @param {*} email The user's email.
   * @returns An object containing a boolean property "success" which
   * is true if the deletion was successfull, false otherwise.
   */
  async deleteUser(email) {
    // Check if a user with this email exists
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return { success: false, msg: "User dosen't exist" };
    }
    // If the user exists then we delete the user with the id form the user retrived earlier
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
