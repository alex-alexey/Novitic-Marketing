import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEmailLog extends Document {
  campaignId: mongoose.Types.ObjectId;
  contactId: mongoose.Types.ObjectId;
  email: string;
  contactName: string;
  sentAt: Date;
  openedAt?: Date;
  opened: boolean;
}

const EmailLogSchema = new Schema<IEmailLog>(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: "Campaign", required: true, index: true },
    contactId: { type: Schema.Types.ObjectId, ref: "Contact", required: true },
    email: { type: String, required: true },
    contactName: { type: String, required: true },
    sentAt: { type: Date, required: true },
    openedAt: { type: Date },
    opened: { type: Boolean, default: false },
  },
  { timestamps: false }
);

const EmailLog: Model<IEmailLog> =
  mongoose.models.EmailLog ?? mongoose.model<IEmailLog>("EmailLog", EmailLogSchema);

export default EmailLog;
