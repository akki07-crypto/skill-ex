import mongoose, { Schema, Document } from 'mongoose';

export interface IForumReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  upvotes: number;
  votedBy: string[];
  createdAt: string;
}

export interface IForumPost extends Document {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  votedBy: string[];
  replies: IForumReply[];
  createdAt: string;
}

const ForumReplySchema = new Schema<IForumReply>({
  id: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String, required: true },
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  votedBy: [String],
  createdAt: { type: String, required: true }
});

const ForumPostSchema = new Schema<IForumPost>({
  id: { type: String, required: true, unique: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  upvotes: { type: Number, default: 0 },
  votedBy: [String],
  replies: [ForumReplySchema],
  createdAt: { type: String, required: true }
});

export default mongoose.model<IForumPost>('Forum', ForumPostSchema);
