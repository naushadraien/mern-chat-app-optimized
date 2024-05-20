import mongoose, { type Model, model, Schema, Types } from 'mongoose';

import { type ChatType } from '../Types/types';

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
