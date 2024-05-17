import mongoose, { Schema, Types, model, Model } from 'mongoose';
import { ChatType } from '../Types/types.js';

const chatSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Chat name is required'],
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export const Chat: Model<ChatType> = mongoose.models.Chat || model('Chat', chatSchema);
