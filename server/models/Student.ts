import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill {
  name: string;
  category: 'Programming' | 'Design' | 'Languages' | 'Academics' | 'Hobbies' | 'Music';
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface IReview {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface IStudent extends Document {
  id: string; // custom id like 'user-current'
  name: string;
  avatar: string;
  bio: string;
  major: string;
  karma: number;
  skillsToTeach: ISkill[];
  skillsToLearn: string[];
  reviews: IReview[];
  rating: number;
  badges: string[];
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  category: { type: String, enum: ['Programming', 'Design', 'Languages', 'Academics', 'Hobbies', 'Music'], required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], required: true }
});

const ReviewSchema = new Schema<IReview>({
  id: { type: String, required: true },
  reviewerName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: String, required: true }
});

const StudentSchema = new Schema<IStudent>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  bio: { type: String, required: true },
  major: { type: String, required: true },
  karma: { type: Number, default: 0 },
  skillsToTeach: [SkillSchema],
  skillsToLearn: [String],
  reviews: [ReviewSchema],
  rating: { type: Number, default: 5.0 },
  badges: [String]
});

export default mongoose.model<IStudent>('Student', StudentSchema);
