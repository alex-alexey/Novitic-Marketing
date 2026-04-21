import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IConcepto {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}

export interface IFactura extends Document {
  clienteId: Types.ObjectId;
  numero: string;
  conceptos: IConcepto[];
  importe: number;
  estado: "pendiente" | "pagada" | "vencida" | "cancelada";
  fechaEmision: Date;
  fechaVencimiento: Date;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConceptoSchema = new Schema<IConcepto>(
  {
    descripcion: { type: String, required: true },
    cantidad: { type: Number, required: true, default: 1 },
    precioUnitario: { type: Number, required: true },
  },
  { _id: false }
);

const FacturaSchema = new Schema<IFactura>(
  {
    clienteId: { type: Schema.Types.ObjectId, ref: "Cliente", required: true },
    numero: { type: String, required: true, unique: true },
    conceptos: { type: [ConceptoSchema], default: [] },
    importe: { type: Number, required: true },
    estado: {
      type: String,
      enum: ["pendiente", "pagada", "vencida", "cancelada"],
      default: "pendiente",
    },
    fechaEmision: { type: Date, default: Date.now },
    fechaVencimiento: { type: Date, required: true },
    notas: { type: String },
  },
  { timestamps: true }
);

const Factura: Model<IFactura> =
  mongoose.models.Factura || mongoose.model<IFactura>("Factura", FacturaSchema);

export default Factura;
