// server-crud-app/models/userModel.js
import { Model, DataTypes } from "sequelize";

export class UserModel extends Model {
  userId!: number;
  name!: string;
  email!: string;
  gender!: string;
  verified!: boolean;
}
