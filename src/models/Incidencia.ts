import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IComentario {
  texto: string;
  autor: string;
  fecha: Date;
}

export interface IIncidencia extends Document {
  clienteId?: Types.ObjectId;
  emailContacto?: string;
  titulo: string;
  descripcion?: string;
  estado: "abierta" | "en-progreso" | "resuelta" | "cerrada";
  prioridad: "baja" | "media" | "alta" | "critica";
  fechaApertura: Date;
  fechaCierre?: Date;
  horasConsumidas: number;
  notas?: string;
  comentarios: IComentario[];
  createdAt: Date;
  updatedAt: Date;
}

const IncidenciaSchema = new Schema<IIncidencia>(
  {
    clienteId: { type: Schema.Types.ObjectId, ref: "Cliente" },
    emailContacto: { type: String },
    titulo: { type: String, required: true },
    descripcion: { type: String },
    estado: {
      type: String,
      enum: ["abierta", "en-progreso", "resuelta", "cerrada"],
      default: "abierta",
    },
    prioridad: {
      type: String,
      enum: ["baja", "media", "alta", "critica"],
      default: "media",
    },
    fechaApertura: { type: Date, default: Date.now },
    fechaCierre: { type: Date },
    horasConsumidas: { type: Number, default: 0 },
    notas: { type: String },
    comentarios: {
      type: [
        new Schema<IComentario>(
          { texto: { type: String, required: true }, autor: { type: String, default: "Admin" }, fecha: { type: Date, default: Date.now } },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Incidencia: Model<IIncidencia> =
  mongoose.models.Incidencia ||
  mongoose.model<IIncidencia>("Incidencia", IncidenciaSchema);

export default Incidencia;
