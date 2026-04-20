import mongoose, { Document, Model, Schema } from "mongoose";

export type CampaignCategory = "pagina-web" | "servicios-informaticos" | "otro";

export interface ICampaign extends Document {
  name: string;
  subject: string;
  body: string;
  categoria: CampaignCategory;
  templateId?: mongoose.Types.ObjectId;
  status: "borrador" | "enviada" | "programada";
  tags: string[];
  recipientCount: number;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    categoria: {
      type: String,
      enum: ["pagina-web", "servicios-informaticos", "otro"],
      default: "otro",
    },
    templateId: { type: Schema.Types.ObjectId, ref: "Template" },
    status: { type: String, enum: ["borrador", "enviada", "programada"], default: "borrador" },
    tags: { type: [String], default: [] },
    recipientCount: { type: Number, default: 0 },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

const Campaign: Model<ICampaign> =
  mongoose.models.Campaign ?? mongoose.model<ICampaign>("Campaign", CampaignSchema);

export default Campaign;
