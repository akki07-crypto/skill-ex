import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Index to optimize chat history loading
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
