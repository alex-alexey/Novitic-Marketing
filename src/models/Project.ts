import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  name: string;
  tagline: string;
  category: "Desarrollo Web" | "Branding" | "Servicios IT";
  year: number;
  bg: string;
  image: string;
  client: string;
  tech: string;
  status: string;
  desc: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name:     { type: String, required: true },
    tagline:  { type: String, required: true },
    category: { type: String, required: true, enum: ["Desarrollo Web", "Branding", "Servicios IT"] },
    year:     { type: Number, required: true },
    bg:       { type: String, default: "linear-gradient(135deg,#0a1628,#112240)" },
    image:    { type: String, default: "" },
    client:   { type: String, required: true },
    tech:     { type: String, required: true },
    status:   { type: String, default: "Completado" },
    desc:     { type: String, required: true },
    link:     { type: String, default: "#" },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project ?? mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
