import mongoose, { Schema, Document } from "mongoose";

export interface ITranscation extends Document {
    amount: Number,
    currency: String,
    type: String,
    account: {
        title: String,
        id: Schema.Types.ObjectId,
        customer: {
            name: String,
            id: Schema.Types.ObjectId,
        }
    },
    secondaryAccount: {
        title: String,
        id: Schema.Types.ObjectId,
        customer: {
            name: String,
            id: Schema.Types.ObjectId,
        }
    },

    createdBy: Schema.Types.ObjectId
}

const TranscationSchema: Schema = new Schema({
    account: {
        title: String,
        id: {
            type: Schema.Types.ObjectId,
            ref: 'accounts',
            required: true
        },
        customer: {
            name: String,
            id: {
                type: Schema.Types.ObjectId,
                ref: 'customers',
                required: true
            }
        },
    },
    secondaryAccount: {
        title: String,
        id: {
            type: Schema.Types.ObjectId,
            ref: 'accounts',
        },
        customer: {
            name: String,
            id: {
                type: Schema.Types.ObjectId,
                ref: 'customers',
            }
        },
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        }
    }
});

TranscationSchema.index({
    'account.id': "text",
});

export default mongoose.model<ITranscation>(`transcations`, TranscationSchema);