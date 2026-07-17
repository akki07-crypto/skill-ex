import mongoose, { Schema, Document } from 'mongoose';

export interface IExchangeRequest extends Document {
  id: string;
  senderId: string;
  receiverId: string;
  teachSkill: string;
  learnSkill: string;
  proposedDate: string;
  proposedTime: string;
  agenda: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
}

const RequestSchema = new Schema<IExchangeRequest>({
  id: { type: String, required: true, unique: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  teachSkill: { type: String, required: true },
  learnSkill: { type: String, required: true },
  proposedDate: { type: String, required: true },
  proposedTime: { type: String, required: true },
  agenda: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'completed'], default: 'pending' }
});

export default mongoose.model<IExchangeRequest>('Request', RequestSchema);
