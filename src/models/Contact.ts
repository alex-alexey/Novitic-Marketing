import mongoose, { Document, Model, Schema } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  profesion?: string;
  localidad?: string;
  objetivo?: "pagina-web" | "servicios-informaticos" | "otro" | "";
  tags: string[];
  status: "activo" | "inactivo" | "no-contactar";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    profesion: { type: String, trim: true },
    localidad: { type: String, trim: true },
    objetivo: { type: String, enum: ["pagina-web", "servicios-informaticos", "otro", ""], default: "" },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["activo", "inactivo", "no-contactar"], default: "activo" },
    notes: { type: String },
  },
  { timestamps: true }
);

const Contact: Model<IContact> =
  mongoose.models.Contact ?? mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
