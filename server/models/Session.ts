import mongoose, { Schema, Document } from 'mongoose';

export interface IResource {
  title: string;
  url: string;
  addedBy: string;
}

export interface ISession extends Document {
  id: string;
  requestId: string;
  studentAId: string;
  studentBId: string;
  teachSkill: string;
  learnSkill: string;
  scheduledTime: string;
  status: 'upcoming' | 'active' | 'completed';
  notes: string;
  whiteboardData: string;
  resources: IResource[];
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  addedBy: { type: String, required: true }
});

const SessionSchema = new Schema<ISession>({
  id: { type: String, required: true, unique: true },
  requestId: { type: String, required: true },
  studentAId: { type: String, required: true },
  studentBId: { type: String, required: true },
  teachSkill: { type: String, required: true },
  learnSkill: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'upcoming' },
  notes: { type: String, default: '' },
  whiteboardData: { type: String, default: '' },
  resources: [ResourceSchema]
});

export default mongoose.model<ISession>('Session', SessionSchema);
