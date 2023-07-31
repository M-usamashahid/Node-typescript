import mongoose, { Schema, Document } from "mongoose";

export interface IAccount extends Document {
    title: String,
    amount: Number,
    currency: String,
    transferLimit: Number,
    customer: {
        name: String,
        id: Schema.Types.ObjectId
    },
    createdBy: Schema.Types.ObjectId,
    updatedBy: Schema.Types.ObjectId,
    status: Boolean
    isDeleted: Boolean,
}

const AccountSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    amount: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'pkr'
    },
    transferLimit: {
        type: Number,
        default: 100000
    },
    customer: {
        name: String,
        id: {
            type: Schema.Types.ObjectId,
            ref: 'customers'
        },
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    status: {
        type: Boolean,
        default: true,
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

AccountSchema.index({
    title: "text",
});

export default mongoose.model<IAccount>(`accounts`, AccountSchema);