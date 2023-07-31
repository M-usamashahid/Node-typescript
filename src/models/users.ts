import mongoose, { Schema, Document } from "mongoose";
import { genSaltSync, hashSync } from "bcrypt";

export interface IUser extends Document {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  employeeId: String,
  address: String,
  role: String,
  createdBy: Schema.Types.ObjectId,
  updatedBy: Schema.Types.ObjectId,
  isDeleted: Boolean
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  employeeId: {
    type: String,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    default: 'editor'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.fullName = `${ret.firstName} ${ret.lastName}`
      delete ret.__v;
    }
  }
});

UserSchema.methods.generateHash = (password) =>
  hashSync(password, genSaltSync(10));

export default mongoose.model<IUser>(`users`, UserSchema);
