import mongoose, { Schema, Document } from "mongoose";

export interface IAccount extends Document {
  title: String,
  accountId: Schema.Types.ObjectId
}

export interface ICustomer extends Document {
  name: String,
  email: String,
  accounts: Array<IAccount>,
  address: String,
  createdBy: Schema.Types.ObjectId,
  updatedBy: Schema.Types.ObjectId,
  isDeleted: Boolean
}

const accounts: Schema = new Schema({
  title: {
    type: String
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'accounts'
  }
}, { _id: false });

const CustomerSchema: Schema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  accounts: [accounts],
  address: {
    type: String,
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
      delete ret.__v;
    }
  }
});


export default mongoose.model<ICustomer>(`customers`, CustomerSchema);
