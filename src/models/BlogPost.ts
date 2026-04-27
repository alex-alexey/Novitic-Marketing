import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  cat: string;
  excerpt: string;
  content: string;
  date: string;
  read: string;
  featured: boolean;
  published: boolean;
  bg: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title:     { type: String, required: true },
    slug:      { type: String, required: true, unique: true },
    cat:       { type: String, required: true },
    excerpt:   { type: String, required: true },
    content:   { type: String, default: "" },
    date:      { type: String, required: true },
    read:      { type: String, default: "3 min" },
    featured:  { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    bg:        { type: String, default: "linear-gradient(135deg,#0a2a3a,#0d4a6a)" },
  },
  { timestamps: true }
);

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ?? mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
